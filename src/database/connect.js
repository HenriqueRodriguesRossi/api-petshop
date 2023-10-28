const mongoose = require("mongoose")
const mongoUri = process.env.MONGO_URI

mongoose.connect(mongoUri)

const connection = mongoose.connection

connection.on("open", () => {
    console.log("Successfully connected to the database!")
})

connection.on("error", (error) => {
    console.log("Error connecting to the bank: " + error)
})

module.exports = mongoose