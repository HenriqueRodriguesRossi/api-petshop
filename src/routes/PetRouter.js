const router = require("express").Router()
const PetController = require("../controllers/PetsController")

router.post("/pets/new/:user_id", PetController.newPet)

router.get("/pets/find/all", PetController.findAll)
router.get("/pets/find/race", PetController.findRice)
router.get("/pets/find/specie", PetController.findSpecie)
router.get("/pets/:pet_id", PetController.findPetById)
router.get("/pets/find/:user_id", PetController.findPetByUser)

router.put("/pets/alter/:user_id/:pet_id", PetController.alterPet)

router.delete("/pets/delete/:user_id/:pet_id", PetController.deletePet)

module.exports = router