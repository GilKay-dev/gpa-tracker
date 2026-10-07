// F2 – Quy đổi điểm hệ 10 → điểm chữ → hệ 4. Hàm thuần, không đụng tới DOM.

/** Bảng quy đổi theo PRD, xếp từ ngưỡng cao xuống thấp. */
export const GRADE_SCALE = [
  { min: 8.5, letter: 'A', point4: 4.0 },
  { min: 8.0, letter: 'B+', point4: 3.5 },
  { min: 7.0, letter: 'B', point4: 3.0 },
  { min: 6.5, letter: 'C+', point4: 2.5 },
  { min: 5.5, letter: 'C', point4: 2.0 },
  { min: 5.0, letter: 'D+', point4: 1.5 },
  { min: 4.0, letter: 'D', point4: 1.0 },
  { min: 0, letter: 'F', point4: 0.0 },
];

/**
 * Quy đổi điểm hệ 10 (đã làm tròn 1 chữ số ở bước kiểm tra F1).
 * Trả về { letter, point4 }.
 */
export function convertScore(score10) {
  const band = GRADE_SCALE.find(({ min }) => score10 >= min) ?? GRADE_SCALE.at(-1);
  return { letter: band.letter, point4: band.point4 };
}
