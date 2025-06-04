// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const users = []; // Simula um banco de dados em memória

const userWebhooks = {}; // { email: [webhookUrl1, webhookUrl2, ...] }

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

// Função para disparar alerta para todos os dispositivos logados
async function sendAlertToUser(email, mensagem) {
  if (!userWebhooks[email]) return;
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

// Cadastro
app.post("/api/cadastro", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Preencha todos os campos." });
  }
  // Verifica se o email já existe
  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ message: "Email já cadastrado." });
  }
  users.push({ name, email, password });
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

app.listen(3000, () => {
  console.log("Backend rodando em http://192.168.68.106:3000");
});
