const Group = require("../models/group")

module.exports = {
    createGroup: (req, res) => {
        let newGroup = {
            title: req.body.title,
            description: req.body.description,
            members: []
        }
        newGroup.members.push(req.decoded.id)
        Group.create(newGroup)
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
    getGroup: (req, res) => {

        Group.find({})
            .populate("members")
            .then((groups) => {
                let result = []
                for (let i = 0; i < groups.length; i++) {
                    for (let j = 0; j < groups[i].members.length; j++) {
                        if (String(groups[i].members[j]._id) == String(req.decoded.id)) {
                            result.push(groups[i])
                        }
                    }
                }

                res.status(200).json({
                    result
                })
            }).catch((err) => {
                res.status(400).json({
                    err
                })
            });
    },
    updateGroup: (req, res) => {
        let groupUpdate = {
            title: req.body.title,
            description: req.body.description
        }
        Group.updateOne({ _id: req.body.id }, groupUpdate)
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
    deleteGroup: (req, res) => {
        Group.deleteOne({ _id: req.body.id })
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
    detailGroup: (req, res) => {
        Group.findOne({ _id: req.params.id })
            .populate('members')
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
    addMember: (req, res) => {

        Group.findOne({ _id: req.params.id })
            .then((result) => {
                result.members.push(req.body.id)
                Group.updateOne({ _id: result._id }, result)
                    .then((result) => {
                        res.status(200).json({
                            result
                        })
                    }).catch((err) => {
                        res.status(400).json({
                            err
                        })
                    });
            }).catch((err) => {
                res.status(400).json({
                    err
                })
            });
    },
    deleteMember: (req, res) => {

        Group.findOne({ _id: req.params.id })
            .then((result) => {
                var index = result.members.findIndex(n => {
                    return n == req.body.id;
                });
                console.log(index);

                if (index !== -1) {
                    result.members.splice(index, 1)
                    console.log(result);

                    Group.updateOne({ _id: result._id }, result)
                        .then((result) => {
                            res.status(200).json({
                                result
                            })
                        }).catch((err) => {
                            res.status(400).json({
                                err
                            })
                        });
                }

            }).catch((err) => {
                res.status(400).json({
                    err
                })
            });
    }
}