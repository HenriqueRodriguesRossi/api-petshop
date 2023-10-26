const router = require("express").Router()

router.post("/veterinarian/new")

router.get("/veterinarian/find/all")
router.get("/veterinarian/find/:veterinarian_id")
router.get("/veterinarian/find/name")
router.get("/veterinarian/find/consultation/today")
router.get("/veterinarian/find/consultation/all")

router.put("/veterinarian/alter/:veterinarian_id")

module.exports = router