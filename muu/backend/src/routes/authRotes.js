import express from "express";
import {
  register,
  login,
  logout,
  changePassword,
  deleteAccount,
} from "../controllers/authController.js";

const router = express.Router();

// Rotas públicas
router.post("/register", register);
router.post("/login", login);

// Rotas protegidas (logout, trocar senha, deletar)
router.post("/logout", logout);
router.post("/change-password", changePassword);
router.delete("/delete-account", deleteAccount);

export default router;
