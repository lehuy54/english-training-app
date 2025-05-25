import prisma from '../prisma';
import bcrypt from 'bcrypt';

export const registerUser = async (data: { email: string; display_name: string; password: string; role?: string }) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  return await prisma.users.create({
    data: {
      email: data.email,
      display_name: data.display_name,
      password_hash: hashedPassword,
      role: data.role || 'user',
    },
  });
};

export const findUserByEmail = async (email: string) => {
  return await prisma.users.findUnique({ where: { email } });
};