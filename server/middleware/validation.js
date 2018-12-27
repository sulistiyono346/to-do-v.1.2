const User = require("../models/user")
const { verifyToken } = require('../helpers/token')

module.exports = {
    isLogin: (req, res, next) => {
        verifyToken(req.headers.token, function (err, decoded) {
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
                            email: result.email
                        }
                        next()

                    }).catch((err) => {
                        res.status(400).json({
                            message: "forbidden access to this resource on the server is denied"
                        })
                    });
            }
        })
    }
}

