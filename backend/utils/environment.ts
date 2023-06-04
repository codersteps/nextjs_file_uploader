require('dotenv').config();

export const getEnvVariable = (key: string): string => {
  const get = process.env[key];
  if (!get) {
    throw Error(`Env variable with key ${key} missing`);
  } else {
    return get;
  }
};

export const maybeGetEnvVariable = (key: string): string | null => {
  const get = process.env[key];
  return get ?? null;
};

