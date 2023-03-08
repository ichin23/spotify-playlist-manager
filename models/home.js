import { SubScreen } from "./subScreen.js";
import { getUserName, getPlaylists, plsList } from "./spotify.js";

var access_token;
var userID;
var user;
var expire;



getUserName();
getPlaylists();

var playlists = [];
var currentPlaylistIndex = 0;
var tracks = 0

var currentIndex = 0;
var navItens = document.getElementsByClassName("nav-item");

var subScreens = [
  new SubScreen("../screens/subscreens/home.html", "Home"),
  new SubScreen("../screens/subscreens/tracks.html", "Tracks"),
  new SubScreen("../screens/subscreens/dashboard.html", "Dashboard"),
];

var menu = document.getElementById("menuList");
for (var i = 0; i < subScreens.length; i++) {
  var element = document.createElement("li");
  element.classList.add("nav-item");
  element.id = "menuItem" + i;
  var linkEle = document.createElement("a");
  linkEle.classList.add("nav-link");
  linkEle.appendChild(document.createTextNode(subScreens[i].title));
  element.appendChild(linkEle);
  menu.appendChild(element);
}

function changeActive(newIndex, update=false) {
  console.log("click");
  var item = document.getElementById("menuItem" + currentIndex);
  item.firstChild.classList.remove("active");

  var item = document.getElementById("menuItem" + newIndex);
  item.firstChild.classList.add("active");

  subScreens[newIndex].putPage(document.getElementById("home")).then(
    ()=>{
      if(newIndex==0&&update){
        plsList()
      }
      currentIndex = newIndex;
    }
  )
  
}

changeActive(0);

var navItens = document.getElementsByClassName("nav-item");

for (let i = 0; i < navItens.length; i++) {  
  navItens[i].onclick = function () {
    changeActive(i, true);
  };
}


