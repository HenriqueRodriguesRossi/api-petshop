const router = require("express").Router()

router.post("/consultation/new")

router.get("/consultation/find/:user_id")
router.put("/consultation/alter/:user_id")
router.delete("/consultation/exclude/:user_id")

router.get("/consultation/find/:pet_id")
router.put("/consultation/alter/:pet_id")
router.delete("/consultation/exclude/:pet_id")

module.exports = router