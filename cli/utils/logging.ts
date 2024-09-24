// ------ cli/utils/logging.ts ------
const GREEN_COLOR = "\x1b[32m";
const RED_COLOR = "\x1b[31m";
const ORANGE_COLOR = "\x1b[38;5;214m";
const RESET_COLOR = "\x1b[0m";

/**
 * Loguje komunikat w kolorze zielonym.
 * @param message Komunikat do zalogowania.
 */
export function logSuccess(message: string): void {
  console.log(`${GREEN_COLOR}${message}${RESET_COLOR}`);
}

/**
 * Loguje komunikat w kolorze czerwonym.
 * @param message Komunikat do zalogowania.
 */
export function logError(message: string): void {
  console.error(`${RED_COLOR}${message}${RESET_COLOR}`);
}

/**
 * Loguje komunikat w kolorze pomarańczowym.
 * @param message Komunikat do zalogowania.
 */
export function logWarning(message: string): void {
  console.warn(`${ORANGE_COLOR}${message}${RESET_COLOR}`);
}
