// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

var status = document.getElementById("status");
var connect = document.getElementById("connect");
var disconnect = document.getElementById("disconnect");

var wsEndpoint = document.getElementById("wsEndpoint");
var scheme = document.location.protocol == "https:" ? "wss" : "ws";
var port = document.location.port ? (":" + document.location.port) : "";
wsEndpoint.value = scheme + "://" + document.location.hostname + port + "/ws";

UpdateControls(false);

var socket;

document.getElementById("disconnect").addEventListener("click", function () {

    if (!socket || socket.readyState != WebSocket.OPEN) {
        alert("socket not connected");
        return;
    }

    socket.close(1000, "Closing by clinet");
    UpdateControls(false);
});


document.getElementById("connect").addEventListener("click", function () {
    if (InitializeWebSocket())
        UpdateControls(true);
});

document.getElementById("send").addEventListener("click", function () {
    var msg = document.getElementById("message").value;

    if (!msg || msg == "") {
        alert('Please enter your message');
        return;
    }

    if (!socket || socket.readyState != WebSocket.OPEN) {
        alert('Socker not connected');
        return;
    }

    socket.send(msg);
    updateTable(msg, true);
});

function InitializeWebSocket() {
    if (wsEndpoint.value === null || wsEndpoint.value === "") {
        alert('Please provide web socket endpoint');
        return false;
    }

    socket = new WebSocket(wsEndpoint.value.trim());

    socket.onopen = function () {
        UpdateControls(true);
    };

    socket.onclose = function () {
        UpdateControls(false);
    };

    socket.onmessage = function (evt) {
        updateTable(evt.data, false);
    };

    return true;
}

function updateTable(message, isRequest) {

    var date = new Date();

    var messages = document.getElementById("messages");
    var sender = isRequest ? 'client' : 'server';
    var receiver = isRequest ? 'server' : 'client';

    messages.innerHTML += '<tr>' +
        '<td>' + sender + '</td>' +
        '<td>' + receiver + '</td>' +
        '<td>' + message + '</td>' +
        '<td>' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '</td>' + '</tr>';
}

function UpdateControls(connected) {

    if (connected) {
        document.getElementById("status").classList.remove("alert-danger");
        document.getElementById("status").innerHTML = "Connected!";
        document.getElementById("status").classList.add("alert-success");
        connect.disabled = true;
        disconnect.disabled = false;
    }
    else {
        document.getElementById("status").classList.remove("alert-success");
        document.getElementById("status").innerHTML = "Disconnected!";
        document.getElementById("status").classList.add("alert-danger");
        connect.disabled = false;
        disconnect.disabled = true;
    }
}
