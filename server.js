const express = require('express');
const { getCompetition } = require('campeonato-brasileiro-api'); 

const app = express();
const port = process.env.PORT || 3000;

// Rota raiz para testar fácil no navegador se o servidor está vivo
app.get('/', (req, res) => {
  res.send('Servidor do Brasileirão V2 rodando com sucesso no Render!');
});

app.get('/jogos', async (req, res) => {
  try {
    // Chama diretamente a biblioteca do ezefranca na nuvem
    const dados = await getCompetition('a');
    
    // Devolve os dados brutos para o Google Sheets
    res.json(dados);
  } catch (error) {
    res.status(500).json({ error: "Erro interno da API do ezefranca: " + error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando perfeitamente na porta ${port}`);
});
