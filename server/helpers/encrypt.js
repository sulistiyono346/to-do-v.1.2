const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(10)


module.exports = {
    encrypt: (params) => {
        return bcrypt.hashSync(params, salt)
    },
    dcrypt: (params, params1) => {
        return bcrypt.compareSync(params, params1)
    }
}
