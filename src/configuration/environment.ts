import { config } from "dotenv";

config();

export const environment = {
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
};
