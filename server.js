const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.get('/jogos', async (req, res) => {
  try {
    // Busca direto da API do Globo Esporte através do servidor do Render
    const resposta = await fetch("https://api.globoesporte.globo.com/tabela/championships/brasileiro-serie-a/games");
    
    if (!resposta.ok) {
      throw new Error(`Erro na API externa: ${resposta.status}`);
    }
    
    const dados = await resposta.json();
    res.json(dados);
  } catch (error) {
    res.status(500).json({ error: "Erro ao coletar dados do campeonato: " + error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando perfeitamente na porta ${port}`);
});
