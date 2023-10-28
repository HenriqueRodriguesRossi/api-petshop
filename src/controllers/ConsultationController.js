const Consultation = require("../models/Consultation")
const yup = require("yup")
const captureErrorYup = require("../utils/captureErrorYup")

exports.newConsultation = async (req, res)=>{
    try{
        const {user_id, pet_id, veterinarian_id} = req.params

        if(!user_id || !pet_id || !veterinarian_id){
            return res.status(400).send({
                message: "Please provide the IDs of the pet owner, the pet and the veterinarian you wish to make an appointment with!"
            })
        }

        const {date_of_consultation, hour_of_consultation, comments} = req.body

        const consultationSchema = yup.object().shape({
           date_of_consultation: yup.date("Please enter a valid date!").required("The consultation date is required!").min(new Date(), "Dates in the past are not accepted!"),

           hour_of_consultation: yup.string().required("The consultation time is required!"),

           comments: yup.string().min(3, "The comment must have at least 3 characters!")
        })

        await consultationSchema.validate(req.body, {abortEarly: false})

        const checkHour = await Consultation.findOne({
            veterinarian_id,
            date_of_consultation, hour_of_consultation
        })

        if(checkHour){
            return res.status(422).send({
                message: "Wow, this vet no longer has this time available!"
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
            message: "Appointment scheduled successfully!",
            consultation_details: newConsultation
        })
    }catch(error){
        if(error instanceof yup.ValidationError){
            const errors = [captureErrorYup(error)]

            return res.status(422).send({
                message: "Error scheduling the appointment!",
                errors: errors
            })
        }else{
            console.log(error)

            return res.status(500).send({
                message: "Error registering the consultation!"
            })
        }
    }
}

exports.alterUserConsultation = async (req, res)=>{
    try{
        const {user_id, consultation_id} = req.params

        if(!user_id || !consultation_id){
            return res.status(400).send({
                message: "Please provide the user id and query id in the request URL!"
            })
        }

        const {new_date_of_consultation, new_hour_of_consultation, new_comments} = req.body

        if(!new_date_of_consultation && !new_hour_of_consultation && !new_comments){
            return res.status(400).send({
                message: "At least one of the fields must be filled in!"
            })
        }

        const checkHour = await Consultation.findOne({veterinarian_id: consultation_id.veterinarian_id, date_of_consultation: new_date_of_consultation, hour_of_consultation: new_hour_of_consultation})
       
        if(checkHour){
            return res.status(422).send({
                message: "Times unavailable!"
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
                message: "No queries were found!"
            })
        }
       
        return res.status(200).send({
            message: "Query changed successfully!"
        })
    }catch(error){
        console.log(error)

        return res.status(500).send({
            message: "Error changing query!"
        })
    }
}

exports.findUserConsultation = async (req, res)=>{
    try{
        const {user_id} = req.params

        if(!user_id){
            return res.status(400).send({
                message: "Please provide user id!"
            })
        }
       
        const getUserConsultation = await Consultation.find({
            owner_id: user_id
        })

        return res.status(200).send({
            message: "Success!",
           
            consultations_details: getUserConsultation
        })
    }catch(error){
        console.log(error)

        return res.status(500).send({
            message: "Error returning queries!"
        })
    }
}

exports.deleteConsultation = async (req, res)=>{
    try{
        const {user_id, consultation_id} = req.params
   
        if(!user_id || !consultation_id){
            return res.status(400).send({
                message: "Please provide user id and query id!"
            })
        }
   
        const deleteConsultation = await Consultation.findByIdAndDelete({
            _id: consultation_id
        })
   
        return res.status(200).send({
            message: "Query deleted successfully!",
            details: deleteConsultation
        })
    }catch(error){
        console.log(error)
        return res.status(500).send({
            message: "Error deleting query!"
        })
    }
}