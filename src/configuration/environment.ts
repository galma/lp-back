import { config } from "dotenv";

try {
  //try to load local .env file variables
  config();
} catch {}

export const environment = {
  environment: process.env.ENVIRONMENT,
  database: {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    username: process.env.DB_USERNAME || "",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "",
  },
  randomOrgApi: {
    apiKey: process.env.RANDOM_ORG_API_KEY,
  },
  user: {
    initialBalance: process.env.USER_INITIAL_BALANCE || 100,
  },
  security: {
    encryptionAlgorithm: "aes256",
    encryptionKey: process.env.ENCRYPTION_KEY,
    encryptionIV: process.env.ENCRYPTION_IV || "",
  },
  jwt: {
    privateKey: process.env.JWT_PRIVATE_KEY
      ? Buffer.from(process.env.JWT_PRIVATE_KEY, "base64").toString("utf8")
      : "",

    publicKey: process.env.JWT_PUBLIC_KEY
      ? Buffer.from(process.env.JWT_PUBLIC_KEY, "base64").toString("utf8")
      : "",
    issuer: "lp-poc",
  },
};
