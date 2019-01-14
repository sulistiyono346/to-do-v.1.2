var express = require("express")
var router = express.Router()
var GroupController = require("../controllers/group")
var { isLogin } = require("../middleware/validation")
var { groupMember } = require("../middleware/validation")


router.post("/", isLogin, GroupController.createGroup)
router.get("/", isLogin, GroupController.getGroup)
router.put("/", isLogin, groupMember, GroupController.updateGroup)
router.delete("/", isLogin, groupMember, GroupController.deleteGroup)
router.get("/:id", GroupController.detailGroup)
router.put("/member/:id", isLogin, GroupController.addMember)
router.put('/remove/:id', isLogin, GroupController.deleteMember)


module.exports = router