type Env = {
  API_URL: string;
};

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("Missing VITE_API_URL");
}

export const env: Env = {
  API_URL,
};
