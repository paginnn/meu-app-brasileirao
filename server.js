const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.get('/jogos', async (req, res) => {
  try {
    // Faz a requisição se disfarçando de navegador para o Globo Esporte não dar erro 500
    const resposta = await axios.get("https://api.globoesporte.globo.com/tabela/championships/brasileiro-serie-a/games", {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });
    
    res.json(resposta.data);
  } catch (error) {
    res.status(500).json({ error: "Erro ao coletar dados do campeonato: " + error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando perfeitamente na porta ${port}`);
});
