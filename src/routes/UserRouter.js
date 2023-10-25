const router = require("express").Router()
const UserController = require("../controllers/UserControllers")

router.post("/users/new", UserController.newUser)
router.post("/users/login",UserController.login)

module.exports = router