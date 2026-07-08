const express = require('express');
const { rodadaAtual } = require('campeonato-brasileiro-api'); 

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Servidor V2 ativo! Acesse /jogos para ver as partidas.');
});

app.get('/jogos', async (req, res) => {
  try {
    let todosOsJogos = [];
    
    // Loop SEQUENCIAL (um por um) para não ativar o bloqueio de segurança da API
    for (let i = 1; i <= 38; i++) {
      try {
        const rodada = await rodadaAtual('a', i);
        // Junta os jogos encontrados na nossa lista gigante
        if (Array.isArray(rodada)) {
          todosOsJogos = todosOsJogos.concat(rodada);
        } else if (rodada && rodada.jogos) {
          todosOsJogos = todosOsJogos.concat(rodada.jogos);
        }
      } catch (err) {
        // Se der erro em alguma rodada futura que não existe, ignora e continua
      }
    }
    
    // Devolve o pacotão completo
    res.json(todosOsJogos);
  } catch (error) {
    res.status(500).json({ error: "Erro interno: " + error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando perfeitamente na porta ${port}`);
});
