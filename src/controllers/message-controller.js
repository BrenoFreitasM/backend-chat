import { saveMessage } from "../repositories/message-repository.js";

export const sendMessage = async (data, wss) => {
  try {
    const message = JSON.parse(data);
    console.log("📩 Mensagem recebida:", message);

    await saveMessage(message);

    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify(message));
      }
    });
  } catch (error) {
    console.error("Erro ao processar mensagem:", error);
  }
};
