// F1 + F4 – Thao tác trên danh sách môn học. Hàm thuần, không sửa mảng gốc, không đụng tới DOM.

/** Thêm môn vào cuối danh sách. */
export function addCourse(courses, id, course) {
  return [...courses, { id, ...course }];
}

/** Cập nhật môn có `id`, giữ nguyên vị trí. Không tìm thấy thì trả về danh sách như cũ. */
export function updateCourse(courses, id, changes) {
  return courses.map((course) => (course.id === id ? { ...course, ...changes, id } : course));
}

/** Xoá môn có `id`. */
export function removeCourse(courses, id) {
  return courses.filter((course) => course.id !== id);
}

export function findCourse(courses, id) {
  return courses.find((course) => course.id === id) ?? null;
}

/** Đưa một môn lên form khi bấm "Sửa": điểm hiển thị dấu phẩy, 1 chữ số thập phân (8,5). */
export function courseToFormValues(course) {
  return {
    name: course.name,
    credits: String(course.credits),
    score: course.score.toFixed(1).replace('.', ','),
  };
}
