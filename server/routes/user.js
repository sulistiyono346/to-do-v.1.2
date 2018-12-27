var express = require('express');
var router = express.Router();
var userController = require("../controllers/user")
var { isLogin } = require("../middleware/validation")

/* GET users listing. */
router.get("/:email", isLogin, userController.findUser)



module.exports = router;
