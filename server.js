const express = require('express');
// Importa a biblioteca do ezefranca conforme a documentação V2
const { getCompetition } = require('campeonato-brasileiro-api'); 

const app = express();
const port = process.env.PORT || 3000;

app.get('/jogos', async (req, res) => {
  try {
    // Chama o método oficial do pacote para pegar os dados da Série A
    const dados = await getCompetition('a');
    res.json(dados);
  } catch (error) {
    res.status(500).json({ error: "Erro ao coletar dados do campeonato: " + error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando perfeitamente na porta ${port}`);
});
