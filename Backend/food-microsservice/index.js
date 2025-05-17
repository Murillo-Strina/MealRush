var bodyParser = require('body-parser')
var express = require("express")
var app = express()
var router = require("./Routes/routes")
var cors = require('cors')

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.use("/", router)

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000")
});
