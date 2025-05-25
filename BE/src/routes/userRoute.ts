// src/routes/userRoute.ts
import express, { Router } from 'express';
import { authenticateToken, ensureAdmin } from '../middleware/authJwt';
import { 
    getAllUsers,
    getMe,
    getSpecificUser,
    updateUser,
    deleteUser,
    updateProfileController,
    changePasswordController
 } from '../controllers/userController';

const router: Router = express.Router();

// User profile routes
router.get('/me', authenticateToken, getMe);
router.put('/profile/update', authenticateToken, updateProfileController);
router.put('/profile/change-password', authenticateToken, changePasswordController);

// Admin routes
router.get('/', authenticateToken, ensureAdmin, getAllUsers);
router.get('/:id', authenticateToken, ensureAdmin, getSpecificUser);
router.put('/:id', authenticateToken, ensureAdmin, updateUser);
router.delete('/:id', authenticateToken, ensureAdmin, deleteUser);

export default router;