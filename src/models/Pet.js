const mongoose = require("mongoose")

const PetSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    specie:{
        type: String,
        required: true
    },
    race:{
        type: String,
        required: true
    },
    years:{
        type: String,
        required: true
    },
    owner_id:{
        type: String,
        required: true
    },
    created_at:{
        type: Date,
        default: new Date()
    },
    owner_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
}, {versionKey:false})

module.exports = mongoose.model("Pet", PetSchema)