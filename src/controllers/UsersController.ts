import { Request, Response, NextFunction } from 'express';
import knex from '../database/knex';
import { hash, compare } from 'bcryptjs';
import { AppError } from '../utils/AppError';

export class UsersController {
  async create(request: Request, response: Response, next: NextFunction) {
    const { name, email, password } = request.body;

    const checkUserExists = await knex("users").where({ email });

    if (checkUserExists.length > 0) {
      throw new AppError("Este e-mail já está em uso!");
    }

    const hashedPassword = await hash(password, 8);

    await knex("users").insert({
        name,
        email,
        password: hashedPassword
      });

    return response.status(201).json({message: "Usuário criado com sucesso!"});
  }

  async update(request: Request, response: Response) {
    const { name, email, password, old_password } = request.body;

    const { user } = request as Request & { user?: { id: number; role: string } };
    const user_id = user?.id;

    if (!user) {
      throw new AppError("Usuário não autenticado!", 401);
    }


    const userFromDb = await knex("users")
      .where({ id: user_id })
      .first();

    if (!userFromDb) {
      throw new AppError("Usuário não encontrado!");
    }

    const userWithUpdatedEmail = await knex("users")
      .where({ email })
      .whereNot({ id: user_id })
      .first();

    if (userWithUpdatedEmail) {
      throw new AppError("Este e-mail já está em uso!");
    }

    userFromDb.name = name ?? userFromDb.name;
    userFromDb.email = email ?? userFromDb.email;

    if (password && !old_password) {
      throw new AppError("Você precisa informar a senha antiga para atualizar.");
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, userFromDb.password);

      if (!checkOldPassword) {
        throw new AppError("Senha antiga inválida!");
      }

      userFromDb.password = await hash(password, 8);
    }

    await knex("users")
      .where({ id: user_id })
      .update({
        name: userFromDb.name,
        email: userFromDb.email,
        password: userFromDb.password,
        updated_at: knex.fn.now()
      });

    return response.json();
  }
}