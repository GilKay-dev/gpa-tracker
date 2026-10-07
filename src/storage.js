// F5 – Lưu và tải danh sách môn học. Phần đọc/ghi chuỗi là hàm thuần; phần đụng tới
// localStorage nhận `storage` làm tham số để kiểm thử được mà không cần trình duyệt.

import { validateCourse } from './validation.js';

export const STORAGE_KEY = 'gpa-tracker:v1';

/**
 * Kiểm tra một môn đọc từ dữ liệu lưu. Dùng lại luật kiểm tra của F1.
 * Trả về môn đã chuẩn hoá hoặc null nếu môn sai dữ liệu.
 */
function parseCourse(item) {
  if (item === null || typeof item !== 'object' || Array.isArray(item)) return null;
  const { id, name, credits, score } = item;
  if (!Number.isInteger(id) || id < 1) return null;
  if (typeof name !== 'string') return null;
  if (typeof credits !== 'number' || typeof score !== 'number' || !Number.isFinite(score)) {
    return null;
  }
  const result = validateCourse({ name, credits: String(credits), score: String(score) });
  return result.valid ? { id, ...result.course } : null;
}

/**
 * Đọc chuỗi đã lưu thành danh sách môn.
 * - Không có dữ liệu, JSON hỏng, hoặc không phải danh sách → [].
 * - Danh sách hỏng một phần → giữ các môn hợp lệ, bỏ môn sai và môn trùng id.
 */
export function parseStoredCourses(raw) {
  if (typeof raw !== 'string' || raw === '') return [];
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(data)) return [];

  const seenIds = new Set();
  const courses = [];
  for (const item of data) {
    const course = parseCourse(item);
    if (!course || seenIds.has(course.id)) continue;
    seenIds.add(course.id);
    courses.push(course);
  }
  return courses;
}

export function serializeCourses(courses) {
  return JSON.stringify(
    courses.map(({ id, name, credits, score }) => ({ id, name, credits, score })),
  );
}

/** id cho môn thêm tiếp theo: lớn hơn mọi id đang có. */
export function nextIdAfter(courses) {
  return courses.reduce((max, course) => Math.max(max, course.id), 0) + 1;
}

/** Tải danh sách từ `storage`. Không đọc được vì bất kỳ lý do gì → []. */
export function loadCourses(storage) {
  try {
    return parseStoredCourses(storage.getItem(STORAGE_KEY));
  } catch {
    return [];
  }
}

/** Ghi danh sách vào `storage`. Trả về true nếu ghi thành công. */
export function saveCourses(storage, courses) {
  try {
    storage.setItem(STORAGE_KEY, serializeCourses(courses));
    return true;
  } catch {
    return false;
  }
}
