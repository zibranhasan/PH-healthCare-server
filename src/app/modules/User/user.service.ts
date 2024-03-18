import { UserRole } from "@prisma/client";
import * as bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";

const createAdmin = async (data: any) => {
  console.log("in service", data);
  try {
    const hashedPassword: string = await bcrypt.hash(data.password, 12);
    console.log(hashedPassword);

    const userData = {
      email: data.admin.email,
      password: hashedPassword,
      role: UserRole.ADMIN,
    };

    const result = await prisma.$transaction(async (transactionClient) => {
      const createdUserData = await transactionClient.user.create({
        data: userData,
      });

      const createAdminData = await transactionClient.admin.create({
        data: data.admin,
      });

      return createAdminData;
    });

    return result;
  } catch (error) {
    console.error("Error creating admin:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

export const userService = {
  createAdmin,
};
