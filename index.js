const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}));

async function run() {
    try {
        await mongoose.connect('mongodb+srv://injector:injector@cluster0.2kcbd.mongodb.net/sirius_backend_base?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useFindAndModify: false
        })

        require('./app/routes')(app)

        app.listen(port, () => {
            console.log(`Running server at ${port}`)
        });

    } catch (e) {
        console.log(e);
    }
}

run()