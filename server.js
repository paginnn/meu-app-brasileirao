const express = require('express');
const { rodadaAtual } = require('campeonato-brasileiro-api'); 

const app = express();
const port = process.env.PORT || 3000;

// Rota inicial para evitar tela de erro se você acessar o link sem o /jogos
app.get('/', (req, res) => {
  res.send('Servidor Ativo! Acesse o link com /jogos no final para ver as partidas.');
});

app.get('/jogos', async (req, res) => {
  try {
    let todosOsJogos = [];
    
    // Dispara a busca pelas 38 rodadas do campeonato simultaneamente
    const promessas = [];
    for (let i = 1; i <= 38; i++) {
      promessas.push(rodadaAtual('a', i));
    }
    
    // Aguarda o resultado de todas as rodadas
    const resultados = await Promise.all(promessas);
    
    // Junta os jogos de todas as rodadas em uma única lista gigante
    resultados.forEach(rodada => {
      if (Array.isArray(rodada)) {
        todosOsJogos = todosOsJogos.concat(rodada);
      } else if (rodada && rodada.jogos) {
        todosOsJogos = todosOsJogos.concat(rodada.jogos);
      }
    });
    
    res.json(todosOsJogos);
  } catch (error) {
    res.status(500).json({ error: "Erro interno da API do ezefranca: " + error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando perfeitamente na porta ${port}`);
});
