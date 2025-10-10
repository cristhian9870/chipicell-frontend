import * as authService from "../services/auth.service.js";
import { loginSchema, registerSchema } from "../schema/auth.schema.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.utils.js";

export const login = async (req, res) => {
  try {
    const validatedData = loginSchema.safeParse(req.body);
    if (!validatedData.success) {
      return res
        .status(400)
        .json({ message: "Invalid data", issues: validatedData.error.issues });
    }
    const { email, password } = validatedData.data;
    console.log(email)
    console.log(password)
    const user = await authService.getUserByEmail(email);
    console.log(user);

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = password === user.contrasena;
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user.id);

    // Use sameSite 'lax' so that cookies are sent on top-level navigations and most cross-site requests
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 30,
      sameSite: "lax",
      path: "/",
    });

    console.log(token)

    res.status(200).json({
      message: "Login successful",
      user: {
        userId: user.id,
        email: user.email,
        name: user.nombres,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const validatedData = registerSchema.safeParse(req.body);
    if (!validatedData.success) {
      return res
        .status(400)
        .json({ message: "Invalid data", issues: validatedData.error.issues });
    }
    const { email, password, name } = validatedData.data;

    const validatedUser = await authService.getUserByEmail(email);
    if (validatedUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await authService.createUser(email, password, name);
    console.log(user);
    res.status(200).json({
      user: {
        userId: user.id,
        email: user.email,
        name: user.nombres,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const me = async (req, res) => {
  try {
    // req.user is set by the verifyToken middleware
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await authService.getUserById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user: { userId: user.id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
