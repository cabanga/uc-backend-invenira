const express = require('express');
const cors = require('cors');
const app = express();
const port = 3030;

app.use(cors());
app.use(express.json());

// Dados simulados
let activities = [];

// Importando os dados do JSON
const analyticsData = require('./analyticsData.json'); 

// Configuração da atividade
app.get('/config', (req, res) => {
    res.send({
        name: "Football Stats Analysis",
        description: "Configure football stats tracking activity",
        fields: [
            { name: "season", type: "text" },
            { name: "team", type: "text" },
        ]
    });
});

// Obter parâmetros de configuração
app.get('/json-params', (req, res) => {
    res.send([
        { name: "season", type: "number" },
        { name: "team", type: "text" }
    ]);
});

// Deploy de atividade
app.post('/deploy', (req, res) => {
    const { activityID, userID, config } = req.body;
    const instance = {
        activityID, 
        userID, 
        config, 
        instanceID: Date.now() 
    };
    
    activities.push(instance);
    res.send({ url: `http://localhost:${port}/activity/${instance.instanceID}` });
});

// Analytics disponíveis
app.get('/analytics-list', (req, res) => {
    res.send(analyticsData);
});

// Obter analytics de uma instância
app.post('/analytics', (req, res) => {
    const { activityID } = req.body;

    // Filtrar analytics por activityID
    const filteredAnalytics = analyticsData.filter(data => data.activityID === activityID);

    if (filteredAnalytics.length === 0) {
        return res.status(404).send({ error: "Nenhum analytics encontrado para esta atividade." });
    }

    res.send(filteredAnalytics);
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Activity Provider rodando em http://localhost:${port}`);
});
