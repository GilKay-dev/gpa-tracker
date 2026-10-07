import { describe, expect, it } from 'vitest';
import {
  MESSAGES,
  roundTo1,
  validateCourse,
  validateCredits,
  validateName,
  validateScore,
} from '../src/validation.js';

describe('validateName', () => {
  it('bỏ khoảng trắng 2 đầu', () => {
    expect(validateName('  Giải tích 1  ')).toEqual({ value: 'Giải tích 1' });
  });

  it('báo lỗi khi trống hoặc chỉ có khoảng trắng', () => {
    expect(validateName('')).toEqual({ error: MESSAGES.nameRequired });
    expect(validateName('    ')).toEqual({ error: MESSAGES.nameRequired });
    expect(validateName(undefined)).toEqual({ error: MESSAGES.nameRequired });
  });

  it('chấp nhận đúng 100 ký tự, từ chối 101 ký tự', () => {
    expect(validateName('a'.repeat(100))).toEqual({ value: 'a'.repeat(100) });
    expect(validateName('a'.repeat(101))).toEqual({ error: MESSAGES.nameTooLong });
  });

  it('tính độ dài sau khi bỏ khoảng trắng 2 đầu', () => {
    expect(validateName(`  ${'a'.repeat(100)}  `)).toEqual({ value: 'a'.repeat(100) });
  });
});

describe('validateCredits', () => {
  it.each([
    ['1', 1],
    ['3', 3],
    ['10', 10],
    [' 4 ', 4],
  ])('chấp nhận %j', (input, expected) => {
    expect(validateCredits(input)).toEqual({ value: expected });
  });

  it.each(['', '0', '11', '-1', '2.5', '2,5', 'abc', '3a', '1e1'])('từ chối %j', (input) => {
    expect(validateCredits(input)).toEqual({ error: MESSAGES.creditsInvalid });
  });
});

describe('validateScore', () => {
  it.each([
    ['0', 0],
    ['10', 10],
    ['8.5', 8.5],
    ['8,5', 8.5],
    [' 7 ', 7],
    ['8.45', 8.5],
    ['8,44', 8.4],
    ['9.99', 10],
    ['3.95', 4],
    ['10.0', 10],
  ])('chấp nhận %j → %d', (input, expected) => {
    expect(validateScore(input)).toEqual({ value: expected });
  });

  it.each(['', '-1', '10.1', '11', 'abc', '8..5', '8,5,1', '.5', 'NaN', 'Infinity'])(
    'từ chối %j',
    (input) => {
      expect(validateScore(input)).toEqual({ error: MESSAGES.scoreInvalid });
    },
  );
});

describe('roundTo1', () => {
  it('làm tròn chính xác các giá trị dễ sai số', () => {
    expect(roundTo1(8.45)).toBe(8.5);
    expect(roundTo1(1.05)).toBe(1.1);
    expect(roundTo1(8.44)).toBe(8.4);
  });
});

describe('validateCourse', () => {
  it('trả về môn học đã chuẩn hoá khi hợp lệ', () => {
    expect(validateCourse({ name: ' Vật lý ', credits: '3', score: '8,45' })).toEqual({
      valid: true,
      course: { name: 'Vật lý', credits: 3, score: 8.5 },
    });
  });

  it('báo lỗi cả 3 ô cùng lúc', () => {
    expect(validateCourse({ name: '', credits: '0', score: '11' })).toEqual({
      valid: false,
      errors: {
        name: MESSAGES.nameRequired,
        credits: MESSAGES.creditsInvalid,
        score: MESSAGES.scoreInvalid,
      },
    });
  });

  it('chỉ báo lỗi ở ô sai', () => {
    expect(validateCourse({ name: 'Toán', credits: '3', score: 'x' })).toEqual({
      valid: false,
      errors: { score: MESSAGES.scoreInvalid },
    });
  });
});
