const router = require("express").Router()
const PetController = require("../controllers/PetsController")

router.post("/pets/new/:user_id", PetController.newPet)
router.get("/pets/all")
router.put("/pets/alter/:user_id/:pet_id")
router.delete("/pets/:pet_id")
router.get("/pets/:pet_id")

module.exports = router