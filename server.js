const express = require('express');
const { getCompetition } = require('campeonato-brasileiro-api'); 

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Servidor V2 rápido ativo e blindado contra quedas!');
});

app.get('/jogos', async (req, res) => {
  try {
    // Faz apenas UMA chamada ultra rápida que já traz o campeonato inteiro
    const dados = await getCompetition('a');
    res.json(dados);
  } catch (error) {
    res.status(500).json({ error: "Erro interno da API do ezefranca: " + error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando perfeitamente na porta ${port}`);
});
