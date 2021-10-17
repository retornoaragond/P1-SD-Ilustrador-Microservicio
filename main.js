// main.js
const fs = require('fs')
const express = require('express')

const app = express()
app.use(express.json())
const port = process.env.PORT || 8083
let ilustradores = []

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Content-Type', 'application/json');
    next();
});

const loadIlustradores = () => {
    fs.readFile(__dirname + '/' + 'ilustradores.json', 'utf8', (err, data) => {
        ilustradores = JSON.parse(data)
    });
}
loadIlustradores()

const saveIlustradores = () => {
    let data = JSON.stringify(ilustradores)
    fs.writeFileSync(__dirname + '/' + 'ilustradores.json', data)
}

app.get('/ilustrador', (req, res) => {
    res.json(ilustradores);
})

app.get('/ilustrador/:id', (req, res) => {
    let ilustrador = ilustradores.find(i => i.id == req.params.id);
    if (ilustrador == undefined)
        res.status(404).send('Ilustrador not found');
    else
        res.json(ilustrador);
})

app.post('/ilustrador', (req, res) => {
    let index = ilustradores.findIndex(i => i.id === req.body.id);
    if (index != -1)
        res.status(404).send('Ilustrador already exits');
    else {
        ilustradores.push(req.body);
        saveIlustradores();
        res.status(200).send('Ilustrador added');
    }
})

app.put('/ilustrador/:id', (req, res) => {
    let index = ilustradores.findIndex(i => i.id == req.params.id);
    if (index == -1)
        res.status(404).send('Ilustrador not found');
    else {
        ilustradores[index] = req.body;
        saveIlustradores();
    }
    res.status(200).send('Ilustrador updated');
})

app.post('/ilustrador/delete/:id', (req, res) => {
    let index = ilustradores.findIndex(i => i.id == req.params.id);
    if (index == -1)
        res.status(404).send('Ilustrador not found');
    else {
        ilustradores = ilustradores.filter(i => i.id != req.params.id);
        saveIlustradores();
    }
    res.status(200).send('Ilustrador deleted');
})

app.listen(port, () =>
    console.log(`Ilustradores Server listening on port ${port}`)
)
