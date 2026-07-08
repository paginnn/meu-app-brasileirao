const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.get('/jogos', async (req, res) => {
  try {
    // O Axios faz a ponte com o Globo Esporte de forma ultra segura
    const resposta = await axios.get("https://api.globoesporte.globo.com/tabela/championships/brasileiro-serie-a/games");
    
    // O Axios já entrega os dados mastigados dentro de .data
    res.json(resposta.data);
  } catch (error) {
    res.status(500).json({ error: "Erro ao coletar dados do campeonato: " + error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando perfeitamente na porta ${port}`);
});
