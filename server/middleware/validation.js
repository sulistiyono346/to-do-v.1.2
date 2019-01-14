const User = require("../models/user")
const Group = require("../models/group")
const Task = require("../models/task")
const { verify_token } = require('../helpers/token')


module.exports = {
    isLogin: (req, res, next) => {
        verify_token(req.headers.token, function (err, decoded) {
            if (err) {
                res.status(400).json({
                    message: "forbidden access to this resource on the server is denied"
                })
            }
            else {
                User.findOne({ email: decoded.email })
                    .then((result) => {
                        req.decoded = {
                            id: result._id,
                            name: result.name,
                            email: result.email,
                            img: result.img
                        }
                        next()

                    }).catch((err) => {
                        res.status(400).json({
                            message: "forbidden access to this resource on the server is denied"
                        })
                    });
            }
        })
    },
    groupMember: (req, res, next) => {
        Group.findById(req.body.id)
            .then((result) => {

                let isMember = false
                result.members.forEach(member => {
                    if (String(member) === String(req.decoded.id)) {
                        isMember = true
                    }
                });

                if (!isMember) {
                    res.status(400).json({
                        message: 'you are not member of this project'
                    })
                } else {
                    req.decoded = req.decoded
                    next()
                }
            })
            .catch(err => {
                res.status(400).json({
                    err
                })
            })
    },
    taskOwn: (req, res, next) => {

        Task.findById(req.body.id)
            .then((result) => {
                if (String(result.user_id) === String(req.decoded.id)) {
                    req.decoded = req.decoded
                    next()
                }
                else {
                    res.status(400).json({
                        message: 'this is not your task'
                    })
                }
            }).catch((err) => {
                res.status(400).json({
                    err
                })
            });

    }
}
