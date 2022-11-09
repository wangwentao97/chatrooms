window.addEventListener('load', function () {
    let socket = io('/start');

    let name = document.getElementById('name-input');
    let room = document.getElementById('room-name-input');
    let roomInfo = document.getElementById('info-input');
    let color = document.getElementById('color-input');
    let createButton = document.getElementById('create-button');

    createButton.addEventListener('click', function () {

        let nameInput = name.value;
        let roomInput = room.value;
        let roomInfoInput = roomInfo.value;
        let colorInput = color.value;

        let dataObj = { "name": nameInput, "room": roomInput, "info": roomInfoInput, "color": colorInput};
        socket.emit('roomData', dataObj);
        window.open("/private");
    });
});