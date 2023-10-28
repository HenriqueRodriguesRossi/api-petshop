const User = require("../models/User")
const yup = require("yup")
const captureErrorYup = require("../utils/captureErrorYup")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

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
        const {user_id} = req.params

        if(!user_id){
            return res.status(400).send({
                message: "Please provide user id!"
            })
        }

        const deleteAccount = await User.findByIdAndDelete({ _id: user_id })

        if(!deleteAccount){
            return res.status(404).send({
                message: "No accounts found!"
            })
        }

        return res.status(200).send({
            message: "Account deleted successfully!",

            details: deleteAccount
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            message: "Error deleting account!"
        })
    }
}

exports.alterPass = async (req, res) => {
    try {
        const user_id = req.params.user_id

        await userValidate(user_id)

        const { new_pass } = req.body

        if (!new_pass) {
            return res.status(400).send({
                message: "Enter your new password!"
            })
        } else if (new_pass.length < 6) {
            return res.status(422).send({
                message: "The password must be at least 6 characters long!"
            })
        }

        const newPassHash = await bcrypt.hash(new_pass, 10)

        const newUserPass = await User.findByIdAndUpdate({
            _id: user_id,
            password: newPassHash
        })

        await newUserPass.save()

        return res.status(200).send({
            message: "Password changed successfully!"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            message: "Error changing password!"
        })
    }
}

exports.alterEmail = async (req, res) => {
    try {
        const { user_id } = req.params

        const { new_email } = req.body

        const emailValidate = yup.object().shape({
            new_email: yup.string().required("New email is required!").email("Please enter a valid email!")
        })

        await emailValidate.validate(req.body, { abortEarly: false })

        const checkIfEmailExists = await User.findOne({
            _id: user_id,
            email: new_email
        })

        if (checkIfEmailExists) {
            return res.status(422).send({
                message: "This is already the email that appears in the system, so it has not been changed!"
            })
        } else {
            const newUserEmail = await User.findByIdAndUpdate({
                _id: user_id,
                email: new_email
            })

            await newUserEmail.save()

            return res.status(200).send({
                message: "Email changed successfully!"
            })
        }
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            const errors = [captureErrorYup(error)]
            return res.status(422).send({
                message: "Error changing email!",
                error: errors
            })
        }

        console.log(error)
        return res.status(500).send({
            message: "Error changing email!"
        })
    }
}

exports.findUserById = async (req, res)=>{
    try{
        const {user_id} = req.params

        if(!user_id){
            return res.status(400).send({
                message: "Please provide user id!"
            })
        }

        const findUserById = await User.findById({
            _id: user_id
        })

        if(!findUserById){
            return res.status(404).send({
                message: "No users were found!"
            })
        }else{
            return res.status(200).send({
                message: "User found successfully!",

                user_details: findUserById
            })
        }
    }catch(error){
        console.log(error)

        return res.status(500).send({
            message: "Error searching for user!"
        })
    }
}

exports.findUserByName = async(req, res)=>{
    try{
        const {first_name} = req.body

        if(!first_name){
            return res.status(400).send({
                message: "Please enter the user's first name!"
            })
        }
   
        const findUserByFirstName = await User.find({
            first_name
        })
   
        if(!findUserByFirstName || findUserByFirstName.length == 0){
            return res.status(404).send({
                message: "No users found!"
            })
        }else{
            return res.status(200).send({
                results: findUserByFirstName
            })
        }
    }catch(error){
        console.log(error)

        return res.status(500).send({
            message: "Error searching for users!"
        })
    }
}

exports.findAllUsers = async (req, res)=>{
    try{
        const findAllUsers = await User.find()

        if(!findAllUsers || findAllUsers.length == 0){
            return res.status(404).send({
                message: "No users found!"
            })
        }else{
            return res.status(200).send({
                results: findAllUsers
            })
        }
    }catch(error){
        console.log(error)
        return res.status(500).send({
            message: "Error searching all users!"
        })
    }
}