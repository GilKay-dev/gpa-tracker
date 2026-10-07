import './style.css';
import { validateCourse } from './validation.js';

const FIELDS = ['name', 'credits', 'score'];

const form = document.querySelector('#course-form');
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

let courses = [];
let nextId = 1;

function formatScore(score) {
  return score.toFixed(1).replace('.', ',');
}

function showErrors(errors = {}) {
  for (const field of FIELDS) {
    const message = errors[field] ?? '';
    errorEls[field].textContent = message;
    inputs[field].classList.toggle('invalid', message !== '');
    inputs[field].setAttribute('aria-invalid', String(message !== ''));
  }
}

function renderTable() {
  tbody.replaceChildren(
    ...courses.map((course, index) => {
      const row = document.createElement('tr');
      const cells = [
        [String(index + 1), ''],
        [course.name, 'name'],
        [String(course.credits), 'num'],
        [formatScore(course.score), 'num'],
      ];
      for (const [text, className] of cells) {
        const cell = document.createElement('td');
        cell.textContent = text;
        if (className) cell.className = className;
        row.append(cell);
      }
      return row;
    }),
  );
  emptyHint.hidden = courses.length > 0;
}

function resetForm() {
  form.reset();
  showErrors();
  inputs.name.focus();
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

  courses = [...courses, { id: nextId++, ...result.course }];
  renderTable();
  resetForm();
});

renderTable();
