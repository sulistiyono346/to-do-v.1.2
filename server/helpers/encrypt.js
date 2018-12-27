const encrypt = require('bcryptjs')
const salt = encrypt.genSaltSync(10)


function encryptPass(params) {
    return encrypt.hashSync(params, salt)
}
module.exports = encryptPass