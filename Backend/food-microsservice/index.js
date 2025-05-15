let bodyParser = require('body-parser')
let express = require("express")
let app = express()
let router = require("./Routes/routes")
let cors = require('cors')

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.use("/", router)

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000")
});
