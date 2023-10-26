const router = require("express").Router()
const checkToken = require("../utils/checkToken")

router.post("/veterinarian/new")

router.get("/veterinarian/find/all", checkToken)
router.get("/veterinarian/find/:veterinarian_id", checkToken, )
router.get("/veterinarian/find/veterinarian_name", checkToken, )
router.get("/veterinarian/find/consultation/today", checkToken, )
router.get("/veterinarian/find/consultation/all", checkToken)
router.get("/users/find/all/:veterinarian_id", checkToken, )

router.put("/veterinarian/alter/:veterinarian_id", checkToken, )

module.exports = router