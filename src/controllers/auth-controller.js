import jwt from "jsonwebtoken";
import userRepository from "../repositories/user-repository.js";
import bcrypt from 'bcrypt';


export const login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await userRepository.findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: "Credenciais inválidas" });
        }

        // Comparar a senha fornecida com a senha criptografada
        const passwordMatch = await bcrypt.compare(password, user.password);
        console.log('passwordMatch: ', passwordMatch);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Credenciais inválidas" });
        }

        const token = jwt.sign({ userId: user._id }, "seu_segredo_jwt");
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao autenticar usuário" });
    }
};

export const verifyToken = (req, res) => {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ message: "Token não encontrado" });
  }

  try {
    jwt.verify(token, "seu_segredo_jwt");
    res.json({ valid: true });
  } catch (error) {
    res.json({ valid: false });
  }
};
