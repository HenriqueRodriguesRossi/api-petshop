const express = require("express")
const app = express()
require("dotenv").config()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.listen(8080, ()=>{
    console.log("Servidor rodando!")
})