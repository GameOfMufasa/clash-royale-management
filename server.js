const express = require('express');
const fs = require('fs');
const config = require("config");
const port = config.get("server").port;
const app = express();

const hostname = config.get("server").hostname;

console.log(process.env.NODE_ENV);

(async () => {
    if (!fs.existsSync(config.get("server").files.data_file || config.get("server").files.full_data)) {
        await require('./app')();
    }
    app.use(express.static('html'));

    app.get('/', (req, res) => {
        res.setHeader('Content-Type', 'text/html');
        res.send(fs.readFileSync(__dirname + '/html/index.html'));
    });

    app.get('/data', async (req, res) => {
        res.setHeader('Content-Type', 'text/html');
        let fullRecords = await new Promise((resolve, reject) => fs.readFile(__dirname + '/' + config.get("server").files.data_file, 'utf8', (err, data) => resolve(JSON.parse(data))));
        let fullRecordsArray = Object.values(fullRecords);
        res.status(200).json({"data": fullRecordsArray});
    });

    app.get('/refresh', async (req, res) => {
        let response = await require('./app')();
        if (response && response.reason) {
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