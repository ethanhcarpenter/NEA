const div = document.createElement("div");
div.style.width = "50px";
div.style.position = "absolute";
div.style.top = "100px";
div.style.height = "50px";
div.style.backgroundColor = "blue";
div.textContent = "";
const apDiv = document.getElementById("1");
apDiv.appendChild(div);
