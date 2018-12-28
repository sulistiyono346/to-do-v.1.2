const User = require("../models/user")
const dcrypt = require("bcryptjs")
const { token } = require("../helpers/token")
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


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
                    user: user, message: "You have been successfully registered, please login first"
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
                            data_token: data_token, name: result.name
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

    glogin: (req, res) => {

        async function verify() {
            const ticket = await client.verifyIdToken({
                idToken: req.body.gtoken,
                audience: process.env.CLIENT_ID
            });

            let payload = ticket.getPayload()
            User.findOne({ email: payload.email })
                .then((result) => {
                    let data = {
                        id: result._id,
                        name: result.name,
                        email: result.email
                    }
                    let data_token = token(data)
                    res.status(200).json({
                        data_token: data_token, name: result.name
                    })
                }).catch((err) => {
                    res.status(400).json({
                        err
                    })
                });


        }
        verify().catch(console.error);
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
            message: "valid user", name: req.decoded.name
        })
    }
}