import express from "express";
import mongoose from "mongoose";
import { WebSocketServer } from "ws";
import cors from "cors";
import dotenv from "dotenv";

import jwt from 'jsonwebtoken';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Conexão com MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(" Conectado ao MongoDB Atlas");

    // Definir schema e model *APÓS* a conexão
    const messageSchema = new mongoose.Schema({
      user: String,
      content: String,
      timestamp: Date,
      // ... outros campos
    });

    // Schema de usuário (exemplo)
    const userSchema = new mongoose.Schema({
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
    });

    const User = mongoose.model('User', userSchema);
    const Message = mongoose.model("Message", messageSchema);


    // Rota de autenticação
    app.post('/api/auth/login', async (req, res) => {
      const { email, password } = req.body;

      try {
        const user = await User.findOne({ email });
        const test = await User.findOne({ });

        if (!user || user.password !== password) {
          return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        const token = jwt.sign({ userId: user._id }, 'seu_segredo_jwt');

        res.json({ token });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao autenticar usuário' });
      }
    });

    // Rota de verificação de autenticação
    app.get('/api/auth/verify', (req, res) => {
      
      //const token = req.headers.authorization?.split(' ')[1];
      const token = req.headers.authorization;
      
      if (!token) {
        return res.status(401).json({ message: 'Token não encontrado' });
      }

      try {
        jwt.verify(token, 'seu_segredo_jwt');
        console.log('token válido')
        res.json({
          valid: true,
        });
      } catch (error) {
        console.log('token não válido')
        res.json({ valid: false });
      }
    });


    // Criar servidor WebSocket
    const wss = new WebSocketServer({ port: 8080 });

    wss.on("connection", (ws) => {
      console.log("🟢 Novo cliente conectado");

      ws.on("message", async (data) => {
        const message = JSON.parse(data);
        console.log("📩 Mensagem recebida:", message);

        // Salvar no MongoDB
        const newMessage = new Message(message);
        await newMessage.save();

        // Enviar mensagem para todos os clientes conectados
        wss.clients.forEach((client) => {
          if (client.readyState === 1) {
            client.send(JSON.stringify(message));
          }
        });
      });

      ws.on("close", () => console.log("🔴 Cliente desconectado"));
    });

    app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));

  })
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));