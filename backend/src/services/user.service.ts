import { prismaClient } from "../../prisma/prisma";
import { CreateUserInput, UpdateUserInput } from "../dtos/input/user.input";

export class UserService {
  async createUser(data: CreateUserInput) {
    const findUser = await prismaClient.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (findUser) throw new Error("User already registered!");

    return prismaClient.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: "temporary_password",
      },
    });
  }

  async findUser(id: string) {
    const user = await prismaClient.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) throw new Error("User does not exist");
    return user;
  }

  async listUsers() {
    return prismaClient.user.findMany();
  }

  async updateUser(id: string, data: UpdateUserInput) {
    const user = await prismaClient.user.findUnique({
      where: { id },
    });
    if (!user) throw new Error("User does not exist");

    return prismaClient.user.update({
      where: { id },
      data: {
        name: data.name ?? undefined,
      },
    });
  }

  async deleteUser(id: string) {
    const user = await prismaClient.user.findUnique({
      where: { id },
    });
    if (!user) throw new Error("User does not exist");

    await prismaClient.user.delete({
      where: { id },
    });

    return true;
  }
}
