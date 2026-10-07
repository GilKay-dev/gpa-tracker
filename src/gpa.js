// F3 – Tính GPA và xếp loại. Hàm thuần, không đụng tới DOM.
import { convertScore } from './grade.js';

export const PASS_SCORE = 4.0;

/** Ngưỡng xếp loại theo GPA hệ 4, xếp từ cao xuống thấp. */
export const CLASSIFICATIONS = [
  { min: 3.6, label: 'Xuất sắc' },
  { min: 3.2, label: 'Giỏi' },
  { min: 2.5, label: 'Khá' },
  { min: 2.0, label: 'Trung bình' },
  { min: 0, label: 'Yếu' },
];

/** Làm tròn 2 chữ số thập phân, tránh sai số dấu phẩy động (3.595 → 3.6). */
export function roundTo2(value) {
  return Number(`${Math.round(Number(`${value}e2`))}e-2`);
}

export function classify(gpa4) {
  return (CLASSIFICATIONS.find(({ min }) => gpa4 >= min) ?? CLASSIFICATIONS.at(-1)).label;
}

/**
 * Tổng kết danh sách môn: { courseCount, totalCredits, passedCredits, gpa4, gpa10, classification }.
 * Danh sách rỗng → gpa4, gpa10, classification là null (giao diện hiện "—").
 */
export function calculateSummary(courses) {
  let totalCredits = 0;
  let passedCredits = 0;
  // Cộng theo đơn vị 0,1 điểm (số nguyên) để tổng không bị sai số dấu phẩy động.
  let weighted4 = 0;
  let weighted10 = 0;

  for (const { credits, score } of courses) {
    totalCredits += credits;
    if (score >= PASS_SCORE) passedCredits += credits;
    weighted4 += Math.round(convertScore(score).point4 * 10) * credits;
    weighted10 += Math.round(score * 10) * credits;
  }

  if (totalCredits === 0) {
    return {
      courseCount: courses.length,
      totalCredits,
      passedCredits,
      gpa4: null,
      gpa10: null,
      classification: null,
    };
  }

  const gpa4 = roundTo2(weighted4 / (totalCredits * 10));
  const gpa10 = roundTo2(weighted10 / (totalCredits * 10));

  return {
    courseCount: courses.length,
    totalCredits,
    passedCredits,
    gpa4,
    gpa10,
    classification: classify(gpa4),
  };
}
