import { describe, expect, it } from 'vitest';
import {
  STORAGE_KEY,
  loadCourses,
  nextIdAfter,
  parseStoredCourses,
  saveCourses,
  serializeCourses,
} from '../src/storage.js';

const list = [
  { id: 1, name: 'Giải tích 1', credits: 3, score: 8.5 },
  { id: 2, name: 'Vật lý', credits: 2, score: 6 },
];

/** Giả lập localStorage trong bộ nhớ. */
function memoryStorage(initial = {}) {
  const data = { ...initial };
  return {
    data,
    getItem: (key) => (key in data ? data[key] : null),
    setItem: (key, value) => {
      data[key] = String(value);
    },
  };
}

describe('STORAGE_KEY', () => {
  it('đúng key trong PRD', () => {
    expect(STORAGE_KEY).toBe('gpa-tracker:v1');
  });
});

describe('parseStoredCourses', () => {
  it('đọc lại đúng dữ liệu đã ghi', () => {
    expect(parseStoredCourses(serializeCourses(list))).toEqual(list);
  });

  it('chưa có dữ liệu → danh sách rỗng', () => {
    expect(parseStoredCourses(null)).toEqual([]);
    expect(parseStoredCourses('')).toEqual([]);
  });

  it('JSON hỏng → danh sách rỗng, không ném lỗi', () => {
    expect(parseStoredCourses('{abc')).toEqual([]);
    expect(parseStoredCourses('[{"id":1,')).toEqual([]);
  });

  it('không phải danh sách → danh sách rỗng', () => {
    expect(parseStoredCourses('{"id":1}')).toEqual([]);
    expect(parseStoredCourses('null')).toEqual([]);
    expect(parseStoredCourses('42')).toEqual([]);
    expect(parseStoredCourses('"chuỗi"')).toEqual([]);
  });

  it('hỏng một phần → giữ môn hợp lệ, bỏ môn sai', () => {
    const raw = JSON.stringify([
      list[0],
      null,
      'abc',
      [1, 2],
      { id: 3, name: '', credits: 3, score: 7 },
      { id: 4, name: 'A'.repeat(101), credits: 3, score: 7 },
      { id: 5, name: 'Hoá', credits: 0, score: 7 },
      { id: 6, name: 'Hoá', credits: 11, score: 7 },
      { id: 7, name: 'Hoá', credits: 2.5, score: 7 },
      { id: 8, name: 'Hoá', credits: '3', score: 7 },
      { id: 9, name: 'Hoá', credits: 3, score: -1 },
      { id: 10, name: 'Hoá', credits: 3, score: 10.5 },
      { id: 11, name: 'Hoá', credits: 3, score: '7' },
      { id: 12, name: 123, credits: 3, score: 7 },
      { id: 0, name: 'Hoá', credits: 3, score: 7 },
      { id: '13', name: 'Hoá', credits: 3, score: 7 },
      { name: 'Hoá', credits: 3, score: 7 },
      list[1],
    ]);
    expect(parseStoredCourses(raw)).toEqual(list);
  });

  it('bỏ môn trùng id, giữ môn xuất hiện trước', () => {
    const raw = JSON.stringify([list[0], { ...list[1], id: 1 }]);
    expect(parseStoredCourses(raw)).toEqual([list[0]]);
  });

  it('chuẩn hoá môn đọc được: bỏ khoảng trắng tên, làm tròn điểm, bỏ trường thừa', () => {
    const raw = JSON.stringify([{ id: 5, name: '  Hoá  ', credits: 3, score: 8.45, extra: 1 }]);
    expect(parseStoredCourses(raw)).toEqual([{ id: 5, name: 'Hoá', credits: 3, score: 8.5 }]);
  });

  it('chấp nhận điểm biên 0 và 10, tín chỉ biên 1 và 10', () => {
    const edge = [
      { id: 1, name: 'A', credits: 1, score: 0 },
      { id: 2, name: 'B', credits: 10, score: 10 },
    ];
    expect(parseStoredCourses(JSON.stringify(edge))).toEqual(edge);
  });
});

describe('serializeCourses', () => {
  it('chỉ ghi 4 trường id, name, credits, score', () => {
    const raw = serializeCourses([{ ...list[0], letter: 'A' }]);
    expect(JSON.parse(raw)).toEqual([list[0]]);
  });

  it('danh sách rỗng → "[]"', () => {
    expect(serializeCourses([])).toBe('[]');
  });
});

describe('nextIdAfter', () => {
  it('danh sách rỗng → 1', () => {
    expect(nextIdAfter([])).toBe(1);
  });

  it('lớn hơn id lớn nhất, kể cả khi id không liên tiếp', () => {
    expect(nextIdAfter([{ id: 7 }, { id: 3 }])).toBe(8);
  });
});

describe('loadCourses', () => {
  it('đọc từ key gpa-tracker:v1', () => {
    const storage = memoryStorage({ [STORAGE_KEY]: serializeCourses(list) });
    expect(loadCourses(storage)).toEqual(list);
  });

  it('chưa có key → danh sách rỗng', () => {
    expect(loadCourses(memoryStorage())).toEqual([]);
  });

  it('trình duyệt chặn đọc → danh sách rỗng, không ném lỗi', () => {
    const storage = {
      getItem: () => {
        throw new Error('SecurityError');
      },
    };
    expect(loadCourses(storage)).toEqual([]);
  });
});

describe('saveCourses', () => {
  it('ghi vào key gpa-tracker:v1 và trả về true', () => {
    const storage = memoryStorage();
    expect(saveCourses(storage, list)).toBe(true);
    expect(loadCourses(storage)).toEqual(list);
  });

  it('lưu danh sách rỗng (Xoá tất cả)', () => {
    const storage = memoryStorage({ [STORAGE_KEY]: serializeCourses(list) });
    expect(saveCourses(storage, [])).toBe(true);
    expect(storage.data[STORAGE_KEY]).toBe('[]');
    expect(loadCourses(storage)).toEqual([]);
  });

  it('không ghi được (đầy bộ nhớ / bị chặn) → false, không ném lỗi', () => {
    const storage = {
      setItem: () => {
        throw new Error('QuotaExceededError');
      },
    };
    expect(saveCourses(storage, list)).toBe(false);
  });
});
