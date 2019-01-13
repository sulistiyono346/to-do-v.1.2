const User = require("../models/user")
const { dcrypt } = require("../helpers/encrypt")
const { create_token } = require("../helpers/token")
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


module.exports = {
    register: (req, res) => {
        let new_user = {
            name: req.body.name,
            email: req.body.email,
            img: "https://profile.actionsprout.com/default.jpeg",
            register_by: "own_app",
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
                    let dcryptPass = dcrypt(req.body.password, result.password)
                    if (dcryptPass) {
                        let data = {
                            id: result._id,
                            name: result.name,
                            email: result.email
                        }
                        let data_token = create_token(data)
                        res.status(200).json({
                            data_token: data_token, name: result.name, img: result.img
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
                    if (result) {
                        let data = {
                            id: result._id,
                            name: result.name,
                            email: result.email
                        }

                        let data_token = create_token(data)


                        res.status(200).json({
                            data_token: data_token, name: result.name, img: result.img
                        })
                    }
                    else {
                        let name = payload.given_name + " " + payload.family_name
                        let new_user = {
                            name: name,
                            email: payload.email,
                            img: payload.picture,
                            register_by: "google_app",
                            password: process.env.G_PASSWORD
                        }
                        User.create(new_user)
                            .then((result) => {
                                let data_token = create_token(result)
                                res.status(200).json({
                                    data_token: data_token, name: result.name, img: result.img
                                })

                            })

                    }

                }).
                catch((err) => {
                    res.status(400).json(err)
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
            message: "valid user", name: req.decoded.name, img: req.decoded.img
        })
    }
}