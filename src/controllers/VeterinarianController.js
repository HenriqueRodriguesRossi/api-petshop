const Veterinarian = require("../models/Veterinarian")
const yup = require("yup")
const bcrypt = require("bcryptjs")
const captureErrorYup = require("../utils/captureErrorYup")

exports.newVeterinarian = async (req, res) => {
    try {
        const { full_name, cfmv, college_graduated, specialty, professional_email, password, repeate_password } = req.body

        const VeterinarianSchema = yup.object().shape({
            full_name: yup.string().require("O nome do veterinário é obrigatório!"),

            cfmv: yup.string().require("O seu cfmv é obrigatório!"),

            college_graduated: yup.string().require("O nome da faculdade é obrigatório!"),

            specialty: yup.string().require("Fornecer sua especialidade é obrigatório!"),

            professional_email: yup.string().email("Digite um email válido!").require("O seu email profissional é obrigatório!"),

            password: yup.string().require("A senha é obrigatória!").min(6, "A senha deve ter no mínimo 6 caracteres!").max(30, "A senha deve ter no máximo 30 caracteres!"),

            repeate_password: yup.string().required("A confirmação da senha é obrigatória!").oneOf([password, null], "As senhas devem ser iguais!")
        })

        await VeterinarianSchema.validate(req.body, { abortEarly: false })

        const professionalEmailValidate = await Veterinarian.findOne({ email })

        const cfmvValidate = await Veterinarian.findOne({ cfmv })

        if (professionalEmailValidate) {
            return res.status(422).send({
                mensagem: "Este email já foi cadastrado!"
            })
        } else if (cfmvValidate) {
            return res.status(422).send({
                mensagem: "Este cfmv já foi cadastrado!"
            })
        }

        const passwordHash = await bcrypt.hash(password, 20)

        const newVeterinarian = new Veterinarian({
            full_name,
            cfmv,
            college_graduated,
            specialty,
            professional_email,
            password: passwordHash
        })

        await newVeterinarian.save()

        return res.status(201).send({
            mensagem: "Veterinário cadastrado com sucesso!",
            details: newVeterinarian
        })
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            const errors = [captureErrorYup(error)]

            return res.status(422).send({
                mensagem: "Erro ao cadastrar o profissional!",

                errors: errors
            })
        } else {
            console.log(error)

            return res.status(500).send({
                mensagem: "Erro ao cadastrar o profissional!"
            })
        }
    }
}

exports.findAll = async (req, res) => {
    try {
        const allVeterinarian = await Veterinarian.find()

        return res.status(200).send({
            mensagem: "Pesquisa efetuada com sucesso!",
            all_veterinarian: allVeterinarian
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            mensagem: "Erro ao efetuar a pesquisa!"
        })
    }
}

exports.findVeterinarianById = async (req, res) => {
    try {
        const { veterinarian_id } = req.params.veterinarian_id

        if (!veterinarian_id) {
            return res.status(400).send({
                mensagem: "Por favor, digite o id do veterinário!"
            })
        }

        const findingVeterinarian = await Veterinarian.findById({ _id: veterinarian_id })

        if (!findingVeterinarian) {
            return res.status(404).send({
                mensagem: "Nenhum veterinário encontrado!"
            })
        } else {
            return res.status(200).send({
                mensagem: "Veterinário encontrado com sucuesso!",
                veterinarian_details: findingVeterinarian
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            mensagem: "Erro ao buscar o profissional!"
        })
    }
}