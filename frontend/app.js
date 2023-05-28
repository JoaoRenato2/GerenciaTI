require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());

const User = require("./models/User");
const res = require("express/lib/response");

app.get("/", (req, res) => {
  res.status(200).json({ msg: "Bem vindo" });
});

app.get("/user/:id", async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id, "-password");

  if (!user) {
    return res.status(404).json({ msg: "Usuário não encontrado" });
  }

  res.status(200).json({ user });
});

function checkToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ msg: "Acesso negado!" });

  try {
    const secret = process.env.SECRET;

    jwt.verify(token, secret);

    next();
  } catch (err) {
    res.status(400).json({ msg: "O Token é inválido!" });
  }
}

// Registrar o usuário
app.post("/auth/register", async (req, res) => {
  const { name, email, password, confirmpassword } = req.body;

  // Validações
  if (!name) {
    return res.status(422).json({ msg: "o nome é obrigatorio" });
  }

  if (!email) {
    return res.status(422).json({ msg: "o email é obrigatorio" });
  }

  if (!password) {
    return res.status(422).json({ msg: "a senha é obrigatorio" });
  }

  if (password != confirmpassword) {
    return res.status(422).json({ msg: "as senhas devem ser iguais" });
  }

  // verificando se o usuário existe

  const userExist = await User.findOne({ email: email });

  if (userExist) {
    return res.status(422).json({ msg: "Utilize outro email" });
  }

  // criando o hash

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  // salvando o usuário

  const user = new User({
    name,
    email,
    password: passwordHash,
  });

  try {
    await user.save();
    res.status(201).json({ msg: "Usuário criado" });
  } catch (error) {
    console.log(error);

    res.status(500).json({ msg: "Erro no servidor" });
  }
});

// Login

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(422).json({ msg: "o email é obrigatorio" });
  }

  if (!password) {
    return res.status(422).json({ msg: "o email é obrigatorio" });
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(422).json({ msg: "Usuário não encontrado" });
  }

  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    return res.status(404).json({ msg: "Senha invalida" });
  }

  try {
    const secret = process.env.SECRET;

    const token = jwt.sign(
      {
        id: user._id,
      },
      secret
    );

    res.status(200).json({ msg: "Usuário logado", token });
  } catch (error) {
    console.log(error);

    res.status(500).json({ msg: "Erro no servidor" });
  }
});

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

mongoose
  .connect(
    `mongodb+srv://${dbUser}:${dbPassword}@cluster0.n9t6h8l.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(3000);
    console.log("Conectou!!");
  })
  .catch((err) => console.log(err));
