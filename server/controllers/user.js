const User = require("../models/user")
const dcrypt = require("bcryptjs")
const { token } = require("../helpers/token")


module.exports = {
    register: (req, res) => {
        let new_user = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }
        User.create(new_user)
            .then((user) => {
                res.status(200).json({
                    user
                })
            }).catch((err) => {
                res.status(400).json({
                    err
                })
            });
    },
    login: (req, res) => {
        User.findOne({ email: req.body.email })

            .then((result) => {

                if (result) {
                    let dcryptPass = dcrypt.compareSync(req.body.password, result.password)
                    if (dcryptPass) {
                        let data = {
                            id: result._id,
                            name: result.name,
                            email: result.email
                        }
                        let data_token = token(data)
                        res.status(200).json({
                            data_token
                        })

                    }
                    else {
                        res.status(400).json({
                            message: "wrong password please try again "
                        })
                    }

                }
                else {
                    res.status(400).json({
                        message: "wrong email please try again "
                    })
                }

            }).catch((err) => {
                res.status(400).json({
                    err
                })
            });
    },
    findUser: (req, res) => {

        User.findOne({ email: req.params.email })
            .then((result) => {


                res.status(200).json({
                    result
                })
            }).catch((err) => {
                res.status(400).json({
                    err
                })
            });
    },

    isLogin: (req, res) => {
        res.status(200).json({
            message: "valid user"
        })
    }
}