const router = require("express").Router()
const checkVeterinarianToken = require("../utils/checkVeterinarianToken")
const VeterinarianController = require("../controllers/VeterinarianController")

router.post("/veterinarian/new", VeterinarianController.newVeterinarian)
router.post("/veterinarian/login", VeterinarianController.veterinarianLogin)

router.get("/veterinarian/find/all", checkVeterinarianToken, VeterinarianController.findAll)
router.get("/veterinarian/find/:veterinarian_id", checkVeterinarianToken, VeterinarianController.findVeterinarianById)
router.get("/veterinarian/find/veterinarian_name", checkVeterinarianToken, VeterinarianController.findVeterinarianByName)
router.get("/veterinarian/find/consultation/today/:veterinarian_id", checkVeterinarianToken, VeterinarianController.findTodayConsultation)
router.get("/veterinarian/find/consultation/all/:veterinarian_id", checkVeterinarianToken, VeterinarianController.findAllConsultations)

router.put("/veterinarian/alter/:veterinarian_id", checkToken, VeterinarianController.alterVeterinarianInfos)

router.delete("/veterinarian/delete/:veterinarian_id", checkToken, VeterinarianController.deleteVeterinarianAccount)

module.exports = router