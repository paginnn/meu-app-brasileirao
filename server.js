const express = require('express');
const { getCompetition } = require('campeonato-brasileiro-api'); 

const app = express();
const port = process.env.PORT || 3000;

app.get('/jogos', async (req, res) => {
  try {
    // Busca a competição completa
    const dados = await getCompetition('a');
    
    let todosOsJogos = [];
    
    // Varre todas as rodadas (rounds) para extrair todos os jogos de uma vez
    if (dados.rounds) {
      dados.rounds.forEach(rodada => {
        if (rodada.matches) {
          rodada.matches.forEach(jogo => {
            // Adicionamos o número da rodada em cada jogo
            jogo.rodada_numero = rodada.round;
            todosOsJogos.push(jogo);
          });
        }
      });
    }
    
    res.json(todosOsJogos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => console.log('Servidor pronto para enviar todo o histórico!'));
