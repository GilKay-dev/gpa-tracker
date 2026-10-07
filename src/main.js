import './style.css';
import {
  addCourse,
  courseToFormValues,
  findCourse,
  removeCourse,
  updateCourse,
} from './courses.js';
import { calculateSummary } from './gpa.js';
import { convertScore } from './grade.js';
import { loadCourses, nextIdAfter, saveCourses } from './storage.js';
import { validateCourse } from './validation.js';

const FIELDS = ['name', 'credits', 'score'];
const CONFIRM_DELETE = 'Bạn có chắc muốn xoá môn này?';
const CONFIRM_CLEAR_ALL = 'Xoá toàn bộ môn học? Không thể hoàn tác.';

const form = document.querySelector('#course-form');
const formTitle = document.querySelector('#form-title');
const submitBtn = document.querySelector('#submit-btn');
const cancelBtn = document.querySelector('#cancel-btn');
const tbody = document.querySelector('#course-body');
const emptyHint = document.querySelector('#empty-hint');
const clearAllBtn = document.querySelector('#clear-all-btn');
const saveWarning = document.querySelector('#save-warning');
const inputs = {
  name: document.querySelector('#course-name'),
  credits: document.querySelector('#course-credits'),
  score: document.querySelector('#course-score'),
};
const errorEls = {
  name: document.querySelector('#error-name'),
  credits: document.querySelector('#error-credits'),
  score: document.querySelector('#error-score'),
};
const summaryEls = {
  count: document.querySelector('#sum-count'),
  credits: document.querySelector('#sum-credits'),
  passed: document.querySelector('#sum-passed'),
  gpa4: document.querySelector('#sum-gpa4'),
  gpa10: document.querySelector('#sum-gpa10'),
  classification: document.querySelector('#sum-class'),
};

/** localStorage có thể bị trình duyệt chặn (chế độ riêng tư, tắt cookie…). */
function getStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

const storage = getStorage();
let courses = storage ? loadCourses(storage) : [];
let nextId = nextIdAfter(courses);
/** id của môn đang sửa trên form; null = chế độ "Thêm môn". */
let editingId = null;

/** Ghi danh sách hiện tại; không ghi được thì hiện thông báo, ứng dụng vẫn chạy. */
function persist() {
  const saved = storage !== null && saveCourses(storage, courses);
  saveWarning.hidden = saved;
}

function formatScore(score) {
  return score.toFixed(1).replace('.', ',');
}

function formatGpa(gpa) {
  return gpa === null ? '—' : gpa.toFixed(2).replace('.', ',');
}

function showErrors(errors = {}) {
  for (const field of FIELDS) {
    const message = errors[field] ?? '';
    errorEls[field].textContent = message;
    inputs[field].classList.toggle('invalid', message !== '');
    inputs[field].setAttribute('aria-invalid', String(message !== ''));
  }
}

function createActionButton(label, action, course) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `btn btn-small ${action === 'delete' ? 'btn-danger' : 'btn-secondary'}`;
  button.textContent = label;
  button.dataset.action = action;
  button.dataset.id = String(course.id);
  button.setAttribute('aria-label', `${label} môn ${course.name}`);
  return button;
}

function renderTable() {
  tbody.replaceChildren(
    ...courses.map((course, index) => {
      const row = document.createElement('tr');
      row.classList.toggle('editing', course.id === editingId);
      const { letter, point4 } = convertScore(course.score);
      // Nhãn cột dùng cho giao diện điện thoại (mỗi dòng hiển thị như một thẻ).
      const cells = [
        [String(index + 1), 'index', '#'],
        [course.name, 'name', 'Tên môn'],
        [String(course.credits), 'num', 'Tín chỉ'],
        [formatScore(course.score), 'num', 'Điểm hệ 10'],
        [letter, 'num', 'Điểm chữ'],
        [formatScore(point4), 'num', 'Hệ 4'],
      ];
      for (const [text, className, label] of cells) {
        const cell = document.createElement('td');
        cell.textContent = text;
        cell.className = className;
        cell.dataset.label = label;
        row.append(cell);
      }
      const actionCell = document.createElement('td');
      actionCell.className = 'row-actions';
      actionCell.append(
        createActionButton('Sửa', 'edit', course),
        createActionButton('Xoá', 'delete', course),
      );
      row.append(actionCell);
      return row;
    }),
  );
  emptyHint.hidden = courses.length > 0;
  clearAllBtn.disabled = courses.length === 0;
}

function renderSummary() {
  const summary = calculateSummary(courses);
  summaryEls.count.textContent = String(summary.courseCount);
  summaryEls.credits.textContent = String(summary.totalCredits);
  summaryEls.passed.textContent = String(summary.passedCredits);
  summaryEls.gpa4.textContent = formatGpa(summary.gpa4);
  summaryEls.gpa10.textContent = formatGpa(summary.gpa10);
  summaryEls.classification.textContent = summary.classification ?? '—';
}

function render() {
  renderTable();
  renderSummary();
}

function setEditing(id) {
  editingId = id;
  const editing = id !== null;
  formTitle.textContent = editing ? 'Sửa môn học' : 'Thêm môn học';
  submitBtn.textContent = editing ? 'Lưu' : 'Thêm môn';
  cancelBtn.hidden = !editing;
}

/** Xoá trắng form, thoát chế độ sửa, đặt con trỏ vào ô Tên môn. */
function resetForm() {
  form.reset();
  showErrors();
  setEditing(null);
  inputs.name.focus();
}

function startEdit(id) {
  const course = findCourse(courses, id);
  if (!course) return;
  const values = courseToFormValues(course);
  for (const field of FIELDS) inputs[field].value = values[field];
  showErrors();
  setEditing(id);
  renderTable();
  inputs.name.focus();
}

function deleteCourse(id) {
  if (!window.confirm(CONFIRM_DELETE)) return;
  courses = removeCourse(courses, id);
  if (id === editingId) resetForm();
  render();
  persist();
}

function clearAll() {
  if (courses.length === 0 || !window.confirm(CONFIRM_CLEAR_ALL)) return;
  courses = [];
  resetForm();
  render();
  persist();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const result = validateCourse({
    name: inputs.name.value,
    credits: inputs.credits.value,
    score: inputs.score.value,
  });

  if (!result.valid) {
    showErrors(result.errors);
    const firstInvalid = FIELDS.find((field) => result.errors[field]);
    inputs[firstInvalid].focus();
    return;
  }

  courses =
    editingId === null
      ? addCourse(courses, nextId++, result.course)
      : updateCourse(courses, editingId, result.course);
  resetForm();
  render();
  persist();
});

clearAllBtn.addEventListener('click', clearAll);

cancelBtn.addEventListener('click', () => {
  resetForm();
  renderTable();
});

form.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && editingId !== null) {
    resetForm();
    renderTable();
  }
});

tbody.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const id = Number(button.dataset.id);
  if (button.dataset.action === 'edit') startEdit(id);
  else if (button.dataset.action === 'delete') deleteCourse(id);
});

render();
