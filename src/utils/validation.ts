const MIN_PHONE_DIGITS = 8;

export function isValidPhone(phone: string): boolean {
  const digitsOnly = phone.replace(/\D/g, '');
  return digitsOnly.length >= MIN_PHONE_DIGITS;
}