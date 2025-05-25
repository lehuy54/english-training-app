// src/controllers/authController.ts
import { Request, Response } from 'express';
import { registerUser, findUserByEmail } from '../services/authService';
import jwt from 'jsonwebtoken';
import config from '../config';
import bcrypt from 'bcrypt';

export const register = async (req: Request, res: Response) => {
  const { email, display_name, password, role } = req.body;

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      res.status(400).json({ error: 'Email đã được đăng ký' });
      return;
    }

    const newUser = await registerUser({ email, display_name, password, role });
    res.status(201).json({ message: 'Đăng ký thành công', user: newUser });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      res.status(400).json({ error: 'Người dùng không tồn tại' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      res.status(400).json({ error: 'Mật khẩu không đúng' });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Đăng nhập thành công', token });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};