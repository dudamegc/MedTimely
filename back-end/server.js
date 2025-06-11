// server.js
import express from "express";
import cors from "cors";
import { json } from "body-parser";
import { readFileSync, writeFileSync } from "fs";
import { createTransport } from "nodemailer";
import { scheduleJob } from "node-schedule";
import { apiUrl } from "./config.json";

const app = express();
app.use(cors({ origin: "*" }));
app.use(json());

let users = []; // Simula um banco de dados em memória

// Configuração do Nodemailer para envio de e-mail
const transporter = createTransport({
  service: "gmail",
  auth: {
    user: "megacosta10@gmail.com", // Email correto
    pass: "mbef wzsv ozls hhnp", // Senha de aplicativo
  },
});

async function enviarEmail(destinatario, mensagem) {
  console.log("Função enviarEmail iniciada");
  const mailOptions = {
    from: "MedTimely <megacosta10@gmail.com>",
    to: destinatario,
    subject: "Lembrete de Medicação",
    text: String(mensagem),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("E-mail enviado:", info.response);
    console.log("Função enviarEmail finalizada com sucesso");
    return { status: 200, message: "E-mail enviado com sucesso!" };
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    console.log("Função enviarEmail finalizada com erro");
    return {
      status: 500,
      message: "Erro ao enviar e-mail: " + String(error),
    };
  }
  console.log("Função enviarEmail finalizada");
}

// Carrega os usuários do arquivo users.json
try {
  const usersData = readFileSync("users.json", "utf8");
  users = JSON.parse(usersData);
} catch (error) {
  console.error("Erro ao ler o arquivo users.json:", error);
}

const userWebhooks = {}; // { email: [webhookUrl1, webhookUrl2, ...] }
app.post("/api/send-email", async (req, res) => {
  console.log("Rota /api/send-email iniciada");
  const { email, mensagem } = req.body;
  console.log("Tipo de mensagem:", typeof mensagem);
  if (!email || !mensagem) {
    console.log("Dados incompletos");
    return res.status(400).json({ message: "Dados incompletos." });
  }

  try {
    const result = await enviarEmail(email, mensagem);
    console.log("Resultado do envio de email:", result);
    console.log("Enviando resposta:", result);
    return res.status(result.status).json({ message: result.message });
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    return res
      .status(500)
      .json({ message: "Erro ao enviar e-mail: " + String(error) });
  }
});

// Endpoint para registrar webhook de um dispositivo
app.post("/api/register-webhook", (req, res) => {
  const { email, webhookUrl } = req.body;
  if (!email || !webhookUrl) {
    return res.status(400).json({ message: "Dados inválidos." });
  }
  if (!userWebhooks[email]) userWebhooks[email] = [];
  if (!userWebhooks[email].includes(webhookUrl)) {
    userWebhooks[email].push(webhookUrl);
  }
  return res.status(200).json({ message: "Webhook registrado!" });
});

// Função para disparar alerta para todos os dispositivos logados e enviar e-mail
async function sendAlertToUser(email, mensagem) {
  console.log(
    "sendAlertToUser chamado para:",
    email,
    "com mensagem:",
    mensagem
  );

  // Enviar via Webhook (se houver)
  if (userWebhooks[email]) {
    for (const url of userWebhooks[email]) {
      try {
        await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ alerta: mensagem }),
        });
      } catch (e) {
        console.log("Erro ao enviar webhook:", e);
      }
    }
  }

  // Enviar por e-mail
  enviarEmail(email, mensagem);
}

app.use((req, res, next) => {
  console.log("Recebido request desconhecido:", req.method, req.url);
  next();
});

// Cadastro
app.post("/api/cadastro", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Preencha todos os campos." });
  }
  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ message: "Email já cadastrado." });
  }
  users.push({ name, email, password });
  writeFileSync("users.json", JSON.stringify(users));
  return res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
});

// Login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Preencha todos os campos." });
  }
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: "Email ou senha inválidos." });
  }
  return res.status(200).json({ message: "Login realizado com sucesso!" });
});

// Agendamento de notificações
function scheduleWebhookNotification(email, medicine, time, days) {
  const daysArray = days.split(",").map(Number);
  const [hours, minutes] = time.split(":").map(Number);
  const scheduledTime = { hour: hours, minute: minutes, dayOfWeek: daysArray };

  console.log("Agendando notificação para:", scheduledTime);

  const job = scheduleJob(scheduledTime, function () {
    sendAlertToUser(email, `Lembrete: tomar ${medicine} às ${time}`);
    console.log(`Alerta enviado para ${email} tomar ${medicine} às ${time}`);
  });

  console.log(
    `Notificação agendada para ${email} tomar ${medicine} às ${time} nos dias ${days}`
  );
}

app.listen(3000, () => {
  console.log(`Backend rodando em ${apiUrl}`);
});
