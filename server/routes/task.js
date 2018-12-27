var express = require("express")
var router = express.Router()
var TaskController = require("../controllers/task")
var { isLogin } = require("../middleware/validation")


router.post("/", isLogin, TaskController.createTask)
router.get("/", isLogin, TaskController.getTask)
router.put("/", isLogin, TaskController.updateTask)
router.put("/completed", isLogin, TaskController.completedTask)
router.delete("/", isLogin, TaskController.deleteTask)
router.get("/group/:id", isLogin, TaskController.getTaskGroup)



module.exports = router