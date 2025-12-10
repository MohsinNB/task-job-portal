import { SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD } from "../app/config/env";
import { User } from "../models/user.model";
import { UserRole } from "../types/enums";
import { hashPassword } from "./hash";

export const seedSuperAdmin = async () => {
  try {
    const plainPassword = SUPER_ADMIN_PASSWORD;
    const hashedPassword = await hashPassword(plainPassword);

    const isExistSuperAdmin = await User.findOne({
      email: SUPER_ADMIN_EMAIL,
      role: UserRole.SUPER_ADMIN,
    });
    if (isExistSuperAdmin) {
      console.log("super admin already exist");
      return;
    }

    const finalPayload = {
      name: "Administrator",
      email: SUPER_ADMIN_EMAIL,
      role: UserRole.SUPER_ADMIN,
      password: hashedPassword,
      verified: true,
    };

    await User.create(finalPayload);
    console.log("Super Admin account has been successfully created!");
  } catch (error) {
    console.log("Failed to seed super Admin", error);
  }
};
