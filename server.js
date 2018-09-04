const express = require('express');
const fs = require('fs');
const config = require("config");
const port = config.get("server").port;
const app = express();

const hostname = config.get("server").hostname;

(async () => {
    if (!fs.existsSync(config.get("server").files.datatable_json)) {
        await require('./app')();
    }

    app.get('/', (req, res) => {
        res.setHeader('Content-Type', 'text/html');
        res.send(fs.readFileSync(__dirname + '/html/index.html'));
    });

    app.get('/data', (req, res) => {
        res.setHeader('Content-Type', 'text/html');
        res.send(fs.readFileSync(__dirname + '/'+config.get("server").files.datatable_json));
    });

    app.get('/refresh', async (req, res) => {
        let response = await require('./app')();
        if(response && response.reason) {
            res.status(401).json(JSON.stringify(response));
        } else {
            res.sendStatus(200);
        }
    });

    app.listen(port, () => {
        console.log(`
        Server is running at http://${hostname}:${port}/ 
        Server hostname ${hostname} is listening on port ${port}!
    `);
    });
})();