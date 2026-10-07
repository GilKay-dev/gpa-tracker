import { describe, expect, it } from 'vitest';
import {
  addCourse,
  courseToFormValues,
  findCourse,
  removeCourse,
  updateCourse,
} from '../src/courses.js';
import { validateCourse } from '../src/validation.js';

const list = [
  { id: 1, name: 'Giải tích 1', credits: 3, score: 8.5 },
  { id: 2, name: 'Vật lý', credits: 2, score: 6 },
  { id: 3, name: 'Tin học', credits: 4, score: 9.2 },
];

describe('addCourse', () => {
  it('thêm vào cuối danh sách, không sửa mảng gốc', () => {
    const result = addCourse(list, 4, { name: 'Hoá', credits: 3, score: 7 });
    expect(result).toHaveLength(4);
    expect(result[3]).toEqual({ id: 4, name: 'Hoá', credits: 3, score: 7 });
    expect(list).toHaveLength(3);
  });
});

describe('updateCourse', () => {
  it('cập nhật đúng môn, giữ nguyên vị trí', () => {
    const result = updateCourse(list, 2, { name: 'Vật lý 1', credits: 3, score: 7.5 });
    expect(result.map((c) => c.id)).toEqual([1, 2, 3]);
    expect(result[1]).toEqual({ id: 2, name: 'Vật lý 1', credits: 3, score: 7.5 });
    expect(result[0]).toBe(list[0]);
    expect(result[2]).toBe(list[2]);
  });

  it('không sửa mảng gốc', () => {
    updateCourse(list, 2, { name: 'Khác' });
    expect(list[1].name).toBe('Vật lý');
  });

  it('không đổi được id', () => {
    const result = updateCourse(list, 2, { id: 99, name: 'X' });
    expect(result[1].id).toBe(2);
  });

  it('id không tồn tại thì danh sách giữ nguyên', () => {
    expect(updateCourse(list, 42, { name: 'X' })).toEqual(list);
  });
});

describe('removeCourse', () => {
  it('xoá đúng môn, giữ thứ tự các môn còn lại', () => {
    const result = removeCourse(list, 2);
    expect(result.map((c) => c.id)).toEqual([1, 3]);
    expect(list).toHaveLength(3);
  });

  it('id không tồn tại thì danh sách giữ nguyên', () => {
    expect(removeCourse(list, 42)).toEqual(list);
  });

  it('xoá môn cuối cùng thì danh sách rỗng', () => {
    expect(removeCourse([list[0]], 1)).toEqual([]);
  });
});

describe('findCourse', () => {
  it('tìm theo id', () => {
    expect(findCourse(list, 3)).toBe(list[2]);
  });

  it('không có thì trả về null', () => {
    expect(findCourse(list, 42)).toBeNull();
  });
});

describe('courseToFormValues', () => {
  it.each([
    [8.5, '8,5'],
    [6, '6,0'],
    [10, '10,0'],
    [0, '0,0'],
  ])('điểm %s → "%s"', (score, expected) => {
    expect(courseToFormValues({ name: 'A', credits: 3, score }).score).toBe(expected);
  });

  it('đưa tên và tín chỉ lên form dạng chuỗi', () => {
    expect(courseToFormValues(list[0])).toEqual({ name: 'Giải tích 1', credits: '3', score: '8,5' });
  });

  it('dữ liệu đưa lên form qua lại validation (F1) vẫn ra đúng môn cũ', () => {
    for (const course of list) {
      const { id, ...data } = course;
      expect(validateCourse(courseToFormValues(course))).toEqual({ valid: true, course: data });
    }
  });
});
