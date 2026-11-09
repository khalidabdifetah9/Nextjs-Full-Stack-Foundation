import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";

const KEY_LENGTH = 64;
const COST = 32_768;
const BLOCK_SIZE = 8;
const PARALLELIZATION = 1;
const MAX_MEMORY = 64 * 1024 * 1024;

function deriveKey(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(
      password,
      salt,
      KEY_LENGTH,
      {
        N: COST,
        r: BLOCK_SIZE,
        p: PARALLELIZATION,
        maxmem: MAX_MEMORY,
      },
      (error, key) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(key);
      },
    );
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await deriveKey(password, salt);

  return [
    "scrypt",
    COST,
    BLOCK_SIZE,
    PARALLELIZATION,
    salt.toString("base64url"),
    key.toString("base64url"),
  ].join("$");
}

type ParsedPasswordHash = {
  salt: Buffer;
  key: Buffer;
};

function parsePasswordHash(encoded: string): ParsedPasswordHash | null {
  const parts = encoded.split("$");
  if (parts.length !== 6) {
    return null;
  }

  const [algorithm, cost, blockSize, parallelization, saltText, keyText] =
    parts;
  if (
    algorithm !== "scrypt" ||
    cost !== String(COST) ||
    blockSize !== String(BLOCK_SIZE) ||
    parallelization !== String(PARALLELIZATION) ||
    !/^[A-Za-z0-9_-]+$/.test(saltText) ||
    !/^[A-Za-z0-9_-]+$/.test(keyText)
  ) {
    return null;
  }

  const salt = Buffer.from(saltText, "base64url");
  const key = Buffer.from(keyText, "base64url");
  if (salt.length !== 16 || key.length !== KEY_LENGTH) {
    return null;
  }

  return { salt, key };
}

// Use the same scrypt work for unknown accounts and accounts without a
// password, so their sign-in responses don't reveal account existence.
const DUMMY_PASSWORD_HASH = hashPassword("sign-in-timing-equalization");

export async function verifyPassword(
  password: string,
  encodedHash: string | null | undefined,
): Promise<boolean> {
  const dummyHash = parsePasswordHash(await DUMMY_PASSWORD_HASH);
  if (!dummyHash) {
    throw new Error("Unable to initialize password verification.");
  }

  const parsedHash = encodedHash
    ? parsePasswordHash(encodedHash)
    : null;
  const hashToCheck = parsedHash ?? dummyHash;
  const candidate = await deriveKey(password, hashToCheck.salt);
  const matches = timingSafeEqual(candidate, hashToCheck.key);

  return parsedHash !== null && matches;
}
