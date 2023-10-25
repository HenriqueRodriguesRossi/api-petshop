const Pets = require("../models/Pets")
const userValidate = require("../utils/userValidate")
const yup = require("yup")

exports.newPet = async (req, res)=>{
    try{
        const owner_id = req.params
    
        await userValidate(owner_id)

        const {name, species, race, years} = req.body

        const PetSchema = yup.object().shape({
            name: yup.string().required("O nome do animal é obrigatório!").min(3, "O nome do animal deve ter no mínimo 3 caracteres!"),

            species: yup.string().required("A espécie do animal é obrigatória!"),

            race: yup.string().required("A raça do animal é obrigatória!"),

            years: yup.number().required("A idade do animal é obrigatória!")
        })
    }catch(error){
        console.log(error)

        return res.status(500).send({
            mensagem: "Erro ao cadastrar o pet!"
        })
    }
}