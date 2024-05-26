import "dotenv/config";

const config = {
  PORT: process.env.PORT || 3000,
  DATABASE_URL: process.env.DATABASE_URL,
  // NODE_ENV: process.env.NODE_ENV,
  NODE_ENV: "production",
};

export default config;
