const mongoose = require("mongoose")
const Schema = mongoose.Schema

const TaskSchema = new Schema({
    title: {
        type: String,
        required: [true, "title can't be blank"]
    },
    description: {
        type: String,
        required: [true, "description can't be blank"]
    },
    due_date: {
        type: Date
    },
    latitude: {
        type: Number
    },
    longitude: {
        type: Number
    },
    createdAt: {
        type: Number
    },
    completed: {
        type: Boolean, default: false
    },
    group_id: {
        type: Schema.Types.ObjectId, ref: "Group"
    },
    user_id: {
        type: Schema.Types.ObjectId, ref: "User"
    }
})
const Task = mongoose.model('Task', TaskSchema)
module.exports = Task