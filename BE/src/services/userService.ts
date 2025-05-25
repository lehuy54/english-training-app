// src/services/userService.ts
import prisma from '../prisma';
import bcrypt from 'bcrypt';
import { findUserByEmail } from './authService';

// xem all danh sách người dùng
export const getAllUsersFromDB = async () => {
  try {
    const users = await prisma.users.findMany();
    return users;
  } catch (error) {
    throw new Error('Lỗi khi lấy danh sách người dùng');
  }
};

// xem thông tin hiện tại (user)
export const getUserById = async (userId: number) => {
  return await prisma.users.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      display_name: true,
      role: true,
      registered_at: true
    },
  });
};

// update thông tin ng dùng (admin)
export const updateUserById = async (
  userId: number,
  data: { email?: string; display_name?: string; role?: 'user' | 'admin' }
) => {
  return await prisma.users.update({
    where: { id: userId },
    data: {
      email: data.email,
      display_name: data.display_name,
      role: data.role,
    },
    select: {
      id: true,
      email: true,
      display_name: true,
      role: true
    },
  });
};

// xóa người dùng (admin)
export const deleteUserById = async (userId: number) => {
  return await prisma.users.delete({
    where: { id: userId },
  });
};

// thay đổi mật khẩu người dùng
export const changeUserPassword = async (
  userId: number,
  currentPassword: string,
  newPassword: string
) => {
  try {
    // Tìm user theo ID
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        password_hash: true,
      },
    });

    if (!user) {
      return {
        success: false,
        message: 'Người dùng không tồn tại',
      };
    }

    // Kiểm tra mật khẩu hiện tại
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password_hash
    );

    if (!isCurrentPasswordValid) {
      return {
        success: false,
        message: 'Mật khẩu hiện tại không đúng',
      };
    }

    // Mã hóa mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Cập nhật mật khẩu mới
    await prisma.users.update({
      where: { id: userId },
      data: {
        password_hash: hashedPassword,
      },
    });

    return {
      success: true,
      message: 'Thay đổi mật khẩu thành công',
    };
  } catch (error) {
    console.error('Lỗi khi thay đổi mật khẩu:', error);
    return {
      success: false,
      message: 'Đã xảy ra lỗi khi cập nhật mật khẩu',
    };
  }
};
