var socket = io();

socket.on("welcome", function (data) {
  console.log("welcome");
  var div = document.getElementById("welcome");
  div.innerHTML += "<h3>" + data + "</h3><br>";
});
