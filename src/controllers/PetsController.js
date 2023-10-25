const Pets = require("../models/Pets")
const userValidate = require("../utils/userValidate")
const yup = require("yup")

exports.newPet = async (req, res)=>{
    try{
        const user_id = req.params
    
        await userValidate(user_id)

        const {name, specie, race, years} = req.body

        const PetSchema = yup.object().shape({
            name: yup.string().required("O nome do animal é obrigatório!").min(3, "O nome do animal deve ter no mínimo 3 caracteres!"),

            specie: yup.string().required("A espécie do animal é obrigatória!"),

            race: yup.string().required("A raça do animal é obrigatória!"),

            years: yup.number().required("A idade do animal é obrigatória!")
        })

        await PetSchema.validate(req.body, {abortEarly: false})

        const newPet = new Pet({
            name,
            specie, 
            race,
            years,
            owner_id: user_id
        })

        await newPet.save()

        return res.status(201).send({
            mensagem: "Pet cadastrado com sucesso!"
        })
    }catch(error){
        console.log(error)

        return res.status(500).send({
            mensagem: "Erro ao cadastrar o pet!"
        })
    }
}