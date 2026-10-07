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
import { validateCourse } from './validation.js';

const FIELDS = ['name', 'credits', 'score'];
const CONFIRM_DELETE = 'Bạn có chắc muốn xoá môn này?';

const form = document.querySelector('#course-form');
const formTitle = document.querySelector('#form-title');
const submitBtn = document.querySelector('#submit-btn');
const cancelBtn = document.querySelector('#cancel-btn');
const tbody = document.querySelector('#course-body');
const emptyHint = document.querySelector('#empty-hint');
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

let courses = [];
let nextId = 1;
/** id của môn đang sửa trên form; null = chế độ "Thêm môn". */
let editingId = null;

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
      const cells = [
        [String(index + 1), ''],
        [course.name, 'name'],
        [String(course.credits), 'num'],
        [formatScore(course.score), 'num'],
        [letter, 'num'],
        [formatScore(point4), 'num'],
      ];
      for (const [text, className] of cells) {
        const cell = document.createElement('td');
        cell.textContent = text;
        if (className) cell.className = className;
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
});

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
