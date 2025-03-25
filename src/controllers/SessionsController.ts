import { Request, Response } from "express";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { AppError } from "../utils/AppError";
import knex from "../database/knex";
import authConfig from "../config/auth";

interface User {
  id: number;
  email: string;
  password: string;
  role: string;
}

type UserResponse = Omit<User, 'password'>;

export class SessionsController {
  async create(request: Request, response: Response) {
    const { email, password } = request.body;

    const user = await knex("users").where({ email }).first() as User;

    if (!user) {
      throw new AppError("E-mail e/ou senha incorreta.", 401);
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError("E-mail e/ou senha incorreta.", 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign(
      { role: user.role },
      secret,
      {
        expiresIn: "1d",
        subject: user.id.toString()
      }
    );

    response.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 15 * 60 * 1000
    });

    const userWithoutPassword: UserResponse = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    return response.status(201).json({ user: userWithoutPassword });
  }
}

export default SessionsController;