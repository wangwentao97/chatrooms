let chatBox;

window.addEventListener('load', function () {

    //Open and connect socket
    let socket = io('/private');
    //Listen for confirmation of connection
    socket.on('connect', function () {
        console.log("Connected");
    });

    //let room = window.prompt('create or join a room');

    //send roomName msg to server
    socket.emit('getRoom');

    /* --- Code to RECEIVE a socket message from the server --- */
    chatBox = document.getElementById('chat-box-msgs');

    socket.on('joined', function(data){
        addMsgToPage(data);
    });

    //receive room data and change room settings
    let roomSetting;
    socket.on('roomData', function(data){
        let roomName = document.getElementById('room-name');
        let roomInfo = document.getElementById('room-des');
        roomSetting = data;
        roomName.innerHTML = roomSetting.room;
        roomInfo.innerHTML = roomSetting.info;
        document.body.style.background = roomSetting.color;
        //console.log(data);
    });

    //Listen for messages named 'msg' from the server
    socket.on('msg', function (data) {
        console.log("Message arrived!");
        console.log(data);

        addMsgToPage(data);
    });

    /* --- Code to SEND a socket message to the Server --- */
    //let nameInput = document.getElementById('name-input');
    let msgInput = document.getElementById('msg-input');
    let sendButton = document.getElementById('send-button');

    sendButton.addEventListener('click', function () {
        let curName = roomSetting.name;
        let curMsg = msgInput.value;
        let msgObj = { "name": curName, "msg": curMsg };
 
        //Send the message object to the server
        socket.emit('msg', msgObj);
    });
});

function addMsgToPage(obj){
    //Create a message string and page element
    let receivedMsg = obj.name + ": " + obj.msg;
    let msgEl = document.createElement('p');
    msgEl.innerHTML = receivedMsg;

    //Add the element with the message to the page
    chatBox.appendChild(msgEl);
    //Add a bit of auto scroll for the chat box
    chatBox.scrollTop = chatBox.scrollHeight;
}