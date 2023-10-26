const router = require("express").Router()
const checkToken = require("../utils/checkToken")
const ConsultationController = require("../controllers/ConsultationController")

router.post("/consultation/new/:owner_id/:pet_id/veterinarian_id", checkToken, ConsultationController.newConsultation)

router.get("/consultation/find/:user_id", checkToken, ConsultationController.findUserConsultation)
router.put("/consultation/alter/:user_id/:consultation_id", checkToken, ConsultationController.alterUserConsultation)
router.delete("/consultation/exclude/:user_id", checkToken,)

router.get("/consultation/find/:pet_id", checkToken, )
router.put("/consultation/alter/:pet_id", checkToken, )
router.delete("/consultation/exclude/:pet_id", checkToken, )

module.exports = router