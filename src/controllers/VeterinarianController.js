const Veterinarian = require("../models/Veterinarian")
const yup = require("yup")
const bcrypt = require("bcryptjs")
const captureErrorYup = require("../utils/captureErrorYup")
const Consultation = require("../models/Consultation")
const jwt = require("jsonwebtoken")

exports.newVeterinarian = async (req, res) => {
    try {
        const { full_name, cfmv, college_graduated, specialty, professional_email, password, repeate_password } = req.body

        const VeterinarianSchema = yup.object().shape({
            full_name: yup.string().required("O nome do veterinário é obrigatório!"),

            cfmv: yup.string().required("O seu cfmv é obrigatório!"),

            college_graduated: yup.string().required("O nome da faculdade é obrigatório!"),

            specialty: yup.string().required("Fornecer sua especialidade é obrigatório!"),

            professional_email: yup.string().email("Digite um email válido!").required("O seu email profissional é obrigatório!"),

            password: yup.string().required("A senha é obrigatória!").min(6, "A senha deve ter no mínimo 6 caracteres!").max(30, "A senha deve ter no máximo 30 caracteres!"),

            repeate_password: yup.string().required("A confirmação da senha é obrigatória!").oneOf([password, null], "As senhas devem ser iguais!")
        })

        await VeterinarianSchema.validate(req.body, { abortEarly: false })

        const professionalEmailValidate = await Veterinarian.findOne({ professional_email })

        if (professionalEmailValidate) {
            return res.status(422).send({
                mensagem: "Este email já foi cadastrado!"
            })
        }

        const cfmvValidate = await Veterinarian.findOne({ cfmv })

        if (cfmvValidate) {
            return res.status(422).send({
                mensagem: "Este cfmv já foi cadastrado!"
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

        console.log("Veterinário salvo!")

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

exports.findVeterinarianByName = async (req, res) => {
    try {
        const { name } = req.body

        if (!name) {
            return res.status(400).send({
                mensagem: "Por favor, digite o nome do veterinário que deseja pesquisar!"
            })
        }

        const nameRegex = new RegExp({ name })

        const findingVeterinarian = await
            Veterinarian.find({ full_name: nameRegex })

        if (!findingVeterinarian) {
            return res.status(404).send({
                mensagem: "Nenhum veterinário encontrado!"
            })
        } else {
            return res.status(200).send({
                mensagem: "Pesquisa efetuada com sucesso!",

                veterinarian_details: findingVeterinarian
            })
        }
    } catch (error) {
        console.log(error)

        return res.status(500).send({
            mensagem: "Erro ao efetuar a pesquisa do veterinário!"
        })
    }
}

exports.findTodayConsultation = async (req, res) => {
    try {
        const { veterinarian_id } = req.params.veterinarian_id

        if (!veterinarian_id) {
            return res.status(400).send({
                mensagem: "Por favor, forneça o id do veterinário!"
            })
        }

        const verifyVeterinarianConsultation = await Consultation.find({ veterinarian_id })

        const gettingDataQuery = verifyVeterinarianConsultation.date_of_consultation

        if (!gettingDataQuery == new Date()) {
            return res.status(404).send({
                mensagem: "Você não tem nenhuma consulta marcada para hoje!"
            })
        } else {
            const consultations = [gettingDataQuery]

            return res.status(200).send({
                mensagem: "Listagem das consultas de hoje concluída!",
                consultations_details: consultations
            })
        }
    } catch (error) {
        console.log(error)

        return res.status(500).send({
            mensagem: "Erro ao buscar as consultas de hoje!"
        })
    }
}

exports.findAllConsultations = async (req, res) => {
    try {
        const { veterinarian_id } = req.params.veterinarian_id

        if (!veterinarian_id) {
            return res.status(400).send({
                mensagem: "Por favor, forneça o id do veterinário!"
            })
        }

        const findingAllConsultation = await Consultation.find({
            veterinarian_id
        })

        if (!findingAllConsultation) {
            return res.status(404).send({
                mensagem: "Nenhuma consulta encontrada!"
            })
        } else {
            return res.status(200).send({
                mensagem: "Aqui estão as suas consultas:",
                consultations_details: findingAllConsultation
            })
        }
    } catch (error) {
        console.log(error)

        return res.status(500).send({
            mensagem: "Erro ao retornar as consultas!"
        })
    }
}

exports.alterVeterinarianInfos = async (req, res) => {
    try {
        const { veterinarian_id } = req.params.veterinarian_id

        if (!veterinarian_id) {
            return res.status(400).send({
                mensagem: "Por favor, forneça o id do veterinário!"
            })
        }

        const { new_full_name, new_cfmv, new_college_graduated, new_specialty, new_professional_email, new_password } = req.body

        if (!new_full_name && !new_cfmv && !new_college_graduated && !new_specialty && !new_professional_email && !new_password) {
            return res.status(400).send({
                mensagem: "Preencha pelo menos um dos campos!"
            })
        }


        const newPasswordHash = await bcrypt.hash(new_password, 20)

        const updatedFields = [
            new_full_name,
            new_cfmv,
            new_college_graduated,
            new_specialty,
            new_professional_email,
            newPasswordHash
        ]

        const updatingVeterinarianInfos = await Veterinarian.findByIdAndUpdate({
            _id: veterinarian_id,
            full_name: updatedFields.new_full_name,
            cfmv: updatedFields.new_cfmv,
            college_graduated: updatedFields.new_college_graduated,
            specialty: updatedFields.new_specialty,
            professional_email: updatedFields.new_professional_email,
            password: updatedFields.newPasswordHash
        })

        if (!updatingVeterinarianInfos) {
            return res.status(404).send({
                mensagem: "Nenhum veterinário enconterado!"
            })
        } else {
            return res.status(200).send({
                mensagem: "Informações alteradas com sucesso!",

                veterinarian_details: updatingVeterinarianInfos
            })
        }
    } catch (error) {
        console.log(error)

        return res.status(500).send({
            mensagem: "Erro ao alterar as informações!"
        })
    }
}

exports.deleteVeterinarianAccount = async (req, res) => {
    try {
        const { veterinarian_id } = req.params.veterinarian_id

        if (!veterinarian_id) {
            return res.status(400).send({
                mensagem: "Por favor, forneça o id do veterinário!"
            })
        }

        const deleteVeterinarianAccount = await Veterinarian.findByIdAndDelete({ _id: veterinarian_id })

        if (!deleteVeterinarianAccount) {
            return res.status(404).send({
                mensagem: "Nenhum veterinário encontrado!"
            })
        } else {
            return res.status(200).send({
                mensagem: "Conta deletada com sucesso!"
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            mensagem: "Erro ao excluír conta!"
        })
    }
}

exports.veterinarianLogin = async (req, res)=>{
    try{
        const {professional_email, cfmv, password} = req.body

        if(!professional_email || !cfmv || !password){
            return res.status(400).send({
                mensagem: "Por favor, digite todas as informações!"
            })
        }

        const checkIfVeterinarianExists = await Veterinarian.findOne({professional_email, cfmv})

        const checkPassword = await bcrypt.compare(password, checkIfVeterinarianExists.password)

        if(!checkIfVeterinarianExists || !checkPassword){
            return res.status(422).send({
                mensagem: "Por favor, digite todas as informações corretas!"
            })
        }

        const veterinarianSecret = process.env.VETERINARIAN_SECRET

        const token = jwt.sign({
            _id: checkIfVeterinarianExists.id
        }, veterinarianSecret)

        return res.status(200).send({
            mensagem: "Login efetuado com sucesso!",
            token: token,
            veterinarian_id: checkIfVeterinarianExists.id
        })
    }catch(error){
        console.log(error)

        return res.status(500).send({
            mensagem: "Erro ao efetuar o login!"
        })
    }
}