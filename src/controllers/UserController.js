const User = require("../models/User")
const yup = require("yup")
const captureErrorYup = require("../utils/captureErrorYup")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const userValidate = require("../utils/userValidate")

exports.newUser = async (req, res) => {
    try {
        const { first_name, last_name, email, password, repeat_password } = req.body

        const UserSchema = yup.object().shape({
            first_name: yup.string().required("The first name is required!").min(3, "The first name must contain at least 3 characters!"),

            last_name: yup.string().required("The last name is required!").min(5, "The last name must contain at least 5 characters!"),

            email: yup.string().required("Email is required!").email("Please enter a valid email!"),

            password: yup.string().required("The password is required!").min(6, "The password must have a minimum of 6 characters!").max(30, "The password must have a maximum of 30 characters!"),

            repeat_password: yup.string().required("Password confirmation is mandatory!").oneOf([password, null], "Passwords must be the same!")
        })

        await UserSchema.validate(req.body, { abortEarly: false })

        const checkEmail = await User.findOne({ email })

        if (checkEmail) {
            return res.status(422).send({
                message: "This email has already been registered!"
            })
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const newUser = new User({
            first_name,
            last_name,
            email,
            password: passwordHash
        })

        await newUser.save()

        return res.status(201).send({
            message: "User created successfully!",
            id: newUser._id
        })
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            const errors = [captureErrorYup(error)]

            return res.status(422).send({
                error: errors
            })
        } else {
            console.log(error)

            return res.status(500).send({
                error: "Error registering user!"
            })
        }
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).send({
                message: "Email and password are required!"
            })
        }

        const user = await User.findOne({ email })
        const comparePass = await bcrypt.compare(password, user.password)

        if (!user) {
            return res.status(404).send({
                message: "Incorrect email or password!"
            })
        } else if (!comparePass) {
            return res.status(404).send({
                message: "Incorrect email or password!"
            })
        }

        const secret = process.env.SECRET

        const token = jwt.sign({
            id: user._id
        }, secret)

        return res.status(200).send({
            message: "Login successful!",
            token
        })
    } catch (error) {
        console.log(error)

        return res.status(500).send({
            message: "Error logging in!"
        })
    }
}

exports.deleteAccount = async (req, res) => {
    try {
        const user_id = req.params.user_id

        await userValidate(user_id)

        const deleteAccount = await User.findByIdAndDelete({ _id: user_id })

        return res.status(200).send({
            mensagem: "Conta excluída com sucesso!",

            details: deleteAccount
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            mensagem: "Erro ao excluir a conta!"
        })
    }
}

exports.alterPass = async (req, res) => {
    try {
        const user_id = req.params.user_id

        await userValidate(user_id)

        const { new_pass } = req.body

        if(!new_pass){
            return res.status(400).send({
                mensagem: "Digite a sua nova senha!"
            })
        }else if(new_pass.length < 6){
            return res.status(422).send({
                mensagem: "A senha deve ter no mínimo 6 caracteres!"
            })
        }

        const newPassHash = await bcrypt.hash(new_pass, 10)

        const newUserPass = await User.findByIdAndUpdate({
            _id: user_id,
            password: newPassHash
        })

        await newUserPass.save()

        return res.status(200).send({
            mensagem: "Senha alterada com sucesso!"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            mensagem: "Erro ao alterar a senha!"
        })
    }
}

exports.alterEmail = async (req, res) => {
    try {
        const user_id = req.params.user_id

        if (userValidate(user_id)) {
            const { new_email } = req.body

            const emailValidate = yup.object().shape({
                new_email: yup.string().required("O novo email é obrigatório!").email("Digitr um email válido!")
            })

            await emailValidate.validate(req.body, {abortEarly: false})

            const checkIfEmailExists = await User.findOne({
                _id: user_id,
                email: new_email
            })

            if(checkIfEmailExists){
                return res.status(422).send({
                    mensagem: "Este já é o email que consta em sistema, por isso, não foi alterado!"
                })
            }else{
                const newUserEmail = await User.findByIdAndUpdate({
                    _id: user_id,
                    email: new_email
                })
    
                await newUserEmail.save()
    
                return res.status(200).send({
                    mensagem: "Email alterado com sucesso!"
                })
            }
        }
    } catch (error) {
        if(error instanceof yup.ValidationError){
            const errors = [captureErrorYup(error)]
            return res.status(422).send({
                mensagem: "Erro ao alterar email!",
                erro: errors
            })
        }

        console.log(error)
        return res.status(500).send({
            mensagem: "Erro ao alterar o email!"
        })
    }
}