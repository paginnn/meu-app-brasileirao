const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/jogos', async (req, res) => {
  try {
    let historicoCompleto = [];
    
    // 1. Descobre a rodada atual na API oficial
    const statusReq = await fetch('https://api.cartola.globo.com/mercado/status');
    const status = await statusReq.json();
    const rodadaAtualNum = status.rodada_atual;
    
    // 2. Calcula as últimas 10 rodadas
    const rodadaInicial = Math.max(1, rodadaAtualNum - 10);
    
    // 3. Busca exatamente essas rodadas direto na fonte
    for (let i = rodadaInicial; i <= rodadaAtualNum; i++) {
      try {
        const rodadaReq = await fetch(`https://api.cartola.globo.com/partidas/${i}`);
        const dados = await rodadaReq.json();
        
        // O Cartola separa a lista de jogos da lista de times. Juntamos aqui:
        const partidas = dados.partidas;
        const clubes = dados.clubes;
        
        partidas.forEach(jogo => {
          historicoCompleto.push({
            id: jogo.partida_id,
            rodada: i,
            data: jogo.partida_data,
            mandante: clubes[jogo.clube_casa_id].nome,
            visitante: clubes[jogo.clube_visitante_id].nome,
            gols_mandante: jogo.placar_oficial_mandante,
            gols_visitante: jogo.placar_oficial_visitante
          });
        });
      } catch (err) {
        console.log(`Erro ao buscar rodada ${i}`);
      }
    }
    
    res.json(historicoCompleto);
  } catch (error) {
    res.status(500).json({ error: "Erro interno: " + error.message });
  }
});

app.listen(port, () => console.log('Servidor V5 - O Definitivo (Direto da Fonte)!'));
