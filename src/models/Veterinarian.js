const mongoose = require("mongoose")

const veterinarianSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true
    },
    professional_email:{
        type: String,
        required: true
    },
    cfmv:{
        type: String,
        required: true
    },
    college_graduated:{
        type: String,
        required: true
    },

})

module.exports = mongoose.model("Veterinarian", veterinarianSchema)