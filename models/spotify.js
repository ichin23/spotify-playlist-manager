
import { SubScreen } from "./subScreen.js";
import { Tracks } from "./telas/musicsPlaylist.js";

function requestSpotifyAPI(){

}


function getToken() {
  return localStorage.getItem("access_token");
}

function login() {
  window.location.replace(
    "https://accounts.spotify.com/authorize?" +
      new URLSearchParams({
        response_type: "token",
        client_id: data["client_id"],
        scope: data["scope"],
        redirect_uri: "http://localhost:5500/home.html",
      }).toString()
  );
}

async function plsList() {
  var playlists = JSON.parse(localStorage.getItem("playlists"));
  console.log(playlists);

  for (const playlistJson of playlists) {
    let playlist = playlistJson;

    var img = document.createElement("img");
    img.classList.add("imgPlaylist");
    img.src = playlistJson.image;

    var li = document.createElement("a");
    li.classList.add("list-group-item", "list-group-item-action", "d-flex", "justify-content-between", "align-items-center", "listPlaylistItem");
    li.href = "#";
    li.onclick = async function () {
      let tracks = new Tracks(playlist);
      await tracks.putPage(document.querySelector("#home"));
    };

    var div = document.createElement("div");
    div.appendChild(img);
    div.appendChild(document.createTextNode(playlistJson.name));
    li.appendChild(div);

    var icon = document.createElement("span");
    icon.classList.add("material-symbols-outlined");
    icon.appendChild(document.createTextNode("arrow_forward_ios"))
    li.appendChild(icon);
    document.getElementById("listPlaylist").appendChild(li);
  }
}

function getPlaylists() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      var response = JSON.parse(xmlhttp.response);
      var playlists = [];
      for (const playlistJson of response["items"]) {
        console.log(playlistJson)
        let playlist = {
          name: playlistJson.name,
          id: playlistJson.id,
          href: playlistJson.href,
          tracksUrl: playlistJson.tracks.href,
          image: playlistJson.images[0].url
        }
        console.log(playlistJson.tracks);
        playlists.push(playlist);

        var img = document.createElement("img");
        img.classList.add("imgPlaylist");
        img.src = playlist.image;

        var li = document.createElement("a");
        li.classList.add("list-group-item", "list-group-item-action", "d-flex", "justify-content-between", "align-items-center", "listPlaylistItem");
        li.href = "#";
        li.onclick = function () {
          console.log(playlist)
          let tracks = new Tracks(playlist);
          tracks.putPage(document.querySelector("#home"));
        };

        var div = document.createElement("div");
        div.appendChild(img);
        div.appendChild(document.createTextNode(playlistJson.name));
        li.appendChild(div);

        var icon = document.createElement("span");
        icon.classList.add("material-symbols-outlined");
        icon.appendChild(document.createTextNode("arrow_forward_ios"))
        li.appendChild(icon);

        document.getElementById("listPlaylist").appendChild(li);
      }

      localStorage.setItem("playlists", JSON.stringify(playlists));
    }
  };

  xmlhttp.open("GET", "https://api.spotify.com/v1/me/playlists");

  xmlhttp.setRequestHeader("Content-Type", "application/json");
  xmlhttp.setRequestHeader("Authorization", "Bearer " + getToken());

  xmlhttp.send();
}

async function getRecomendations(artists, genres, tracks, features) {
  var params = new URLSearchParams({seed_artists: artists, seed_genres: genres, seed_tracks:tracks})
  var response=  await fetch("https://api.spotify.com/v1/recommendations",{headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + getToken(),
  },});
  console.log(response.json());
}

async function getGenres(artistID){
  var response=  await fetch("https://api.spotify.com/v1/artists/"+artistID,{headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + getToken(),
  },})
  
  var data = await response.json()
  return data.genres;
}

function getUserName() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      var login = document.getElementById("login");
      var response = JSON.parse(xmlhttp.response);
      if(response.display_name!=undefined){

        login.appendChild(document.createTextNode(response.display_name));
      }else{
      }
    }else if(xmlhttp==4){
      window.location.href="/"

    }
  };

  xmlhttp.open("GET", "https://api.spotify.com/v1/me");

  xmlhttp.setRequestHeader("Content-Type", "application/json");
  xmlhttp.setRequestHeader("Authorization", "Bearer " + getToken());

  xmlhttp.send();
}

export {
  getPlaylists,
  getRecomendations,
  getUserName,
  getToken,
  plsList,
  login,
  getGenres,
};
