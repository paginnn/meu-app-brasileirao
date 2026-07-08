const express = require('express');
// O SEGREDO: Importamos a função 'rodada' para histórico e 'rodadaAtual' para saber onde estamos
const { rodada, rodadaAtual } = require('campeonato-brasileiro-api'); 

const app = express();
const port = process.env.PORT || 3000;

app.get('/jogos', async (req, res) => {
  try {
    let historicoCompleto = [];
    
    // 1. Pega a rodada atual para saber o limite
    const infoAtual = await rodadaAtual('a');
    let rodadaAtualNum = 19; 
    if (infoAtual && infoAtual.rodada) {
      rodadaAtualNum = infoAtual.rodada;
    }

    // 2. Calcula de onde começar (10 rodadas atrás)
    const rodadaInicial = Math.max(1, rodadaAtualNum - 10);

    // 3. AGORA SIM: Usamos a função 'rodada' (histórico) para puxar o passado
    for (let i = rodadaInicial; i <= rodadaAtualNum; i++) {
      try {
        // Busca a rodada ESPECÍFICA (i)
        const rodadaData = await rodada('a', i);
        
        let jogosDaRodada = [];
        if (Array.isArray(rodadaData)) {
          jogosDaRodada = rodadaData;
        } else if (rodadaData && rodadaData.jogos) {
          jogosDaRodada = rodadaData.jogos;
        }
        
        // Carimba o número da rodada e guarda
        jogosDaRodada.forEach(jogo => {
          jogo.rodada_numero = i;
          historicoCompleto.push(jogo);
        });
      } catch (err) {
        console.log(`Rodada ${i} não encontrada.`);
      }
    }
    
    // Devolve o histórico real para a planilha!
    res.json(historicoCompleto);
  } catch (error) {
    res.status(500).json({ error: "Erro interno: " + error.message });
  }
});

app.listen(port, () => console.log('Servidor V4 - Agora sim com o histórico correto!'));
