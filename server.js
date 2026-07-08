const express = require('express');
const { rodadaAtual } = require('campeonato-brasileiro-api'); 

const app = express();
const port = process.env.PORT || 3000;

app.get('/jogos', async (req, res) => {
  try {
    let historicoCompleto = [];
    
    // 1. Pega a rodada atual (hoje) para saber onde o campeonato está
    const rodadaMomento = await rodadaAtual('a');
    let rodadaAtualNum = 19; // fallback de segurança
    if (rodadaMomento && rodadaMomento.rodada) {
      rodadaAtualNum = rodadaMomento.rodada;
    }

    // 2. Calcula qual foi a rodada de 10 jogos atrás
    const rodadaInicial = Math.max(1, rodadaAtualNum - 10);

    // 3. Busca exatamente essas últimas 10 rodadas, uma por uma (sem travar a API)
    for (let i = rodadaInicial; i <= rodadaAtualNum; i++) {
      try {
        const rodadaData = await rodadaAtual('a', i);
        
        let jogosDaRodada = [];
        if (Array.isArray(rodadaData)) {
          jogosDaRodada = rodadaData;
        } else if (rodadaData && rodadaData.jogos) {
          jogosDaRodada = rodadaData.jogos;
        }
        
        // Carimba o número da rodada e joga no pacotão
        jogosDaRodada.forEach(jogo => {
          jogo.rodada_numero = i;
          historicoCompleto.push(jogo);
        });
      } catch (err) {
        console.log(`Erro ao buscar rodada ${i}`);
      }
    }
    
    // Devolve as últimas 10 rodadas prontas para a planilha!
    res.json(historicoCompleto);
  } catch (error) {
    res.status(500).json({ error: "Erro interno: " + error.message });
  }
});

app.listen(port, () => console.log('Servidor V3 - Trazendo as últimas 10 rodadas!'));
