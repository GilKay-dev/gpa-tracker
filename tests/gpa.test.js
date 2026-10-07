import { describe, expect, it } from 'vitest';
import { calculateSummary, classify, roundTo2 } from '../src/gpa.js';

const course = (credits, score) => ({ name: 'Môn', credits, score });

describe('roundTo2', () => {
  it.each([
    [3.595, 3.6],
    [3.594, 3.59],
    [1.005, 1.01],
    [8.125, 8.13],
    [2.4, 2.4],
  ])('%s → %s', (input, expected) => {
    expect(roundTo2(input)).toBe(expected);
  });
});

describe('classify', () => {
  it.each([
    [4.0, 'Xuất sắc'],
    [3.6, 'Xuất sắc'],
    [3.59, 'Giỏi'],
    [3.2, 'Giỏi'],
    [3.19, 'Khá'],
    [2.5, 'Khá'],
    [2.49, 'Trung bình'],
    [2.0, 'Trung bình'],
    [1.99, 'Yếu'],
    [0, 'Yếu'],
  ])('%s → %s', (gpa4, label) => {
    expect(classify(gpa4)).toBe(label);
  });
});

describe('calculateSummary', () => {
  it('danh sách rỗng → 0 và null', () => {
    expect(calculateSummary([])).toEqual({
      courseCount: 0,
      totalCredits: 0,
      passedCredits: 0,
      gpa4: null,
      gpa10: null,
      classification: null,
    });
  });

  it('một môn', () => {
    expect(calculateSummary([course(3, 7.5)])).toEqual({
      courseCount: 1,
      totalCredits: 3,
      passedCredits: 3,
      gpa4: 3.0,
      gpa10: 7.5,
      classification: 'Khá',
    });
  });

  it('nhiều môn – tính trung bình có trọng số theo tín chỉ', () => {
    expect(calculateSummary([course(3, 8.5), course(2, 3.5)])).toEqual({
      courseCount: 2,
      totalCredits: 5,
      passedCredits: 3,
      gpa4: 2.4,
      gpa10: 6.5,
      classification: 'Trung bình',
    });
  });

  it('tín chỉ đạt: điểm 4.0 được tính, 3.9 thì không', () => {
    const summary = calculateSummary([course(2, 4.0), course(3, 3.9)]);
    expect(summary.passedCredits).toBe(2);
    expect(summary.totalCredits).toBe(5);
  });

  it('GPA hệ 10 không bị sai số khi cộng số thập phân', () => {
    // (8.1×3 + 8.2×1) / 4 = 8.125 → 8.13
    expect(calculateSummary([course(3, 8.1), course(1, 8.2)]).gpa10).toBe(8.13);
  });

  it('xếp loại theo GPA hệ 4 đã làm tròn (3.595 → 3.60 → Xuất sắc)', () => {
    // A: 19 tín chỉ, B+: 81 tín chỉ → (4.0×19 + 3.5×81) / 100 = 3.595
    const courses = [
      course(10, 9),
      course(9, 9),
      ...Array.from({ length: 8 }, () => course(10, 8)),
      course(1, 8),
    ];
    const summary = calculateSummary(courses);
    expect(summary.totalCredits).toBe(100);
    expect(summary.gpa4).toBe(3.6);
    expect(summary.classification).toBe('Xuất sắc');
  });

  it('GPA hệ 4 làm tròn 2 chữ số', () => {
    // (4.0×2 + 3.0×1) / 3 = 3.666… → 3.67
    expect(calculateSummary([course(2, 9), course(1, 7)]).gpa4).toBe(3.67);
  });
});
