const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/jogos', async (req, res) => {
  try {
    // Acessa a tabela oficial pública
    const response = await fetch('https://api.globoesporte.globo.com/tabela/brasileirao-serie-a');
    const data = await response.json();
    
    // O Globo Esporte entrega um array de jogos prontinho
    // Vamos apenas formatar para a sua planilha
    const formatados = data.jogos.map(j => ({
      id: j.id,
      rodada: j.rodada,
      data: j.data,
      mandante: j.mandante.nome,
      visitante: j.visitante.nome,
      gols_mandante: j.gols_mandante,
      gols_visitante: j.gols_visitante,
      // Se não tiver a estatística oficial no JSON, deixaremos 0 ou vazio
      chutes_mandante: j.estatisticas ? j.estatisticas.finalizacoes_mandante : 0,
      chutes_visitante: j.estatisticas ? j.estatisticas.finalizacoes_visitante : 0
    }));
    
    res.json(formatados);
  } catch (error) {
    res.status(500).json([{ id: 0, erro: "Erro ao ler GE" }]);
  }
});

app.listen(port);const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/jogos', async (req, res) => {
  try {
    // 1. ID do Brasileirão Série A no Sofascore é 325. 
    // 2. Buscamos a página '0', que contém os eventos mais recentes.
    const resposta = await fetch('https://api.sofascore.com/api/v1/unique-tournament/325/season/63346/events/last/0', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    
    const dados = await resposta.json();
    
    // Mapeia todos os jogos da página atual (geralmente traz de 20 a 30 jogos)
    const jogosFormatados = dados.events.map(j => ({
      id: j.id,
      rodada: j.roundInfo ? j.roundInfo.round : "N/A",
      data: new Date(j.startTimestamp * 1000).toLocaleDateString('pt-BR'),
      mandante: j.homeTeam.name,
      visitante: j.awayTeam.name,
      gols_mandante: j.homeScore.current,
      gols_visitante: j.awayScore.current,
      // Aqui estamos pegando o ID para que depois você possa puxar estatísticas específicas se precisar
      chutes_mandante: 0, 
      chutes_visitante: 0
    }));
    
    res.json(jogosFormatados);
  } catch (error) {
    res.status(500).json([{ id: 0, erro: "Falha na API" }]);
  }
});

app.listen(port);
