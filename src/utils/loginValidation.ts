/**
 * Reglas de validación del login (demo) aisladas y testables.
 *
 * ¿Qué hace? Email con patrón práctico (no RFC completo); contraseña largitud y al menos una letra + dígito.
 *
 * ¿Por qué así? Validar en helpers puros permite reutilizar en AuthContext/UI y cubrir edge cases en Jest sin montar RN.
 */

/**
 * Practical format check (not full RFC 5322): local@domain.tld
 */
const EMAIL_PATTERN =
  /^[a-zA-Z0-9](?:[a-zA-Z0-9._+-]*[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/;

export type LoginValidationFailure = 'INVALID_EMAIL' | 'INVALID_PASSWORD';

export const isValidLoginEmail = (email: string): boolean => {
  const trimmed = email.trim();
  if (trimmed.length < 5 || trimmed.length > 254) {
    return false;
  }
  return EMAIL_PATTERN.test(trimmed);
};

/** At least 8 characters, one letter and one digit (ASCII). */
export const isValidLoginPassword = (password: string): boolean => {
  if (password.length < 8 || password.length > 128) {
    return false;
  }
  return /[A-Za-z]/.test(password) && /\d/.test(password);
};

export const validateLoginInput = (
  email: string,
  password: string,
): LoginValidationFailure | null => {
  if (!isValidLoginEmail(email)) {
    return 'INVALID_EMAIL';
  }
  if (!isValidLoginPassword(password)) {
    return 'INVALID_PASSWORD';
  }
  return null;
};
