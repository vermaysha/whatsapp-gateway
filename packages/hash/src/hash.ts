import argon2 from 'argon2';
import { config } from 'dotenv';

config();

const options = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  hashLength: 50
};

/**
 * Hashes the given plain text using the argon2 algorithm.
 *
 * @param {string} plain - the plain text to be hashed
 * @return {Promise<string>} a promise that resolves to the hashed string
 */
export function hash(plain: string): Promise<string> {
 return argon2.hash(plain, options);
}

/**
 * Verifies the given hash against the plain text password.
 *
 * @param {string} hash - The hash to be verified.
 * @param {string} plain - The plain text password.
 * @return {Promise<boolean>} A promise that resolves to a boolean indicating whether the hash is valid.
 */
export function verify(hash: string, plain: string): Promise<boolean> {
  return argon2.verify(hash, plain, options);
}

/**
 * Determines whether a given hash needs to be rehashed.
 *
 * @param {string} hash - The hash to check.
 * @return {boolean} True if the hash needs to be rehashed, false otherwise.
 */
export function needRehash(hash: string): boolean {
  return argon2.needsRehash(hash, options);
}
