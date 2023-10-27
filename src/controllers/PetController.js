const Pet = require("../models/Pet")
const User = require("../models/User")
const yup = require("yup")
const captureErrorYup = require("../utils/captureErrorYup")

exports.newPet = async (req, res) => {
    try {
        const id = req.params.id

        const userValidate = await User.findById({ _id: id })

        if (!id) {
            return res.status(400).send({
                mensagem: "Nenhum id encontrado!"
            })
        } else if (!userValidate) {
            return res.status(404).send({
                mensagem: "Nenhum usuário com esse id encontrado!"
            })
        }

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
            owner_id: id
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

exports.findRace = async (req, res) => {
    try {
        const { race } = req.body

        if (!race) {
            return res.status(400).send({
                mensagem: "Digite o nome de uma raça!"
            })
        }

        const raceVerify = await Pet.find({ race })

        if (!raceVerify || raceVerify.length == 0) {
            return res.status(404).send({
                mensagem: "Essa raça não foi cadastrada!"
            })
        } else {
            return res.status(200).send({
                mensagem: raceVerify
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
        const {specie} = req.body

        if (!specie) {
            return res.status(404).send({
                mensagem: "Digite o nome de uma espécie!"
            })
        }

        const specieVerify = await Pet.find({ specie })

        if (!specieVerify) {
            return res.status(404).send({
                mensagem: "Essa espécie não foi cadastrada!"
            })
        } 
        
        return res.status(200).send({
            sucesso: "Pesquisa efetuada com sucesso!",
            mensagem: specieVerify
        })
    } catch (error) {
        console.log(error)

        return res.status(500).send({
            mensagem: "Erro ao efatuar a busca da espécie!"
        })
    }
}

exports.findPetById = async (req, res) => {
    try {
        const {pet_id} = req.params.pet_id

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
        const {user_id} = req.params

        if(!user_id){
            return res.status(400).send({
                mensagem: "Por favor, forneça o id do usuário!"
            })
        }

        const validateUserId = await User.findById({_id: user_id})

        if(!validateUserId){
            return res.status(404).send({
                mensagem: "Nenhum usuário foi encontrado com esse id!"
            })
        }

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
        const {user_id, pet_id} = req.params

        if(!user_id || !pet_id){
            return res.status(400).send({
                mensagem: "Por favor, forneça todas as informações necessárias!"
            })
        }

        const { name, specie, race, years } = req.body

        const updatedFields = {}

        if (!name && !specie && !race && !years) {
            return res.status(400).send({
                mensagem: "Por favor, digite o campo que você deseja alterar!"
            })
        }else{
            updatedFields.name = name
            updatedFields.specie = specie
            updatedFields.race = race
            updatedFields.years = years
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

exports.deletePet = async (req, res) => {
    try {
        const {user_id, pet_id} = req.params

        if(!user_id || !pet_id){
            return res.status(400).send({
                mensagem: "Por favor, forneça todas as informações necessárias!"
            })
        }

        const deletePet = await Pet.findByIdAndDelete({
            _id: pet_id,
            owner_id: user_id
        })

        if (!deletePet) {
            return res.status(404).send({
                mensagem: "Nenhum animal foi encontrado!"
            })
        } else {
            return res.status(200).send({
                mensagem: "Pet excuído com sucesso!",
                pet_detail: deletePet
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            mensagem: "Erro ao excluir o pet!"
        })
    }
}