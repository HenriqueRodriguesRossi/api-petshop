const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    first_name:{
        type: String,
        required: true
    },
    last_name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    created_at:{
        type: Date,
        default: new Date()
    }
})

module.exports = mongoose.model("User", UserSchema)