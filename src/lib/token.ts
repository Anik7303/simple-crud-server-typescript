import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET || "an_unknown_json_web_token_secret";

export function generateToken(content: Object, expiresIn: string = "2d") {
  return jwt.sign(content, jwtSecret, { expiresIn });
}

export function verifyToken(token: string) {
  return jwt.verify(token, jwtSecret);
}
