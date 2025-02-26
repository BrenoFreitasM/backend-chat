import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth-route.js";
import messageRoutes from "./routes/message-route.js";
import { wss } from "./websocket/wss.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// Conectar ao banco de dados
connectDB();

// Rotas
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Inicializar servidor
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
