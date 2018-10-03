// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

var status = document.getElementById("status");
var connect = document.getElementById("connect");
var disconnect = document.getElementById("disconnect");
var wstext = document.getElementById("wstext");
var wxjson = document.getElementById("wsjson");

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

document.getElementById("purge").addEventListener("click", function () {

    var table = document.getElementById("historyTable");

    var rowCount = table.rows.length;
    while (--rowCount)
        table.deleteRow(rowCount);
});

function InitializeWebSocket() {
    if (wsEndpoint.value === null || wsEndpoint.value === "") {
        alert('Please provide web socket endpoint');
        return false;
    }

    var protocols = new Array();
    if (wstext.checked)
        protocols.push("ws.text");
    if (wsjson.checked)
        protocols.push("ws.json");

    socket = protocols.length == 0 ? new WebSocket(wsEndpoint.value.trim()) : new WebSocket(wsEndpoint.value.trim(), protocols);

    socket.onopen = function () {
        UpdateControls(true);
    };

    socket.onclose = function () {
        UpdateControls(false);
    };

    socket.onmessage = function (message) {
        var msg;
        if (socket.protocol == "ws.json") {
            var obj = JSON.parse(message.data);
            msg = "'" + obj.message + "'" + ' issued at ' + obj.timestamp;
        }
        else
            msg = message.data;

        updateTable(msg, false);
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
        wstext.disabled = true;
        wsjson.disabled = true;
    }
    else {
        document.getElementById("status").classList.remove("alert-success");
        document.getElementById("status").innerHTML = "Disconnected!";
        document.getElementById("status").classList.add("alert-danger");
        connect.disabled = false;
        disconnect.disabled = true;
        wstext.disabled = false;
        wsjson.disabled = false;
    }
}
