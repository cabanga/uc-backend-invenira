const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Dados simulados
let activities = [];
let analyticsData = [];

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
    res.send({
        qualAnalytics: [{ name: "Goal Details", type: "text/plain" }],
        quantAnalytics: [{ name: "Goals Scored", type: "integer" }]
    });
});

// Obter analytics de uma instância
app.post('/analytics', (req, res) => {
    const { activityID } = req.body;    
    const data = analyticsData.filter(a => a.activityID === activityID);
    res.send(data);
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Activity Provider rodando em http://localhost:${port}`);
});
