const Consultation = require("../models/Consultation")

async function consultationValidate(consultation_id){
    const consultation = await Consultation.findById({_id: consultation_id})

    if(!id){
        return res.status(400).send({
            mensagem: "Nenhum id encontrado!"
        })
    }else if(!pet){
        return res.status(404).send({
            mensagem: "Nenhuma consulta com esse id encontrada!"
        })
    }
}

module.exports = consultationValidate