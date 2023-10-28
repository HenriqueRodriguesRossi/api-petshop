const router = require("express").Router()
const checkToken = require("../utils/checkToken")
const ConsultationController = require("../controllers/ConsultationController")

router.post("/consultation/new/:user_id/:pet_id/:veterinarian_id", checkToken, ConsultationController.newConsultation)

router.get("/consultation/find/:user_id", checkToken, ConsultationController.findUserConsultation)

router.put("/consultation/alter/:user_id/:consultation_id", checkToken, ConsultationController.alterUserConsultation)

router.delete("/consultation/exclude/:user_id/:consultation_id", checkToken, ConsultationController.deleteConsultation)

module.exports = router