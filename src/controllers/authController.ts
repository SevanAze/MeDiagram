import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../entity/User.entity";
import { AppDataSource } from "../../data-source";

const registerUser = async (req: Request, res: Response) => {

  console.log('TEST')

  try {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);

    const userRepository = AppDataSource.getRepository(User);

    const newUser = userRepository.create({
      username: username,
      email: email,
      password: hashedPassword,
    })

    await userRepository.save(newUser);

    res.status(201).send("User registered");
  } catch (error) {
    res.status(500).send("Server error" + error.message);
  }
};

const authenticateUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const jwtToken : string = process.env.JWT_SECRET!
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send("Authentication failed");
    }

    const token = jwt.sign({ id: user.id }, jwtToken, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).send("Server error");
  }
};

const logoutUser = (req: Request, res: Response) => {};

export { authenticateUser, logoutUser, registerUser };

