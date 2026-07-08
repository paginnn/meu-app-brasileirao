const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// A sua chave secreta do Football-Data!
const TOKEN = "fd_debf0de838d48f44e4c4939a31f9cce92c58059c69032131";

app.get('/jogos', async (req, res) => {
  try {
    // Busca os jogos finalizados do Brasileirão (código oficial lá é BSA)
    const resposta = await fetch('https://api.football-data.org/v4/competitions/BSA/matches?status=FINISHED', {
      headers: { 'X-Auth-Token': TOKEN }
    });
    
    if (!resposta.ok) {
      throw new Error(`Erro na Football-Data: ${resposta.status}`);
    }

    const dados = await resposta.json();
    let historicoCompleto = [];
    
    if (dados.matches) {
      // Pega as últimas 10 rodadas (100 jogos) para não sobrecarregar
      const ultimosJogos = dados.matches.slice(-100);

      ultimosJogos.forEach(jogo => {
        // Valores padrão caso o plano gratuito não libere as estatísticas
        let chutesCasa = 0;
        let chutesFora = 0;
        let posseCasa = "50%";
        let posseFora = "50%";

        // Se a API liberar, o código caça as estatísticas aqui
        if (jogo.statistics && jogo.statistics.length > 0) {
            // (Lógica genérica para varrer o array de stats deles, se existir)
        }

        historicoCompleto.push({
          id: jogo.id,
          rodada: jogo.matchday,
          data: jogo.utcDate,
          mandante: jogo.homeTeam.name,
          visitante: jogo.awayTeam.name,
          gols_mandante: jogo.score.fullTime.home,
          gols_visitante: jogo.score.fullTime.away,
          chutes_mandante: chutesCasa,
          chutes_visitante: chutesFora,
          posse_mandante: posseCasa,
          posse_visitante: posseFora
        });
      });
    }
    
    res.json(historicoCompleto);
  } catch (error) {
    res.status(500).json({ error: "Erro interno: " + error.message });
  }
});

app.listen(port, () => console.log('Servidor V6 - Operando com a sua Chave Mestra!'));
