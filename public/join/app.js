let socket = io('/join');

window.addEventListener('load', function () {

    let name = document.getElementById('name-input');
    let room = document.getElementById('room-name-input');
    let createButton = document.getElementById('create-button');
    let showButton = document.getElementById('show-button');

    createButton.addEventListener('click', function () {
        let nameInput = name.value;
        let roomInput = room.value;
        let dataObj = { "name": nameInput, "room": roomInput};

        //send join username and room name to the server
        socket.emit('roomData', dataObj);
    });

    showButton.addEventListener('click', function () {
        socket.emit('getUsers');
    });
});

//receive result from server
socket.on('result', function (data) {
    if (data.msg == "true"){
        window.open("/private");
    } else if (data.msg == "false"){
        window.alert("Room Not Found!");
    }
});   

socket.on('allUsers', function (data) {
    //console.log(data[0]);
    document.getElementById('all-rooms').innerHTML = '';
    for(let i = 0; i < data.length; i++) {
        let string1 = "Room Name: " + data[i].room;
        let string2 = "Description: " + data[i].info;
        let elt1 = document.createElement('p');
        let elt2 = document.createElement('p');
        elt1.innerHTML = string1;
        elt2.innerHTML = string2;
        document.getElementById('all-rooms').appendChild(elt1);
        document.getElementById('all-rooms').appendChild(elt2);
    }
})
