// Substitua o server.js por isso apenas para testar a conexão:
const express = require('express');
const app = express();
app.get('/jogos', (req, res) => {
  res.json([{
    id: 1, rodada: 19, data: "08/07/2026", 
    mandante: {nome: "Botafogo"}, visitante: {nome: "Santos"}, 
    gols_mandante: 2, gols_visitante: 1, 
    chutes_mandante: 15, chutes_visitante: 8
  }]);
});
app.listen(process.env.PORT || 3000);
