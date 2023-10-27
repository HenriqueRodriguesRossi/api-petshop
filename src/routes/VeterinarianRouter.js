const router = require("express").Router()
const checkVeterinarianToken = require("../utils/checkVeterinarianToken")
const VeterinarianController = require("../controllers/VeterinarianController")

router.post("/veterinarian/new", VeterinarianController.newVeterinarian)
router.post("/veterinarian/login", VeterinarianController.veterinarianLogin)

router.get("/veterinarian/find/all", VeterinarianController.findAll)
router.get("/veterinarian/find/:veterinarian_id", VeterinarianController.findVeterinarianById)
router.get("/veterinarian/findByName", VeterinarianController.findVeterinarianByName)
router.get("/veterinarian/find/consultation/all/:veterinarian_id", checkVeterinarianToken, VeterinarianController.findAllConsultations)

router.put("/veterinarian/alter/email/:veterinarian_id", checkVeterinarianToken, VeterinarianController.alterVeterinarianEmail)
router.put("/veterinarian/alter/pass/:veterinarian_id", checkVeterinarianToken, VeterinarianController.alterVeterinarianPass)

router.delete("/veterinarian/delete/:veterinarian_id", checkVeterinarianToken, VeterinarianController.deleteVeterinarianAccount)

module.exports = router