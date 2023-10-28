const Veterinarian = require("../models/Veterinarian")
const yup = require("yup")
const bcrypt = require("bcryptjs")
const captureErrorYup = require("../utils/captureErrorYup")
const Consultation = require("../models/Consultation")
const jwt = require("jsonwebtoken")

exports.newVeterinarian = async(req, res) => {
    try {
        const { full_name, cfmv, college_graduated, specialty, professional_email, password, repeate_password } = req.body

        const VeterinarianSchema = yup.object().shape({
            full_name: yup.string().required("The vet's name is required!"),

            cfmv: yup.string().required("Your cfmv is required!"),

            college_graduated: yup.string().required("College name is required!"),

            specialty: yup.string().required("Providing your specialty is required!"),

            professional_email: yup.string().email("Please enter a valid email!").required("Your professional email is required!"),

            password: yup.string().required("The password is required!").min(6, "The password must have a minimum of 6 characters!").max(30, "The password must have a maximum of 30 characters! "),

            repeate_password: yup.string().required("Password confirmation is mandatory!").oneOf([password, null], "Passwords must be the same!")
        })

        await VeterinarianSchema.validate(req.body, { abortEarly: false })

        const professionalEmailValidate = await Veterinarian.findOne({ professional_email })

        if (professionalEmailValidate) {
            return res.status(422).send({
                message: "This email has already been registered!"
            })
        }

        const cfmvValidate = await Veterinarian.findOne({ cfmv })

        if (cfmvValidate) {
            return res.status(422).send({
                message: "This cfmv has already been registered!"
            })
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const newVeterinarian = new Veterinarian({
            full_name,
            cfmv,
            college_graduated,
            specialty,
            professional_email,
            password: passwordHash
        })

        await newVeterinarian.save()

        console.log("Vet saved!")

        return res.status(201).send({
            message: "Veterinarian registered successfully!",
            details: newVeterinarian
        })
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            const errors = [captureErrorYup(error)]

            return res.status(422).send({
                message: "Error registering the professional!",

                errors: errors
            })
        } else {
            console.log(error)

            return res.status(500).send({
                message: "Error registering the professional!"
            })
        }
    }
}

exports.findAll = async (req, res) => {
    try {
        const allVeterinarian = await Veterinarian.find()

        return res.status(200).send({
            message: "Search completed successfully!",
            all_veterinarian: allVeterinarian
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            message: "Error performing the search!"
        })
    }
}

exports.findVeterinarianById = async(req, res) => {
    try {
        const { veterinarian_id } = req.params

        if (!veterinarian_id) {
            return res.status(400).send({
                message: "Please enter vet id!"
            })
        }

        const findingVeterinarian = await Veterinarian.findById({ _id: veterinarian_id })

        if (!findingVeterinarian) {
            return res.status(404).send({
                message: "No vet found!"
            })
        } else {
            return res.status(200).send({
                message: "Veterinarian found successfully!",
                veterinarian_details: findingVeterinarian
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            message: "Error searching for the professional!"
        })
    }
}

exports.findVeterinarianByName = async(req, res) => {
    try {
        const { full_name } = req.body

        if (!full_name) {
            return res.status(400).send({
                message: "Please enter the name of the vet you want to search for!"
            })
        }

        const findingVeterinarian = await
            Veterinarian.find({ full_name })

        if (!findingVeterinarian) {
            return res.status(404).send({
                message: "No vet found!"
            })
        } else {
            return res.status(200).send({
                message: "Search completed successfully!",

                veterinarian_details: findingVeterinarian
            })
        }
    } catch (error) {
        console.log(error)

        return res.status(500).send({
            message: "Error performing the vet search!"
        })
    }
}

exports.findAllConsultations = async (req, res) => {
    try {
        const { veterinarian_id } = req.params

        if (!veterinarian_id) {
            return res.status(400).send({
                message: "Please provide vet id!"
            })
        }

        const findingAllConsultation = await Consultation.find({
            veterinarian_id
        })

        if (!findingAllConsultation || findingAllConsultation.length == 0) {
            return res.status(404).send({
                message: "No queries found!"
            })
        } else {
            return res.status(200).send({
                message: "Here are your queries:",
                consultations_details: findingAllConsultation
            })
        }
    } catch (error) {
        console.log(error)

        return res.status(500).send({
            message: "Error returning queries!"
        })
    }
}

exports.alterVeterinarianEmail = async(req, res) => {
    try {
        const { veterinarian_id } = req.params

        if (!veterinarian_id) {
            return res.status(400).send({
                message: "Please provide vet id!"
            })
        }

        const { new_professional_email } = req.body

        const emailValidate = yup.object().shape({
            new_professional_email: yup.string().required("Email address is required!").email("Please enter a valid email address!")
        })

        await emailValidate.validate(req.body, {abortEarly: false})

        const alterVeterinarianEmail = await Veterinarian.findByIdAndUpdate({
            _id: veterinarian_id,
            professional_email: new_professional_email
        })

        return res.status(200).send({
            message: "Email changed successfully!",
            details: {
                new_email: new_professional_email
            }
        })
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            const Error = captureErrorYup(error)

            return res.status(422).send({
                message: "Error changing email!",
                error: Error
            })
        } else {
            console.log(error)

            return res.status(500).send({
                message: "Error changing vet's email!"
            })
        }
    }
}

exports.alterVeterinarianPass = async (req, res) => {
    try {
        const { veterinarian_id } = req.params

        if (!veterinarian_id) {
            return res.status(400).send({
                message: "Please provide vet id!"
            })
        }

        const { new_password } = req.body

        if (!new_password) {
            return res.status(400).send({
                message: "Please enter your new password!"
            })
        } else if (new_password.length < 6) {
            return res.status(422).send({
                message: "The password must be at least 6 characters long!"
            })
        } else if (new_password.length > 30) {
            return res.status(422).send({
                message: "The password must be a maximum of 30 characters!"
            })
        }

        const newPassHash = await bcrypt.hash(new_password, 10)

        const updatingVeterinarianPass = await Veterinarian.findByIdAndUpdate({
            _id: veterinarian_id,
            password: newPassHash
        })

        if (!updatingVeterinarianPass) {
            return res.status(404).send({
                message: "No vet found!"
            })
        } else {
            return res.status(200).send({
                message: "Password changed successfully!"
            })
        }
    } catch (error) {
        console.log(error)

        return res.status(500).send({
            message: "Error changing vet password!"
        })
    }
}

exports.deleteVeterinarianAccount = async (req, res) => {
    try {
        const { veterinarian_id } = req.params

        if (!veterinarian_id) {
            return res.status(400).send({
                message: "Please provide vet id!"
            })
        }

        const deleteVeterinarianAccount = await Veterinarian.findByIdAndDelete({ _id: veterinarian_id })

        if (!deleteVeterinarianAccount) {
            return res.status(404).send({
                message: "No vet found!"
            })
        } else {
            return res.status(200).send({
                message: "Account deleted successfully!"
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            message: "Error deleting account!"
        })
    }
}

exports.veterinarianLogin = async (req, res) => {
    try {
        const { professional_email, cfmv, password } = req.body

        if (!professional_email || !cfmv || !password) {
            return res.status(400).send({
                message: "Please enter all information!"
            })
        }

        const checkIfVeterinarianExists = await Veterinarian.findOne({ professional_email, cfmv })

        const checkPassword = await bcrypt.compare(password, checkIfVeterinarianExists.password)

        if (!checkIfVeterinarianExists || !checkPassword) {
            return res.status(422).send({
                message: "Please enter all the correct information!"
            })
        }

        const veterinarianSecret = process.env.VETERINARIAN_SECRET

        const token = jwt.sign({
            _id: checkIfVeterinarianExists.id
        }, veterinarianSecret)

        return res.status(200).send({
            message: "Login successful!",
            token: token,
            veterinarian_id: checkIfVeterinarianExists.id
        })
    } catch (error) {
        console.log(error)

        return res.status(500).send({
            message: "Error logging in!"
        })
    }
}