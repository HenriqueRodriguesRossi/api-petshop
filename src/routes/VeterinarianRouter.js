const router = require("express").Router()
const checkToken = require("../utils/checkToken")
const VeterinarianController = require("../controllers/VeterinarianController")

router.post("/veterinarian/new", VeterinarianController.newVeterinarian)

router.get("/veterinarian/find/all", checkToken, VeterinarianController.findAll)
router.get("/veterinarian/find/:veterinarian_id", checkToken, VeterinarianController.findVeterinarianById)
router.get("/veterinarian/find/veterinarian_name", checkToken, VeterinarianController.findVeterinarianByName)
router.get("/veterinarian/find/consultation/today/:veterinarian_id", checkToken, VeterinarianController.findTodayConsultation)
router.get("/veterinarian/find/consultation/all/:veterinarian_id", checkToken, )

router.put("/veterinarian/alter/:veterinarian_id", checkToken, )

router.delete("/veterinarian/delete/:veterinarian_id", checkToken, )

module.exports = router