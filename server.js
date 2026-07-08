const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/jogos', async (req, res) => {
  try {
    // Rota pública do GE para as estatísticas do Brasileirão 2026
    const resposta = await fetch('https://api.globoesporte.globo.com/tabela/brasileirao-serie-a');
    const dados = await resposta.json();
    
    let historico = [];
    // O GE fornece o JSON limpo com finalizações para as partidas recentes
    // Vamos processar a estrutura oficial deles
    res.json(dados.jogos); 
  } catch (error) {
    res.status(500).json({ error: "Erro na conexão oficial GE: " + error.message });
  }
});

app.listen(port, () => console.log('Servidor V8 - Conexão Direta e Oficial!'));
