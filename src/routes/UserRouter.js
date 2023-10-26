const router = require("express").Router()
const UserController = require("../controllers/UserController")
const checkToken = require("../utils/checkToken")

router.post("/users/new", UserController.newUser)
router.post("/users/login",UserController.login)

router.delete("/users/delete/account/:user_id", checkToken, )

module.exports = router