const Pet = require("../models/Pet")

async function petValidate(id){
    const pet = await Pet.findById({_id: id})

    if(!id){
        return res.status(400).send({
            mensagem: "Nenhum id encontrado!"
        })
    }else if(!pet){
        return res.status(404).send({
            mensagem: "Nenhum animal com esse id encontrado!"
        })
    }
}

module.exports = petValidate