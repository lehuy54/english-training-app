// src/controllers/userController.ts
import { Request, Response } from 'express';
import { 
    getAllUsersFromDB,
    getUserById,
    updateUserById,
    deleteUserById,
    changeUserPassword
 } from '../services/userService';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsersFromDB();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getMe = async (req: any, res: Response) => {
  try {
    const user = await getUserById(req.user.userId);
    if (!user) {
        res.status(404).json({ error: 'Không tìm thấy người dùng' });
        return;
    }
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getSpecificUser = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id, 10);
  try {
    const user = await getUserById(userId);
    if (!user) {
       res.status(404).json({ error: 'Không tìm thấy người dùng' });
       return;
    }

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req: any, res: Response) => {
  const userId = parseInt(req.params.id, 10);

  const { email, display_name, role } = req.body;

  try {
    const updatedUser = await updateUserById(userId, { email, display_name, role });
    res.json(updatedUser);
  } catch (error: any) {
    if (error.code === 'P2025') {
        res.status(404).json({ error: 'Người dùng không tồn tại' });
        return;
    }

    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req: any, res: Response) => {
  const userId = parseInt(req.params.id, 10);

  try {
    await deleteUserById(userId);
    res.json({ message: 'Xóa người dùng thành công' });
  } catch (error: any) {
    if (error.code === 'P2025') {
        res.status(404).json({ error: 'Người dùng không tồn tại' });
        return;
    }

    res.status(500).json({ error: error.message });
  }
};

// Người dùng cập nhật thông tin hiển thị của mình
export const updateProfileController = async (req: any, res: Response) => {
  try {
    // Lấy userId từ token xác thực
    const userId = req.user.userId;
    const { display_name } = req.body;

    if (!display_name) {
      res.status(400).json({ error: 'Tên hiển thị không được để trống' });
      return;
    }

    const updatedUser = await updateUserById(userId, { display_name });
    res.json(updatedUser);
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Người dùng không tồn tại' });
      return;
    }
    res.status(500).json({ error: error.message });
  }
};

// Người dùng thay đổi mật khẩu của mình
export const changePasswordController = async (req: any, res: Response) => {
  try {
    // Lấy userId từ token xác thực
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: 'Cần cung cấp mật khẩu hiện tại và mật khẩu mới' });
      return;
    }

    // Kiểm tra độ dài mật khẩu mới
    if (newPassword.length < 6) {
      res.status(400).json({ error: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
      return;
    }

    const result = await changeUserPassword(userId, currentPassword, newPassword);
    
    if (!result.success) {
      res.status(400).json({ error: result.message });
      return;
    }

    res.json({ message: 'Thay đổi mật khẩu thành công' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};