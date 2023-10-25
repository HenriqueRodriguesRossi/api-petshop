const User = require("../models/User")

async function userValidate(id){
    const user = await User.findById({_id: id})

    if(!id){
        return res.status(400).send({
            mensagem: "Nenhum id encontrado!"
        })
    }else if(!user){
        return res.status(404).send({
            mensagem: "Nenhum usuário com esse id encontrado!"
        })
    }else {
        return true
    }
}

module.exports = userValidate()