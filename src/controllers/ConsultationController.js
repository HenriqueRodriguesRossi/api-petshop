const Consultation = require("../models/Consultation")
const yup = require("yup")
const captureErrorYup = require("../utils/captureErrorYup")

exports.newConsultation = async (req, res)=>{
    try{
        const user_id = req.params.owner_id
        const pet_id = req.params.pet_id
        const veterinarian_id = req.params.veterinarian_id

        await userValidate(user_id)
        await petValidate(pet_id)
        await veterinarianValidate(veterinarian_id)

        const {date_of_consultation, hour_of_consultation, comments} = req.body

        const consultationSchema = yup.object().shape({
           date_of_consultation: yup.string().date("Digite uma data válida!").required("A data da consulta é obrigatória!"),

           hour_of_consultation: yup.string().required("O horário da consulta é obrigatório!"),

           comments: yup.string().min(3, "O comentátio deve ter no mínimo 3 caracteres!")
        })

        await consultationSchema.validate(req.body, {abortEarly: false})

        const checkHour = await Consultation.findOne({date_of_consultation, hour_of_consultation, veterinarian_id})

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

exports.findUserConsultation = async (req, res)=>{
    try{
        const user_id = req.params.user_id

        await userValidate(user_id)
    
        const checkConsultation = await Consultation.find({owner_id: user_id})

        if(!checkConsultation){
            return res.status(404).send({
                mensagem: "Este usuário não tem nenhuma consulta no histórico!"
            })
        }else{
            return res.status(200).send({
                mensagem: "Sucesso!",
                
                all_consultation: checkConsultation
            })
        }
    }catch(error){
        console.log(error)

        return res.status(500).send({
            mensagem: "Erro ao buscar as consultas!"
        })
    }
}

exports.alterUserConsultation = async (req, res)=>{
    try{
        const user_id = req.params.user_id
        const consultation_id = req.params.consultation_id

        await userValidate(user_id)

        if(!consultation_id){
            return res.status(400).send({
                mensagem: "Id da consulta deve ser fornecido!"
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

exports.deleteAccount = async (req, res)=>{
    try{
        const user_id = req.params.user_id
        const consultation_id = req.params.consultation_id
    
        const userValidate = await userValidate(user_id)
        const consultationValidate = await consultationValidate(consultation_id)
    
        if(user_id !== consultation_id.owner_id){
            return res.status(422).send({
                mensagem: "Apenas quem agendou a consulta pode excluí-la!"
            })
        }
    
        const deleteConsultation = await Consultation.findByIdAndDelete({_id: consultation_id})
    
        return res.status(200).send({
            mensagem: "Consulta excluída com sucesso!"
        })
    }catch(error){
        console.log(error)
        return res.status(500).send({
            mensagem: "Erro ao deletar consulta!"
        })
    }
}

exports.findPetConsultation = async (req, res)=>{
    try{
        const pet_id = req.params.pet_id

        await petValidate(pet_id)

        const findConsultation = await Consultation.findById({_id: pet_id})

        if(!findConsultation){
            return res.status(404).send({
                mensagem: "Este animal não tem nenhuma consulta marcada!"
            })
        }else {
            return res.status(200).send({
                mensagem: "Sucesso!",
                consultation_details: findConsultation
            })
        }
    }catch(error){
        console.log(error)

        return res.status(500).send({
            mensagem: "Erro ao listar usuários!"
        })
    }
}

exports.alterPetConsultation = async (req, res)=>{
    try{
        const pet_id = req.params.pet_id
        const consultation_id = req.params.consultation_id

        await petValidate(pet_id)

        if(!consultation_id){
            return res.status(400).send({
                mensagem: "Id da consulta deve ser fornecido!"
            })
        }

        const {new_date_of_consultation, new_hour_of_consultation, new_comments} = req.body

        if(!new_date_of_consultation && !new_hour_of_consultation && !new_comments){
            return res.status(400).send({
                mensagem: "Pelo menos um dos campos deve ser preencher!"
            })
        }

        const checkHour = await Consultation.findOne({
            veterinarian_id: consultation_id.veterinarian_id, 
            date_of_consultation: new_date_of_consultation, hour_of_consultation: new_hour_of_consultation})
        
        if(checkHour){
            return res.status(422).send({
                mensagem: "Horário indisponível!"
            })
        }
    
        const newConsultation = await Consultation.findByIdAndUpdate({
            _id: consultation_id,
            date_of_consultation: new_date_of_consultation,
            hour_of_consultation: new_hour_of_consultation,
            comments: new_comments
        })

        if(!newConsultation){
            return res.status(404).send({
                mensagem: "Nenhuma consulta foi encontrada!"
            })
        }
        
        return res.status(200).send({
            mensagem: "Consulta alterada com sucesso!",
            consultatiion_info: newConsultation
        })
    }catch(error){
        console.log(error)

        return res.status(500).send({
            mensagem: "Erro ao alterar a consulta!"
        })
    }
}

exports.deletePetAccount = async (req, res)=>{
    try{
        const pet_id = req.params.pet_id
        const consultation_id = req.params.consultation_id
    
        await petValidate(pet_id)
        await consultationValidate(consultation_id)
    
        const deleteConsultation = await Consultation.findByIdAndDelete({_id: consultation_id})
    
        return res.status(200).send({
            mensagem: "Consulta excluída com sucesso!",
            infos: deleteConsultation
        })
    }catch(error){
        console.log(error)
        return res.status(500).send({
            mensagem: "Erro ao deletar consulta!"
        })
    }
}