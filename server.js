const express = require('express');
const { getCompetition } = require('campeonato-brasileiro-api'); 

const app = express();
const port = process.env.PORT || 3000;

app.get('/jogos', async (req, res) => {
  try {
    // Busca os dados da Série A
    const data = await getCompetition('a');
    
    let historicoCompleto = [];
    
    // O pulo do gato: vamos navegar por todas as fases e rodadas
    if (data.fases) {
      data.fases.forEach(fase => {
        if (fase.rodadas) {
          fase.rodadas.forEach(rodada => {
            if (rodada.jogos) {
              rodada.jogos.forEach(jogo => {
                // Adicionamos o número da rodada ao objeto do jogo
                jogo.rodada_numero = rodada.nome;
                historicoCompleto.push(jogo);
              });
            }
          });
        }
      });
    }
    
    res.json(historicoCompleto);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar histórico: " + error.message });
  }
});

app.listen(port, () => console.log('Servidor rodando e pronto para o histórico!'));
