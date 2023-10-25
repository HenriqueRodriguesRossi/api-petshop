const router = require("express").Router()
const checkToken = require("../utils/checkToken")

router.post("/consultation/new", checkToken, )

router.get("/consultation/find/:user_id", checkToken, )
router.put("/consultation/alter/:user_id", checkToken, )
router.delete("/consultation/exclude/:user_id", checkToken, )

router.get("/consultation/find/:pet_id")
router.put("/consultation/alter/:pet_id")
router.delete("/consultation/exclude/:pet_id")

module.exports = router