var express = require('express');
var router = express.Router();
var userController = require("../controllers/user")
var { isLogin } = require("../middleware/validation")

/* GET users listing. */
router.get("/", (req, res) => {
  res.status(200).json({
    message: "Status connect server"
  })
})
router.get("/validate", isLogin, userController.isLogin)
router.post("/register", userController.register)
router.post("/login", userController.login)


module.exports = router;
