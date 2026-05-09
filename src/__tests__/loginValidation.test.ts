/**
 * Tests de reglas de email/contraseña usadas por el login demo.
 *
 * ¿Qué hace? Ejemplos aceptados/rechazados y mapeo de `validateLoginInput`.
 *
 * ¿Por qué así? Las reglas viven fuera del componente RN para poder ejecutar sólo estas aserciones en Node/Jest rápido.
 */
import {
  isValidLoginEmail,
  isValidLoginPassword,
  validateLoginInput,
} from '../utils/loginValidation';

describe('loginValidation', () => {
  describe('isValidLoginEmail', () => {
    it('accepts typical addresses', () => {
      expect(isValidLoginEmail('demo@test.com')).toBe(true);
      expect(isValidLoginEmail(' user.name+tag@sub.domain.co.uk ')).toBe(true);
    });

    it('rejects malformed addresses', () => {
      expect(isValidLoginEmail('')).toBe(false);
      expect(isValidLoginEmail('plain')).toBe(false);
      expect(isValidLoginEmail('@nodomain.com')).toBe(false);
      expect(isValidLoginEmail('no-at-sign')).toBe(false);
      expect(isValidLoginEmail('a@b')).toBe(false);
    });
  });

  describe('isValidLoginPassword', () => {
    it('requires length 8+, letter and digit', () => {
      expect(isValidLoginPassword('abcd1234')).toBe(true);
      expect(isValidLoginPassword('Passw0rd')).toBe(true);
    });

    it('rejects weak passwords', () => {
      expect(isValidLoginPassword('short1')).toBe(false);
      expect(isValidLoginPassword('allletters')).toBe(false);
      expect(isValidLoginPassword('12345678')).toBe(false);
    });
  });

  describe('validateLoginInput', () => {
    it('returns first failure email then password', () => {
      expect(validateLoginInput('bad', 'abcd1234')).toBe('INVALID_EMAIL');
      expect(validateLoginInput('ok@test.com', 'nodigits')).toBe('INVALID_PASSWORD');
      expect(validateLoginInput('ok@test.com', 'abcd1234')).toBeNull();
    });
  });
});
