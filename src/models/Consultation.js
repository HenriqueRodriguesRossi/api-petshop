const mongoose = require("mongoose")

const ConsultationSchema = new mongoose.Schema({
    owner_id:{
        type: String,
        required: true
    },
    pet_id:{
        type: String,
        required: true
    },
    veterinarian_id:{
        type: String,
        required: true
    },
    date_of_consultation:{
        type: Date,
        required: true
    },
    hour_of_consultation:{
        type: String,
        required: true
    },
    comments:{
        type: String,
        required: false
    },
    owner_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    pet_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pet"
    }],
    veterinarian_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Veterinarian"
    }],
    created_at:{
        type: Date,
        default: new Date()
    },
}, {versionKey: false})

module.exports = mongoose.model("Consultation", ConsultationSchema)