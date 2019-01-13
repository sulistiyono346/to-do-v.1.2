
$(document).ready(
    isLogin()
)


function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    $.ajax({
        type: "POST",
        url: "http://localhost:3000/glogin",
        data: {
            gtoken: id_token
        }
    })
        .done((result) => {
            $("#image_profile").html("")

            localStorage.setItem("token", result.data_token)
            $("#personalName").html("")
            $("#personalName").append(`
             <h5 class="card-title">${result.name}</h5>
             `)
            $("#image_profile").append(`
                <img class="card-img-top" src="${result.img}"
                alt="Card image cap" ">
                ` )
            home()


        })
        .fail((err) => {
            console.log(err);
        })


}

function isLogin() {
    $("#image_profile").html("")
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
                console.log(result);

                $("#image_profile").append(`
                <img class="card-img-top" src="${result.img}"
                alt="Card image cap" >
                ` )

                $("#personalName").html("")
                $("#personalName").append(`
                <h5 class="card-title">${result.name}</h5>
                `)
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
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log("User signed out.");
    });
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
            $("#register_name").val("")
            $("#register_email").val("")
            $("#register_password").val("")

            $("#error_register").html("")
            $("#error_register").append(`
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                ${result.message}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                </div>

                `
            )
        })
        .fail((err) => {

            if (err.responseJSON.err.errors.email) {
                $("#error_register").html("")
                $("#error_register").append(`
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                ${err.responseJSON.err.errors.email.message}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                </div>
    
    
                `
                )
            }
            if (err.responseJSON.err.errors.password) {
                $("#error_register").html("")
                $("#error_register").append(`
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                ${err.responseJSON.err.errors.password.message}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                </div>
    
    
                `
                )
            }
            if (err.responseJSON.err.errors.name) {
                $("#error_register").html("")
                $("#error_register").append(`
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                ${err.responseJSON.err.errors.name.message}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                </div>
    
    
                `
                )
            }



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
            $("#image_profile").html("")
            localStorage.setItem("token", result.data_token)
            $("#personalName").html("")
            $("#personalName").append(`
            <h5 class="card-title">${result.name}</h5>
            `)
            $("#image_profile").append(`
            <img class="card-img-top" src="${result.img}"
            alt="Card image cap" style="margin-top:10px;">
            ` )
            home()

        })
        .fail((err) => {
            console.log(err.responseJSON.message);
            $("#error_login").html("")
            $("#error_login").append(`

            <div class="alert alert-danger alert-dismissible fade show" role="alert">
            ${err.responseJSON.message}
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            </div>


            `
            )
        })
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(addTask);
    }
}



function addTask(position) {


    let token = localStorage.getItem("token")

    $.ajax({
        type: "POST",
        url: "http://localhost:3000/tasks",
        data: {
            title: $("#addTask_title").val(),
            description: $("#addTask_description").val(),
            due_date: $("#addTask_dueDate").val(),
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            group_id: $("#group_id").val()
        },
        headers: {
            token: token
        }

    })
        .done((result) => {
            if ($("#group_id").val()) {
                groupDetail($("#group_id").val())
                $("#addTask_title").val('')
                $("#addTask_description").val('')
                $("#addTask_dueDate").val('')
                $("#group_id").val('')

                $("#task_register_message").html("")
                $("#task_register_message").append(`
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                    ${result.message}
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    </div>
    
                    `
                )

            }
            else {
                showTask()
                $("#addTask_title").val('')
                $("#addTask_description").val('')
                $("#addTask_dueDate").val('')
                $("#group_id").val('')

                $("#task_register_message").html("")
                $("#task_register_message").append(`
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                    ${result.message}
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    </div>
    
                    `
                )
            }
        })
        .fail((err) => {
            $("#task_register_message").html("")
            $("#task_register_message").append(`
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                Due Date Cannot Before the Current Date, please try again !
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                </div>

                `
            )
        })
}
function showTask() {

    $("#group_id").val('')
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
            let taskCardCount = 0
            let taskGroupCount = 0

            tasks.task.forEach((task, index) => {
                if (!task.group_id && task.completed === false) {
                    taskCardCount += 1
                }
                if (task.group_id && task.completed === false) {
                    taskGroupCount++
                }

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
                        data-target="#exampleModalCenter" onclick="taskDetail('${task._id}','${task.title}','${task.description}','${task.due_date}','${task.latitude}','${task.longitude}')">
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
                        data-target="#exampleModalCenter" onclick="taskDetail('${task._id}','${task.title}','${task.description}','${task.due_date}','${task.latitude}','${task.longitude}')">
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
                    <h4> ${taskCardCount}</h4>
                </div>
            `)
            $('#groupCard').html('')
            $('#groupCard').append(`
                <div class="card-body">
                    <h4> ${taskGroupCount}</h4>
                </div>
            `)
        })
        .fail((err) => {
            console.log(err);

        })
}
function taskDetail(id, title, description, due_date, latitude, longitude) {

    var uluru = { lat: Number(latitude), lng: Number(longitude) };

    $("#detailTask").html("")
    $("#detailTask").val(id)

    $('#detailTask').append(`
    <h5>${title}</h5>
    <p>${description}</p>
    <h6>Due Date :${due_date.slice(0, 10)}</h6>
    <div>
    <div id="map" style="padding:10px; height: 300px; width:100%;">
    </div>
    </div>
    `)

    console.log(uluru);
    var map = new google.maps.Map(
        document.getElementById('map'), { zoom: 12, center: uluru });
    var marker = new google.maps.Marker({ position: uluru, map: map });
    var geocoder = new google.maps.Geocoder;
    var infowindow = new google.maps.InfoWindow;
    geocodeLatLng(geocoder, map, infowindow, uluru);
}

function geocodeLatLng(geocoder, map, infowindow, latlng) {
    geocoder.geocode({ 'location': latlng }, function (results, status) {
        if (status === 'OK') {
            if (results[0]) {
                map.setZoom(11);
                var marker = new google.maps.Marker({
                    position: latlng,
                    map: map
                });
                infowindow.setContent(results[0].formatted_address);
                infowindow.open(map, marker);
            } else {
                window.alert('No results found');
            }
        } else {
            window.alert('Geocoder failed due to: ' + status);
        }
    });
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
        .done((result) => {
            if ($("#group_id").val()) {
                groupDetail($("#group_id").val())
                $("#updateTask_id").val('')
                $("#updateTask_title").val('')
                $("#updateTask_description").val('')
                $("#updateTask_dueDate").val('')


                $("#task_update_message").html("")
                $("#task_update_message").append(`
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                    ${result.message}
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    </div>
    
                    `
                )

            }
            else {
                showTask()
                $("#updateTask_id").val('')
                $("#updateTask_title").val('')
                $("#updateTask_description").val('')
                $("#updateTask_dueDate").val('')

                $("#task_update_message").html("")
                $("#task_update_message").append(`
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                    ${result.message}
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    </div>
    
                    `
                )

            }
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
            if ($("#group_id").val()) {
                groupDetail($("#group_id").val())
            }
            else {
                showTask()
            }
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
            if ($("#group_id").val()) {
                groupDetail($("#group_id").val())
            }
            else {
                showTask()
            }

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
            result.task.forEach((list, index) => {


                $("#listTaskGroup").append(`
                    <li class="list-group-item">
                    <a class="fa fa-pencil-square-o" aria-hidden="true" data-toggle="modal"
                    data-target="#UpdateTaskModal" onclick="showTaskUpdate('${list._id}','${list.title}','${list.description}')"></a>
                    <a class="fa fa-table" aria-hidden="true" data-toggle="modal"
                    data-target="#exampleModalCenter"  onclick="taskDetail('${list._id}','${list.title}','${list.description}','${list.due_date}','${list.latitude}','${list.longitude}')" ></a>
                    <a class="fa fa-check-square-o" aria-hidden="true" onclick="completTask('${list._id}')"></a>
                    <hr>
                    <div id="${index}Task">
                   
                   
                    </div>
                    <hr>
                    </li>`)

                if (!list.completed) {
                    $(`#${index}Task`).html("")
                    $(`#${index}Task`).append(`

                    <h6>
                    ${list.title}
                    <a class="fa fa-trash-o" aria-hidden="true" style="float:right" onclick="deleteTask('${list._id}')"></a>
                    </h6>
                   
                    `)
                }
                else {
                    $(`#${index}Task`).html("")
                    $(`#${index}Task`).append(` 
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

    $.ajax({
        type: "GET",
        url: "http://localhost:3000/tasks",
        headers: {
            token: token
        }
    })
        .done((tasks) => {
            let taskCardCount = 0
            let taskGroupCount = 0
            tasks.task.forEach((task, index) => {
                if (!task.group_id && task.completed === false) {
                    taskCardCount += 1
                }
                if (task.group_id && task.completed === false) {
                    taskGroupCount++
                }
            });

            $('#taskCard').html('')
            $('#taskCard').append(`
                <div class="card-body">
                    <h4> ${taskCardCount}</h4>
                </div>
            `)
            $('#groupCard').html('')
            $('#groupCard').append(`
                <div class="card-body">
                    <h4> ${taskGroupCount}</h4>
                </div>
            `)
        })
        .fail(() => {

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
            $("#member_email").val("")
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
            $("#listAddMember").html("")
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
        .done((result) => {
            if (result.message) {
                $("#member_list_message").html("")
                $("#member_list_message").append(`
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                ${result.message}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                </div>

                `
                )
            }
            else {
                $("#member_list_message").html("")
                $("#member_list_message").append(`
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                You have successfully removed
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                </div>

                `
                )
            }

            groupDetail($("#group_id").val())
        })
        .fail(() => {

        })
}


