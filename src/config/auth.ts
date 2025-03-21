import { Secret } from 'jsonwebtoken';

interface JWTConfig {
  secret: string;
  expiresIn: string;
}

interface AuthConfig {
  jwt: JWTConfig;
}

const authConfig: AuthConfig = {
  jwt: {
    secret: process.env.AUTH_SECRET || "default",
    expiresIn: "1d"
  }
};

export default authConfig;