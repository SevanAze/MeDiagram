import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../entity/User.entity";
import { AppDataSource } from "../../data-source";

const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);

    const userRepository = AppDataSource.getRepository(User);

    const newUser = userRepository.create({
      username: username,
      email: email,
      password: hashedPassword,
    });

    await userRepository.save(newUser);

    res.status(200).send("User registered");
  } catch (error: any) {
    let errorMessage: string = "Server error";
    if (error.message.includes("ER_DUP_ENTRY"))
      errorMessage = "User duplication";
    res.status(500).send(errorMessage);
  }
};

const authenticateUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const jwtToken: string = process.env.JWT_SECRET!;

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email: email } });

    let token = "";

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(200).json({ token });
    }

    token = jwt.sign({ id: user.id }, jwtToken, {
      expiresIn: "1h",
    });

    res.status(200).json({ token, userId: user.id });
  } catch (error) {
    res.status(500).send("Server error");
  }
};

const verifyToken = async (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err: any) => {
    if (err) {
      return res.status(200).json({ isValid: false });
    }
    res.status(200).json({ isValid: true });
  });
};

const logoutUser = (req: Request, res: Response) => {};

export { authenticateUser, logoutUser, registerUser, verifyToken };
