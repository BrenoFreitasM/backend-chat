import { saveMessage } from "../repositories/message-repository.js";

export const sendMessage = async (data, wss, sender) => {
  try {
    const message = JSON.parse(data);
    console.log("📩 Mensagem recebida:", message);
    const sender = message.sender;
    // Adiciona o remetente à mensagem
    const fullMessage = { ...message, sender };

    await saveMessage(fullMessage);

    wss.clients.forEach((client) => {
      console.log('Clientes: ', client)
      if (client.readyState === 1) {
        client.send(JSON.stringify(fullMessage));
      }
    });
  } catch (error) {
    console.error("Erro ao processar mensagem:", error);
  }
};
