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
                message: "No id found!"
            })
        } else if (!userValidate) {
            return res.status(404).send({
                message: "No user with this id found!"
            })
        }

        const { name, species, race, years } = req.body

        const PetSchema = yup.object().shape({
            name: yup.string().required("The animal's name is required!").min(3, "The animal's name must have at least 3 characters!"),

            specie: yup.string().required("Animal species is required!"),

            race: yup.string().required("The animal's breed is required!"),

            years: yup.number().required("Animal age is required!")
        })

        await PetSchema.validate(req.body, { abortEarly: false })

        const newPet = new Pet({
            name,
            species,
            race,
            years,
            owner_id: id
        })

        await newPet.save()

        return res.status(201).send({
            message: "Pet registered successfully!",
            details_new_pet: newPet
        })
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            const errors = [captureErrorYup(error)]

            return res.status(422).send({
                message: "Error registering pets!",

                errors: errors
            })
        } else {
            console.log(error)

            return res.status(500).send({
                message: "Error registering the pet!"
            })
        }
    }
}

exports.findAll = async (req, res) => {
    try {
        const allPets = await Pet.find()

        if (!allPets) {
            return res.status(404).send({
                message: "No animals found!"
            })
        } else {
            return res.status(200).send({
                message: allPets
            })
        }
    } catch (error) {
        console.log(error)

        return res.status(500).send({
            message: "Error returning pets!"
        })
    }
}

exports.findRace = async (req, res) => {
    try {
        const { race } = req.body

        if (!race) {
            return res.status(400).send({
                message: "Enter the name of a breed!"
            })
        }

        const raceVerify = await Pet.find({ race })

        if (!raceVerify || raceVerify.length == 0) {
            return res.status(404).send({
                message: "This breed has not been registered!"
            })
        } else {
            return res.status(200).send({
                message: raceVerify
            })
        }
    } catch (error) {
        console.log(error)

        return res.status(500).send({
            message: "Error when searching for the breed!"
        })
    }
}

exports.findSpecie = async (req, res) => {
    try {
        const {specie} = req.body

        if (!species) {
            return res.status(404).send({
                message: "Enter the name of a species!"
            })
        }

        const specieVerify = await Pet.find({ specie })

        if (!specieVerify) {
            return res.status(404).send({
                message: "This species has not been registered!"
            })
        }
       
        return res.status(200).send({
            success: "Search carried out successfully!",
            message: specieVerify
        })
    } catch (error) {
        console.log(error)

        return res.status(500).send({
            message: "Error performing the species search!"
        })
    }
}

exports.findPetById = async (req, res) => {
    try {
        const {pet_id} = req.params.pet_id

        const petVerify = await Pet.findById({ _id: pet_id })

        if (!petVerify) {
            return res.status(404).send({
                message: "No pets found!"
            })
        } else {
            return res.status(200).send({
                message: petVerify
            })
        }
    } catch (error) {
        console.log(error)

        return res.status(500).send({
            message: "Error returning an animal!"
        })
    }
}

exports.findPetByUser = async (req, res) => {
    try {
        const {user_id} = req.params

        if(!user_id){
            return res.status(400).send({
                message: "Please provide user id!"
            })
        }

        const validateUserId = await User.findById({_id: user_id})

        if(!validateUserId){
            return res.status(404).send({
                message: "No user was found with this id!"
            })
        }

        const petVerify = await Pet.find({ owner_id: user_id })

        if (!petVerify) {
            return res.status(404).send({
                message: "This user has not registered any animals!"
            })
        } else {
            return res.status(200).send({
                message: petVerify
            })
        }
    } catch (error) {
        console.log(error)

        return res.status(500).send({
            message: "Error returning the animals that this user registered!"
        })
    }
}

exports.alterPet = async (req, res) => {
    try {
        const {user_id, pet_id} = req.params

        if(!user_id || !pet_id){
            return res.status(400).send({
                message: "Please provide all necessary information!"
            })
        }

        const { name, species, race, years } = req.body

        const updatedFields = {}

        if (!name && !specie && !race && !years) {
            return res.status(400).send({
                message: "Please enter the field you want to change!"
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
                message: "No animals with this id were found!"
            })
        } else {
            return res.status(200).send({
                message: "Pet changed successfully!",
                nova_info: updatedPet
            })
        }
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            const errors = captureErr
            return res.status(422).send({
                message: "Error changing animal data!",
                errors: errors
            })
        } else {
            console.log(error)

            return res.status(500).send({
                message: "Error changing animal information!"
            })
        }
    }
}

exports.deletePet = async (req, res) => {
    try {
        const {user_id, pet_id} = req.params

        if(!user_id || !pet_id){
            return res.status(400).send({
                message: "Please provide all necessary information!"
            })
        }

        const deletePet = await Pet.findByIdAndDelete({
            _id: pet_id,
            owner_id: user_id
        })

        if (!deletePet) {
            return res.status(404).send({
                message: "No animals were found!"
            })
        } else {
            return res.status(200).send({
                message: "Pet deleted successfully!",
                pet_detail: deletePet
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            message: "Error deleting pet!"
        })
    }
}