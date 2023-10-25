const mongoose = require("mongoose")

const PetSchema = new mongoose.model({
    name: {
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
        type: Number,
        required: true
    },
    owner_id:{
        type: String,
        required: true
    },
    created_at:{
        type: Date,
        default: new Date()
    }
})

module.exports = mongoose.model("Pets", PetSchema)