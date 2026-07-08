const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/jogos', async (req, res) => {
  try {
    // Rota oficial de exportação de dados do Globo Esporte
    const response = await fetch('https://api.globoesporte.globo.com/tabela/brasileirao-serie-a/fase/fase-unica-brasileiro-2026/jogos');
    const dados = await response.json();
    
    // Mapeamento direto dos dados oficiais
    const formatados = dados.jogos.map(j => ({
      id: j.id,
      rodada: j.rodada,
      data: j.data_realizacao,
      mandante: j.mandante.nome_popular,
      visitante: j.visitante.nome_popular,
      gols_mandante: j.placar_oficial_mandante,
      gols_visitante: j.placar_oficial_visitante,
      chutes_mandante: j.estatisticas ? j.estatisticas.finalizacoes_mandante : 0,
      chutes_visitante: j.estatisticas ? j.estatisticas.finalizacoes_visitante : 0
    }));
    
    res.json(formatados);
  } catch (error) {
    res.status(500).json([{ id: 0, erro: "Conexão com GE falhou" }]);
  }
});

app.listen(port);
