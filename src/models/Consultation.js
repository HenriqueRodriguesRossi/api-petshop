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
        required: true
    },
    created_at:{
        type: Date,
        default: new Date()
    }
})

module.exports = mongoose.model("Consultation", ConsultationSchema)