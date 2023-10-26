const  Veterinarian = require("../models/Veterinarian")

async function veterinariantValidate(id){
    const veterinarian = await Veterinarian.findById({_id: id})

    if(!id){
        return res.status(400).send({
            mensagem: "Nenhum id encontrado!"
        })
    }else if(!veterinarian){
        return res.status(404).send({
            mensagem: "Nenhum veterinário com esse id encontrado!"
        })
    }
}

module.exports = veterinariantValidate