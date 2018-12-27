const mongoose = require('mongoose')
const Schema = mongoose.Schema

const GroupSchema = new Schema({
    title: {
        type: String,
        require: [true, "title can' be blank"]
    },
    description: {
        type: String,
        required: [true, "description can't be blank"]
    },
    members: [{
        type: Schema.Types.ObjectId, ref: 'User'
    }]
})
const Group = mongoose.model("Group", GroupSchema)
module.exports = Group