import { UserModel } from "../models/user.model";
import { prismaClient } from "../../prisma/prisma";
import { LoginInput, RegisterInput } from "../dtos/input/auth.input";
import { comparePassword, hashPassword } from "../utils/hash";
import { signJwt, verifyJwt } from "../utils/jwt";

export class AuthService {
  async login(data: LoginInput) {
    const existingUser = await prismaClient.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (!existingUser) throw new Error("User not registered!");
    const compare = await comparePassword(data.password, existingUser.password);
    if (!compare) throw new Error("Invalid password!");
    return this.generateTokens(existingUser);
  }

  async register(data: RegisterInput) {
    const existingUser = await prismaClient.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (existingUser) throw new Error("Email already registered!");

    const hash = await hashPassword(data.password);

    const user = await prismaClient.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hash,
      },
    });
    return this.generateTokens(user);
  }

  async refreshToken(token: string) {
    try {
      const payload = verifyJwt(token);
      const user = await prismaClient.user.findUnique({
        where: { id: payload.id },
      });
      if (!user) throw new Error("User not found!");
      return this.generateTokens(user);
    } catch (e) {
      throw new Error("Invalid Refresh Token");
    }
  }

  generateTokens(user: UserModel) {
    const token = signJwt({ id: user.id, email: user.email }, "5s");
    const refreshToken = signJwt({ id: user.id, email: user.email }, "1d");
    return { token, refreshToken, user };
  }
}
