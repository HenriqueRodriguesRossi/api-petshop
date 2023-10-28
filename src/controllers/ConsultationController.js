const Consultation = require("../models/Consultation")
const yup = require("yup")
const captureErrorYup = require("../utils/captureErrorYup")

exports.newConsultation = async (req, res)=>{
    try{
        const {user_id, pet_id, veterinarian_id} = req.params

        if(!user_id || !pet_id || !veterinarian_id){
            return res.status(400).send({
                mensagem: "Por favor, forneça os ids do dono do pet, do pet e do veterinário que deseja marcar uma consulta!"
            })
        }

        const {date_of_consultation, hour_of_consultation, comments} = req.body

        const consultationSchema = yup.object().shape({
           date_of_consultation: yup.date("Digite uma data válida!").required("A data da consulta é obrigatória!").min(new Date(), "Não são aceitas datas no passado!"),

           hour_of_consultation: yup.string().required("O horário da consulta é obrigatório!"),

           comments: yup.string().min(3, "O comentátio deve ter no mínimo 3 caracteres!")
        })

        await consultationSchema.validate(req.body, {abortEarly: false})

        const checkHour = await Consultation.findOne({
            veterinarian_id,
            date_of_consultation, hour_of_consultation
        })

        if(checkHour){
            return res.status(422).send({
                mensagem: "Poxa, esse veterinário não tem mais esse horário disponível!"
            })
        }

        const newConsultation = new Consultation({
            owner_id: user_id,
            pet_id,
            veterinarian_id,
            date_of_consultation,
            hour_of_consultation,
            comments
        })

        await newConsultation.save()

        return res.status(201).send({
            mensagem: "Consulta marcada com sucesso!",
            consultation_details: newConsultation
        })
    }catch(error){
        if(error instanceof yup.ValidationError){
            const errors = [captureErrorYup(error)]

            return res.status(422).send({
                mensagem: "Erro ao agendar a consulta!",
                erros: errors
            })
        }else{
            console.log(error)

            return res.status(500).send({
                mensagem: "Erro ao cadastrar a consulta!"
            })
        }
    }
}

exports.alterUserConsultation = async (req, res)=>{
    try{
        const {user_id, consultation_id} = req.params

        if(!user_id || !consultation_id){
            return res.status(400).send({
                mensagem: "Por favor, forneça o id do usuário e o id da consulta na URL da requisição!"
            })
        }

        const {new_date_of_consultation, new_hour_of_consultation, new_comments} = req.body

        if(!new_date_of_consultation && !new_hour_of_consultation && !new_comments){
            return res.status(400).send({
                mensagem: "Pelo menos um dos campos deve ser preencher!"
            })
        }

        const checkHour = await Consultation.findOne({veterinarian_id: consultation_id.veterinarian_id, date_of_consultation: new_date_of_consultation, hour_of_consultation: new_hour_of_consultation})
        
        if(checkHour){
            return res.status(422).send({
                mensagem: "Horário indisponível!"
            })
        }
    
        const consultationValidate = await Consultation.findByIdAndUpdate({
            _id: consultation_id, 
            owner_id: user_id,
            date_of_consultation: new_date_of_consultation,
            hour_of_consultation: new_hour_of_consultation,
            comments: new_comments
        })

        if(!consultationValidate){
            return res.status(404).send({
                mensagem: "Nenhuma consulta foi encontrada!"
            })
        }
        
        return res.status(200).send({
            mensagem: "Consulta alterada com sucesso!"
        })
    }catch(error){
        console.log(error)

        return res.status(500).send({
            mensagem: "Erro ao alterar a consulta!"
        })
    }
}

exports.findUserConsultation = async (req, res)=>{
    try{
        const {user_id} = req.params

        if(!user_id){
            return res.status(400).send({
                mensagem: "Por favor, forneça o id do usuário!"
            })
        }
        
        const getUserConsultation = await Consultation.find({
            owner_id: user_id
        })

        return res.status(200).send({
            mensagem: "Sucesso!",
            
            consultations_details: getUserConsultation
        })
    }catch(error){
        console.log(error)

        return res.status(500).send({
            mensagem: "Erro ao retornar as consultas!"
        })
    }
}

exports.deleteConsultation = async (req, res)=>{
    try{
        const {user_id, consultation_id} = req.params
    
        if(!user_id || !consultation_id){
            return res.status(400).send({
                mensagem: "Por favor, forneça o id do usuário e o id da consulta!"
            })
        }
    
        const deleteConsultation = await Consultation.findByIdAndDelete({
            _id: consultation_id
        })
    
        return res.status(200).send({
            mensagem: "Consulta excluída com sucesso!",
            details: deleteConsultation
        })
    }catch(error){
        console.log(error)
        return res.status(500).send({
            mensagem: "Erro ao deletar consulta!"
        })
    }
}