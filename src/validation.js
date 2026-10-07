// F1 – Kiểm tra dữ liệu môn học. Hàm thuần, không đụng tới DOM.

export const NAME_MAX_LENGTH = 100;

export const MESSAGES = {
  nameRequired: 'Vui lòng nhập tên môn',
  nameTooLong: `Tên môn tối đa ${NAME_MAX_LENGTH} ký tự`,
  creditsInvalid: 'Số tín chỉ phải là số nguyên từ 1 đến 10',
  scoreInvalid: 'Điểm phải là số từ 0 đến 10',
};

/** Làm tròn 1 chữ số thập phân, tránh sai số dấu phẩy động (8.45 → 8.5). */
export function roundTo1(value) {
  return Number(`${Math.round(Number(`${value}e1`))}e-1`);
}

export function validateName(raw) {
  const name = String(raw ?? '').trim();
  if (name === '') return { error: MESSAGES.nameRequired };
  if (name.length > NAME_MAX_LENGTH) return { error: MESSAGES.nameTooLong };
  return { value: name };
}

export function validateCredits(raw) {
  const text = String(raw ?? '').trim();
  if (!/^\d+$/.test(text)) return { error: MESSAGES.creditsInvalid };
  const credits = Number(text);
  if (credits < 1 || credits > 10) return { error: MESSAGES.creditsInvalid };
  return { value: credits };
}

export function validateScore(raw) {
  const text = String(raw ?? '').trim().replace(',', '.');
  if (!/^\d+(\.\d+)?$/.test(text)) return { error: MESSAGES.scoreInvalid };
  const score = Number(text);
  if (score > 10) return { error: MESSAGES.scoreInvalid };
  return { value: roundTo1(score) };
}

/**
 * Kiểm tra cả 3 ô cùng lúc.
 * Trả về { valid: true, course } hoặc { valid: false, errors: { name?, credits?, score? } }.
 */
export function validateCourse({ name, credits, score }) {
  const results = {
    name: validateName(name),
    credits: validateCredits(credits),
    score: validateScore(score),
  };

  const errors = {};
  for (const [field, result] of Object.entries(results)) {
    if (result.error) errors[field] = result.error;
  }

  if (Object.keys(errors).length > 0) return { valid: false, errors };

  return {
    valid: true,
    course: {
      name: results.name.value,
      credits: results.credits.value,
      score: results.score.value,
    },
  };
}
