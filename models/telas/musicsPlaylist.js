import { SubScreen } from "../subScreen.js";
import {
  calcularAudioFeatures,
  getAudioFeatures,
  getTracks,
} from "../spotify/playlist.js";
import { getRecomendations } from "../spotify.js";

class Tracks extends SubScreen {
  constructor(playlist) {
    super("/screens/subscreens/viewPlaylist.html", "ViewPlaylists");
    this.playlist = playlist;
  }

  async putPage(element) {
    await super.putPage(element);
    getTracks(this.playlist.tracksUrl).then((data) => {
        
      getAudioFeatures(data.tracksIds.join(",")).then((features) => {
        console.log(data)
        let currentPlaylistAnalysis = calcularAudioFeatures(features.audio_features);
        localStorage.setItem("currentPlaylistAnalysis", JSON.stringify(currentPlaylistAnalysis));
        getRecomendations(data.artists.join(","), data.genres.join(","), data.tracksIds.join(","), currentPlaylistAnalysis)
      });
    });
    
    setTimeout(100, () => {
      var button = document.getElementById("getAll");

      button.onclick = function () {
        const playlistIds = this.playlist.tracksIds.join(",");
        const urlSearchParams = new URLSearchParams({ ids: playlistIds });
        const requestUrl = `https://api.spotify.com/v1/audio-features?${urlSearchParams}`;
        fetch(requestUrl, {headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + getToken(),
        }})
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            console.log(response);
          }
        };

        xhr.open("GET", requestUrl);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Authorization", `Bearer ${getToken()}`);
        xhr.send();
      };
    });
  }
}

export { Tracks };
