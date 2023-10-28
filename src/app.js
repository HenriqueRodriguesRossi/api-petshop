const express = require("express")
const app = express()
require("dotenv").config()
require("./database/connect")

app.use(express.json())
app.use(express.urlencoded({extended: true}))

const UserRouter = require("./routes/UserRouter")
app.use(UserRouter)

const VeterinarianRouter = require("./routes/VeterinarianRouter")
app.use(VeterinarioRouter)

const PetRouter = require("./routes/PetRouter")
app.use(PetRouter)

const ConsultationRouter = require("./routes/ConsultationRouter")
app.use(ConsultationRouter)

app.listen(8080, ()=>{
     console.log("Server running!")
})