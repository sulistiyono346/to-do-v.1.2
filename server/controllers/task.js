const Task = require("../models/task")

module.exports = {
    createTask: (req, res) => {
        let newTask = {
            title: req.body.title,
            description: req.body.description,
            createdAt: Date.now(),
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            due_date: req.body.due_date,
            completed: false,
            user_id: req.decoded.id,

        }
        if (req.body.group_id) {

            newTask.group_id = req.body.group_id
        }

        Task.create(newTask)
            .then((result) => {
                res.status(200).json({
                    result: result, message: "You have been successfully add new task"
                })

            }).catch((err) => {
                res.status(400).json({
                    err
                })
            });
    },
    getTask: (req, res) => {
        Task.find({ user_id: req.decoded.id })
            .populate('user_id')
            .populate('group_id')
            .then((task) => {
                res.status(200).json({
                    task
                })

            }).catch((err) => {

                res.status(400).json({
                    err
                })
            });
    },
    updateTask: (req, res) => {

        let updateTask = {
            title: req.body.title,
            description: req.body.description,
            due_date: req.body.due_date,
        }
        Task.updateOne({ _id: req.body.id }, updateTask)
            .then((result) => {
                res.status(200).json({
                    result: result, message: "You have been successfully update new task"
                })

            }).catch((err) => {
                res.status(400).json({
                    err
                })
            });
    },
    deleteTask: (req, res) => {
        Task.deleteOne({ _id: req.body.id })
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
    completedTask: (req, res) => {
        Task.updateOne(
            {
                _id: req.body.id
            },
            {
                completed: true
            })
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
    getTaskGroup: (req, res) => {
        Task.find({ group_id: req.params.id })
            .populate('user_id')
            .populate('group_id')
            .then((task) => {
                res.status(200).json({
                    task
                })

            }).catch((err) => {

                res.status(400).json({
                    err
                })
            });
    },
}