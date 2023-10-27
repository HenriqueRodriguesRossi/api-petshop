const router = require("express").Router()
const PetController = require("../controllers/PetController")
const checkToken = require("../utils/checkToken")

router.post("/pets/new/:id", checkToken,  PetController.newPet)

router.get("/pets/find/all", checkToken,PetController.findAll)
router.get("/pets/find/race", checkToken, PetController.findRace)
router.get("/pets/find/specie", checkToken, PetController.findSpecie)
router.get("/pets/:pet_id", checkToken, PetController.findPetById)
router.get("/pets/find/:user_id", checkToken, PetController.findPetByUser)

router.put("/pets/alter/:user_id/:pet_id", checkToken, PetController.alterPet)

router.delete("/pets/delete/:user_id/:pet_id", checkToken, PetController.deletePet)

module.exports = router