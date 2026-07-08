const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// O Disfarce: Isso faz o Sofascore achar que o seu servidor é um Google Chrome de verdade
const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Origin": "https://www.sofascore.com",
  "Referer": "https://www.sofascore.com/"
};

app.get('/jogos', async (req, res) => {
  try {
    // 1. Descobrir a temporada atual do Brasileirão (O ID do torneio lá é 325)
    const tourRes = await fetch('https://api.sofascore.com/api/v1/unique-tournament/325', { headers: HEADERS });
    const tourData = await tourRes.json();
    const seasonId = tourData.uniqueTournament.currentSeason.id;

    // 2. Pegar os últimos jogos (last/0 traz a última página de jogos encerrados)
    const eventsRes = await fetch(`https://api.sofascore.com/api/v1/unique-tournament/325/season/${seasonId}/events/last/0`, { headers: HEADERS });
    const eventsData = await eventsRes.json();
    
    // Pega os últimos 10 jogos para extrair estatísticas profundas sem travar o servidor
    const ultimosJogos = eventsData.events.slice(0, 10);
    let historicoCompleto = [];

    // 3. Entrar em cada jogo para buscar os scouts de Finalizações, Cartões e Posse
    for (let jogo of ultimosJogos) {
      let chutesCasa = 0, chutesFora = 0;
      let posseCasa = "50%", posseFora = "50%";
      let amareloCasa = 0, amareloFora = 0;
      let vermelhoCasa = 0, vermelhoFora = 0;

      try {
        const statsRes = await fetch(`https://api.sofascore.com/api/v1/event/${jogo.id}/statistics`, { headers: HEADERS });
        if (statsRes.ok) {
           const statsData = await statsRes.json();
           
           // O Sofascore divide os dados em períodos. Queremos a partida inteira ("ALL")
           const period = statsData.statistics.find(p => p.period === "ALL");
           if (period) {
              period.groups.forEach(group => {
                 group.statisticsItems.forEach(item => {
                    if (item.name === "Total shots" || item.name === "Finalizações") {
                       chutesCasa = item.home;
                       chutesFora = item.away;
                    }
                    if (item.name === "Ball possession" || item.name === "Posse de bola") {
                       posseCasa = item.home;
                       posseFora = item.away;
                    }
                    if (item.name === "Yellow cards" || item.name === "Cartões amarelos") {
                       amareloCasa = item.home;
                       amareloFora = item.away;
                    }
                    if (item.name === "Red cards" || item.name === "Cartões vermelhos") {
                       vermelhoCasa = item.home;
                       vermelhoFora = item.away;
                    }
                 });
              });
           }
        }
      } catch (e) {
        console.log(`Sem estatísticas detalhadas para o jogo ${jogo.id}`);
      }

      // Converte a data de formato Unix Timestamp para DD/MM/AAAA
      const dataFormato = new Date(jogo.startTimestamp * 1000).toLocaleDateString('pt-BR');

      historicoCompleto.push({
        id: jogo.id,
        rodada: jogo.roundInfo ? jogo.roundInfo.round : "",
        data: dataFormato,
        mandante: jogo.homeTeam.name,
        visitante: jogo.awayTeam.name,
        gols_mandante: jogo.homeScore.current,
        gols_visitante: jogo.awayScore.current,
        chutes_mandante: chutesCasa,
        chutes_visitante: chutesFora,
        posse_mandante: posseCasa,
        posse_visitante: posseFora,
        amarelos_mandante: amareloCasa,
        amarelos_visitante: amareloFora,
        vermelhos_mandante: vermelhoCasa,
        vermelhos_visitante: vermelhoFora
      });
    }

    res.json(historicoCompleto);
  } catch (error) {
    res.status(500).json({ error: "Erro ao consultar Sofascore: " + error.message });
  }
});

app.listen(port, () => console.log('Servidor V7 - Conectado ao Cofre do Sofascore!'));
