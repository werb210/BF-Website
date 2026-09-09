// BF_WEBSITE_ENV_SINGLE_SOURCE_v1
// This defaulted to "" and the committed .env set it to localhost:8080.
// api.ts already hardcodes the prod origin as the single source of truth;
// two origins in one app is how a form silently posts nowhere.
import { WEBSITE_API_BASE } from "./api";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || WEBSITE_API_BASE;

export const IS_PROD = import.meta.env.PROD;
