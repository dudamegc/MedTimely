// server.js
const app = express();
const express = require("express");
const bodyParser = require("body-parser");
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // <-- Adicione esta linha!
app.use(bodyParser.json());
app.use(bodyParser.json());

const users = []; // Simula um banco de dados em memória

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
  console.log("Backend rodando em https://medtimely.onrender.com");
});
