const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");
const knex = require('../database/knex');

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body;

    const checkUserExist = await knex("users").where("email", email).first();

    if (checkUserExist) {
      throw new AppError("Este e-mail já está sendo utilizado.");
    }

    const hashedPassword = await hash(password, 8);

    await knex("users").insert({
      name,
      email,
      password: hashedPassword,
    });

    return response.status(201).json();
  }

  async update(request, response) {
    const { name, email, password, oldPassword } = request.body;
    const user_id = request.user.id;

    const user = await knex("users").where("id", user_id).first();

    if (!user) {
      throw new AppError("Usuário não encontrado!", 404);
    }

    const userWithUpdatedEmail = await knex("users")
      .where("email", email)
      .whereNot("id", user.id)
      .first();

    if (userWithUpdatedEmail) {
      throw new AppError("Este e-mail já está em uso!");
    }
    
    const updatedUser = { ...user, name, email };

    if (password && !oldPassword) {
      throw new AppError(
        "Você precisa digitar a senha antiga para definir a nova senha."
      );
    }

    if (password && oldPassword) {
      const checkOldPassword = await compare(oldPassword, user.password);

      if (!checkOldPassword) {
        throw new AppError("A senha antiga não confere.");
      }

      updatedUser.password = await hash(password, 8);
    }

    await knex("users")
      .where("id", user_id)
      .update({
        name: updatedUser.name,
        email: updatedUser.email,
        password: updatedUser.password,
        updated_at: knex.fn.now(),
      });

    return response.json();
  }

  async list(request, response) {
    const users = await knex("users").select("*");
  
    return response.json(users);
  }
}

module.exports = UsersController;