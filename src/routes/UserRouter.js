const router = require("express").Router()
const UserController = require("../controllers/UserController")
const checkToken = require("../utils/checkToken")

router.post("/users/new", UserController.newUser)
router.post("/users/login",UserController.login)

router.put("/users/alter/pass/:user_id", checkToken, UserController.alterPass)
router.put("/users/alter/email/:user_id", checkToken, UserController.alterEmail)

router.delete("/users/delete/account/:user_id", checkToken, UserController.deleteAccount)

router.get("/users/find/:user_id", checkToken, UserController.findUserById)
router.get("/users/findUserByName", checkToken, UserController.findUserByName)
router.get("/users/findAll", checkToken, UserController.findAllUsers)

module.exports = router