const Pet = require("../models/Pet")
const userValidate = require("../utils/userValidate")
const yup = require("yup")
const captureErrorYup = require("../utils/captureErrorYup")

exports.newPet = async (req, res) => {
    try {
        const user_id = req.params

        await userValidate(user_id)

        const { name, specie, race, years } = req.body

        const PetSchema = yup.object().shape({
            name: yup.string().required("O nome do animal é obrigatório!").min(3, "O nome do animal deve ter no mínimo 3 caracteres!"),

            specie: yup.string().required("A espécie do animal é obrigatória!"),

            race: yup.string().required("A raça do animal é obrigatória!"),

            years: yup.number().required("A idade do animal é obrigatória!")
        })

        await PetSchema.validate(req.body, { abortEarly: false })

        const newPet = new Pet({
            name,
            specie,
            race,
            years,
            owner_id: user_id
        })

        await newPet.save()

        return res.status(201).send({
            mensagem: "Pet cadastrado com sucesso!",
            detalhes_novo_pet: newPet
        })
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            const errors = [captureErrorYup(error)]

            return res.status(422).send({
                mensagem: "Erro ao cadastrar os pets!",

                erros: errors
            })
        } else {
            console.log(error)

            return res.status(500).send({
                mensagem: "Erro ao cadastrar o pet!"
            })
        }
    }
}

exports.findAll = async (req, res) => {
    try {
        const allPets = await Pet.find()

        if (!allPets) {
            return res.status(404).send({
                mensagem: "Nenhum animal encontrado!"
            })
        } else {
            return res.status(200).send({
                mensagem: allPets
            })
        }
    } catch (error) {
        console.log(error)

        return res.status(500).send({
            mensagem: "Erro ao retornar os pets!"
        })
    }
}

exports.findRice = async (req, res) => {
    try {
        const user_id = req.params
        const rice = req.body

        await userValidate(user_id)

        const riceVerify = await Pet.find({ rice })

        if (!riceVerify) {
            return res.status(404).send({
                mensagem: "Essa raça não foi cadastrada!"
            })
        } else {
            return res.status(200).send({
                mensagem: riceVerify
            })
        }
    } catch (error) {
        console.log(error)

        return res.status(500).send({
            mensagem: "Erro ao efetuar a busca da raça!"
        })
    }
}

exports.findSpecie = async (req, res) => {
    try {
        const user_id = req.params
        const specie = req.body

        await userValidate(user_id)

        const specieVerify = await Pet.find({ specie })

        if (!specieVerify) {
            return res.status(404).send({
                mensagem: "Essa espécie não foi cadastrada!"
            })
        } else {
            return res.status(200).send({
                mensagem: specieVerify
            })
        }
    } catch (error) {
        console.log(error)

        return res.status(500).send({
            mensagem: "Erro ao efatuar a busca da espécie!"
        })
    }
}

exports.findPetById = async (req, res) => {
    try {
        const pet_id = req.params.pet_id

        const petVerify = await Pet.findById({ _id: pet_id })

        if (!petVerify) {
            return res.status(404).send({
                mensagem: "Nenhum pet encontrado!"
            })
        } else {
            return res.status(200).send({
                mensagem: petVerify
            })
        }
    } catch (error) {
        console.log(error)

        return res.status(500).send({
            mensagem: "Erro ao retornar um animal!"
        })
    }
}

exports.findPetByUser = async (req, res) => {
    try {
        const user_id = req.params

        await userValidate(user_id)

        const petVerify = await Pet.find({ owner_id: user_id })

        if (!petVerify) {
            return res.status(404).send({
                mensagem: "Este usuário não cadastrou nenhum animal!"
            })
        } else {
            return res.status(200).send({
                mensagem: petVerify
            })
        }
    } catch (error) {
        console.log(error)

        return res.status(500).send({
            mensagem: "Erro ao retornar os animais que este usuário cadastrou!"
        })
    }
}

exports.alterPet = async (req, res) => {
    try {
        const user_id = req.params.user_id

        await userValidate(user_id)

        const pet_id = req.params.pet_id

        if (!pet_id) {
            return res.status(400).send({
                mensagem: "Forneça o id do pet!"
            })
        }

        const { name, specie, race, years } = req.body

        const updatePetSchema = yup.object().shape({
            name: yup.string().min(3, "O nome do animal deve ter no mínimo 3 caracteres!"),

            specie: yup.string("Digite uma espécie válida!"),

            race: yup.string().required("A raça do animal é obrigatória!"),

            years: yup.number()
        })

        await updatePetSchema.validate(req.body, { abortEarly: false })

        const updatedFields = {}

        if (name) {
            updatedFields.name = name
        }

        if (specie) {
            updatedFields.specie = specie
        }

        if (race) {
            updatedFields.race = race
        }

        if (years) {
            updatedFields.years = years
        }else{
            return res.status(400).send({
                mensagem: "Por favor, digite o campo que você deseja alterar!"
            })
        }

        const updatedPet = await Pet.findByIdAndUpdate(
            { _id: pet_id },
            { $set: updatedFields },
            { new: true },
            { owner_id: user_id }
        )

        if (!updatedPet) {
            return res.status(404).send({
                mensagem: "Nenhum animal com esse id foi encontrado!"
            })
        } else {
            return res.status(200).send({
                mensagem: "Pet alterado com sucesso!",
                novas_info: updatedPet
            })
        }
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            const errors = captureErr
            return res.status(422).send({
                mensagem: "Erro ao alterar os dados do animal!",
                erros: errors
            })
        } else {
            console.log(error)

            return res.status(500).send({
                mensagem: "Erro ao alterar as informações do animal!"
            })
        }
    }
}

exports.deletePet = async (req, res)=>{
    try{
        const user_id = req.params.user_id
        const pet_id = req.params.pet_id
    
        await userValidate(user_id)
    
        if(!pet_id){
            return res.status(400).send({
                mensagem: "Por favor, forneça o id do pet!"
            })
        }

        const deletePet = await Pet.findByIdAndDelete({
            _id: pet_id,
            owner_id: user_id
        })

        if(!deletePet){
            return res.status(404).send({
                mensagem: "Nenhum animal foi encontrado!"
            })
        }else{
            return res.status(200).send({
                mensagem: "Pet excuído com sucesso!"
            })
        }
    }catch(error){
        console.log(error)
        return res.status(500).send({
            mensagem: "Erro ao excluir o pet!"
        })
    }
}