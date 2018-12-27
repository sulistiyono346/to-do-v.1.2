
$(document).ready(
    isLogin()
)

function isLogin() {
    let token = localStorage.getItem("token")
    if (!token) {
        $("#home").hide()
        $("#register").hide()
        $("#navbar").hide()

    }
    else {
        $.ajax({
            type: "GET",
            url: "http://localhost:3000/validate",
            headers: {
                token: token
            }
        })
            .done((result) => {
                $("#register").hide()
                $("#login").hide()
                $("#group").hide()
                $("#valueGroup").hide()
                $("#home").show()
                $("#navbar").show()
                showTask()
            })
            .fail((err) => {
                $("#home").hide()
                $("#register").hide()
                $("#navbar").hide()
                $("#valueGroup").hide()
            })



    }
}

function login(params) {
    $("#register").hide()
    $("#login").show()
}
function register(params) {
    $("#login").hide()
    $("#register").show()

}
function home() {
    $("#register").hide()
    $("#login").hide()
    $("#valueGroup").hide()
    $("#home").show()
    $("#navbar").show()
    showTask()

}
function logout() {
    localStorage.removeItem("token")
    $("#home").hide()
    $("#register").hide()
    $("#navbar").hide()
    $("#login").show()

}
function RegisterProcess() {
    $.ajax({
        type: "POST",
        url: "http://localhost:3000/register",
        data: {
            name: $("#register_name").val(),
            email: $("#register_email").val(),
            password: $("#register_password").val()
        }
    })
        .done((result) => {
            login()
        })
        .fail((err) => {
            register()
        })

}

function LoginProcess() {
    $.ajax({
        type: "POST",
        url: "http://localhost:3000/login",
        data: {
            email: $("#login_email").val(),
            password: $("#login_password").val()

        }
    })
        .done((result) => {
            localStorage.setItem("token", result.data_token)
            home()

        })
        .fail((err) => {

        })
}

function addTask() {
    let token = localStorage.getItem("token")
    $.ajax({
        type: "POST",
        url: "http://localhost:3000/tasks",
        data: {
            title: $("#addTask_title").val(),
            description: $("#addTask_description").val(),
            due_date: $("#addTask_dueDate").val(),
            group_id: $("#group_id").val()
        },
        headers: {
            token: token
        }

    })
        .done((result) => {
            showTask()
            $("#addTask_title").val('')
            $("#addTask_description").val('')
            $("#addTask_dueDate").val('')
            $("#group_id").val('')
        })
        .fail((err) => {

        })
}
function showTask() {
    $("#task").show()
    $("#group").hide()
    $("#valueGroup").hide()
    $("#listTask").html('')
    let token = localStorage.getItem("token")


    $.ajax({
        type: "GET",
        url: "http://localhost:3000/tasks",
        headers: {
            token: token
        }
    })
        .done((tasks) => {
            tasks.task.forEach((task, index) => {
                if (!task.group_id) {
                    $("#listTask").append(`
                    <li class="list-group-item">
                    <div class="row">
                        <div class="col-md-9">
                           ${task.title}
                           <br>
                           <a class="fa fa-pencil-square-o" aria-hidden="true" data-toggle="modal"
                           data-target="#UpdateTaskModal" onclick="showTaskUpdate('${task._id}','${task.title}','${task.description}')" ></a>
                           <a class="fa fa-trash-o" aria-hidden="true"  onclick="deleteTask('${task._id}')" ></a>
                        </div>
                        <div class="col-md-3"  id="${index}">
                        
                   
                        </div>
                    </div>
                </li>
                    `)

                    if (!task.completed) {
                        $(`#${index}`).html("")
                        $(`#${index}`).append(
                            `
                    <button type="button" class="btn btn-outline-success my-2 my-sm-0" data-toggle="modal"
                        data-target="#exampleModalCenter" onclick="taskDetail('${task._id}','${task.title}','${task.description}','${task.due_date}')">
                        detail
                    </button>
                    <button type="button" class="btn btn-outline-success my-2 my-sm-0"  onclick="completTask('${task._id}')">
                        done
                    </button>

                            `
                        )
                    }
                    else {
                        $(`#${index}`).html("")
                        $(`#${index}`).append(
                            `
                    <button type="button" class="btn btn-outline-success my-2 my-sm-0" data-toggle="modal"
                        data-target="#exampleModalCenter" onclick="taskDetail('${task._id}','${task.title}','${task.description}','${task.due_date}')">
                        detail
                    </button>
                    <button type="button" class="btn btn-outline-success my-2 my-sm-0">
                        <strike> done</strike>
                    </button>

                            `
                        )
                    }

                }
            });
            $('#taskCard').html('')
            $('#taskCard').append(`
                <div class="card-body">
                    <h4> ${tasks.task.length}</h4>
                </div>
            `)

        })
        .fail((err) => {
            console.log(err);

        })
}
function taskDetail(id, title, description, due_date) {
    $("#detailTask").html("")
    $("#detailTask").val(id)

    $('#detailTask').append(`
    <h5>title :${title}</h5>
    <h5>Description: ${description}</h5>
    <h5>Due Date :${due_date}</h5>
    `)


}

function showTaskUpdate(id, title, description, ) {
    $("#updateTask_title").val(title)
    $("#updateTask_description").val(description)
    $("#updateTask_id").val(id)
}
function taskUpdate() {
    let token = localStorage.getItem("token")
    $.ajax({
        type: "PUT",
        url: "http://localhost:3000/tasks",
        data: {
            id: $("#updateTask_id").val(),
            title: $("#updateTask_title").val(),
            description: $("#updateTask_description").val(),
            due_date: $("#updateTask_dueDate").val()
        },
        headers: {
            token: token
        }

    })
        .done((data) => {
            showTask()
            $("#updateTask_id").val('')
            $("#updateTask_title").val('')
            $("#updateTask_description").val('')
            $("#updateTask_dueDate").val('')

        })
        .fail((err) => {
            console.log(err);
        })

}
function deleteTask(id) {
    let token = localStorage.getItem("token")
    $.ajax({
        type: "DELETE",
        url: "http://localhost:3000/tasks",
        data: {
            id: id
        },
        headers: {
            token: token
        }

    })
        .done((data) => {
            showTask()
        })
        .fail((err) => {
            console.log(err);
        })
}
function completTask(id) {
    let token = localStorage.getItem("token")
    $.ajax({
        type: "PUT",
        url: "http://localhost:3000/tasks/completed",
        data: {
            id: id
        },
        headers: {
            token: token
        }

    })
        .done((data) => {
            showTask()
        })
        .fail((err) => {
            console.log(err);
        })

}

function showGroup(params) {
    $("#task").hide()
    $("#valueGroup").hide()
    $("#group").show()
    let token = localStorage.getItem("token")
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/groups",
        headers: {
            token: token
        }
    })

        .done((groups) => {
            $("#listGroup").html("")
            groups.result.forEach((group, index) => {
                $("#listGroup").append(`
                <li class="list-group-item">
                <div class="row">
                    <div class="col-md-10">
                       ${group.title}
                       <br>
                       <a class="fa fa-pencil-square-o" aria-hidden="true" data-toggle="modal"
                       data-target="#UpdateGroupModal" onclick="showGroupUpdate('${group._id}','${group.title}','${group.description}')" ></a>
                       <a class="fa fa-trash-o" aria-hidden="true"  onclick="deleteGroup('${group._id}')" ></a>
                    </div>
                    <div class="col-md-2"  id="${index}">
                    <button type="button" class="btn btn-outline-success my-2 my-sm-0"  onclick="groupDetail('${group._id}')">
                        detail
                    </button>
                    </div>
                </div>
            </li>
                `)
            });
        })
        .fail((err) => {
            console.log(err);

        })

}
function createGroup() {
    let token = localStorage.getItem("token")
    $.ajax({
        type: "POST",
        url: "http://localhost:3000/groups",
        data: {
            title: $("#addGroup_title").val(),
            description: $("#addGroup_description").val(),
        },
        headers: {
            token: token
        }
    })
        .done((group) => {
            showGroup()
            $("#addGroup_title").val('')
            $("#addGroup_description").val('')
        })
        .fail(() => {

        })
}


function showGroupUpdate(id, title, description, ) {
    $("#updateGroup_title").val(title)
    $("#updateGroup_description").val(description)
    $("#updateGroup_id").val(id)
}


function updateGroup() {
    let token = localStorage.getItem("token")
    $.ajax({
        type: "PUT",
        url: "http://localhost:3000/groups",
        data: {
            title: $("#updateGroup_title").val(),
            description: $("#updateGroup_description").val(),
            id: $("#updateGroup_id").val()
        },
        headers: {
            token: token
        }
    })
        .done((group) => {
            showGroup()
            $("#updateGroup_title").val('')
            $("#updateGroup_description").val('')
            $("#updateGroup_id").val('')

        })
        .fail(() => {

        })
}
function deleteGroup(id) {
    let token = localStorage.getItem("token")
    $.ajax({
        type: "DELETE",
        url: "http://localhost:3000/groups",
        data: {
            id: id
        },
        headers: {
            token: token
        }
    })
        .done((group) => {
            showGroup()

        })
        .fail(() => {

        })
}
function groupDetail(id) {
    let token = localStorage.getItem("token")
    $.ajax({
        type: "GET",
        url: `http://localhost:3000/groups/${id}`,
        headers: {
            token: token
        }
    })
        .done((group) => {
            // console.log(group.result._id);
            $("#group_id").val(group.result._id)
            $("#task").hide()
            $("#group").hide()
            $("#valueGroup").show()
            $("#listMemberGroup").html("")
            group.result.members.forEach(member => {
                $("#listMemberGroup").append(`
                <li class="list-group-item">
                <hr>
                ${member.name}
                <a class="fa fa-trash-o" aria-hidden="true" style="float:right" onclick="deleteMember('${member._id}')"></a>
                <hr>

            </li>

                    `)
            });
        })
        .fail(() => {

        })


    $.ajax({
        type: "GET",
        url: `http://localhost:3000/tasks/group/${id}`,
        headers: {
            token: token
        }
    })
        .done((result) => {
            $("#listTaskGroup").html("")
            result.task.forEach(list => {
                $("#listTaskGroup").append(`
                    <li class="list-group-item">
                    <a class="fa fa-pencil-square-o" aria-hidden="true" data-toggle="modal"
                    data-target="#UpdateTaskModal" onclick="showTaskUpdate('${list._id}','${list.title}','${list.description}')"></a>
                    <a class="fa fa-table" aria-hidden="true" data-toggle="modal"
                    data-target="#exampleModalCenter"  onclick="taskDetail('${list._id}','${list.title}','${list.description}','${list.due_date}')" ></a>
                    <a class="fa fa-check-square-o" aria-hidden="true" onclick="completTask('${list._id}')"></a>
                    <hr>
                    <div id="titleTaskGroup">
                   
                   
                    </div>
                 
                  
                  
                    <hr>
                    </li>`)

                if (!list.completed) {
                    $('#titleTaskGroup').append(` 
                    <h6>
                    ${list.title}
                    <a class="fa fa-trash-o" aria-hidden="true" style="float:right" onclick="deleteTask('${list._id}')"></a>
                    </h6>
                   
                    `)
                }
                else {
                    $('#titleTaskGroup').append(` 
                    <h6>
                    <strike> ${list.title}</strike>
                    <a class="fa fa-trash-o" aria-hidden="true" style="float:right" onclick="deleteTask('${list._id}')"></a>
                    </h6>
                   
                    `)
                }

            })
        })
        .fail((err) => {
            console.log(err);

        })

}
function searchUser() {
    let token = localStorage.getItem("token")
    $.ajax({
        type: "GET",
        url: `http://localhost:3000/users/${$("#member_email").val()}`,
        headers: {
            token: token
        }
    })
        .done((result) => {
            $("#listAddMember").append(`
            <li class="list-group-item">
            <hr>
           ${result.result.name}
            <a class="fa fa-plus" aria-hidden="true" style="float:right" onclick="addMember('${result.result._id}')"> add</a>
            <hr>
        </li>
            `)


        })
        .fail((err) => {
            console.log(err);
        })

}

function addMember(id) {
    let token = localStorage.getItem("token")

    $.ajax({
        type: "PUT",
        url: `http://localhost:3000/groups/member/${$("#group_id").val()}`,
        data: {
            id: id
        },
        headers: {
            token: token
        }
    })
        .done(() => {
            groupDetail($("#group_id").val())
        })
        .fail(() => {

        })
}
function deleteMember(id) {
    let token = localStorage.getItem("token")
    $.ajax({
        type: "PUT",
        url: `http://localhost:3000/groups/remove/${$("#group_id").val()}`,
        data: {
            id: id
        },
        headers: {
            token: token
        }
    })
        .done(() => {
            groupDetail($("#group_id").val())
        })
        .fail(() => {

        })
}


