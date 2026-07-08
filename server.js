const express = require('express');
// Ajustado para o escopo correto do pacote v2
const { getCompetition } = require('@ezefranca/campeonato-brasileiro-api'); 

const app = express();
const port = process.env.PORT || 3000;

app.get('/jogos', async (req, res) => {
  try {
    const dados = await getCompetition('a');
    res.json(dados);
  } catch (error) {
    res.status(500).json({ error: "Erro ao coletar dados do campeonato: " + error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando perfeitamente na porta ${port}`);
});
