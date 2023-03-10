import { getGenres, getToken } from "../spotify.js";

async function getTracks(hrefTracks) {
  const response = await fetch(hrefTracks, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken(),
    },
  });
  const response_1 = await response.json();
  var tracksIds = [];
  var genres = [];
  var artists = [];
  for (let musicJson of response_1.items) {
    if (
      artists.indexOf(musicJson.track.artists[0].id) === -1 &&
      artists.length < 5
    ) {
      tracksIds.push(musicJson.track.id);

      artists.push(musicJson.track.artists[0].id);

      var genresSearch = await getGenres(musicJson.track.artists[0].id);

      genres.push(genresSearch[0]);
    }
    var img = document.createElement("img");
    img.classList.add("imgPlaylist");
    img.src = musicJson.track.album.images[0].url;

    var li = document.createElement("a");
    li.classList.add("list-group-item");
    li.classList.add("list-group-item-action");
    li.classList.add("d-flex");
    li.classList.add("justify-content-between");
    li.classList.add("align-items-center");
    li.classList.add("listPlaylistItem");
    li.href = "#";
    li.onclick = function () {
      getAudioFeatures(musicJson.id).then((data) => {
        console.log(data);
      });
    };

    var div = document.createElement("div");
    div.appendChild(img);
    div.appendChild(document.createTextNode(musicJson.track.name));
    li.appendChild(div);

    var icon = document.createElement("span");
    icon.classList.add("material-symbols-outlined");
    icon.appendChild(document.createTextNode("arrow_forward_ios"));
    li.appendChild(icon);
    document.getElementById("musicas").appendChild(li);
  }
  console.log(artists.join(","));
  return {
    tracksIds: tracksIds,
    artists: artists,
    genres: genres,
  };
}

async function getAudioFeatures(id) {
  const response = await fetch(
    "https://api.spotify.com/v1/audio-features?" +
      new URLSearchParams({ ids: id }),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getToken(),
      },
    }
  );
  const data = await response.json();
  console.log(data);
  return data;
}

function calcularAudioFeatures(audioFeatures) {
  let max_danceability = 0,
    min_danceability = 1,
    target_danceability = 0;
  let max_energy = 0,
    min_energy = 1,
    target_energy = 0;
  let max_loudness = -60,
    min_loudness = 0,
    target_loudness = 0;
  let max_acousticness = 0,
    min_acousticness = 1,
    target_acousticness = 0;
  let max_instrumentalness = 0,
    min_instrumentalness = 1,
    target_instrumentalness = 0;
  let max_liveness = 0,
    min_liveness = 1,
    target_liveness = 0;
  let total = audioFeatures.length;

  audioFeatures.forEach((feature) => {
    // danceability
    max_danceability = Math.max(max_danceability, feature.danceability);
    min_danceability = Math.min(min_danceability, feature.danceability);
    target_danceability += feature.danceability;

    // energy
    max_energy = Math.max(max_energy, feature.energy);
    min_energy = Math.min(min_energy, feature.energy);
    target_energy += feature.energy;

    // loudness
    max_loudness = Math.max(max_loudness, feature.loudness);
    min_loudness = Math.min(min_loudness, feature.loudness);
    target_loudness += feature.loudness;

    // acousticness
    max_acousticness = Math.max(max_acousticness, feature.acousticness);
    min_acousticness = Math.min(min_acousticness, feature.acousticness);
    target_acousticness += feature.acousticness;

    // instrumentalness
    max_instrumentalness = Math.max(
      max_instrumentalness,
      feature.instrumentalness
    );
    min_instrumentalness = Math.min(
      min_instrumentalness,
      feature.instrumentalness
    );
    target_instrumentalness += feature.instrumentalness;

    // liveness
    max_liveness = Math.max(max_liveness, feature.liveness);
    min_liveness = Math.min(min_liveness, feature.liveness);
    target_liveness += feature.liveness;
  });

  const result = {
    max_danceability,
    min_danceability,
    target_danceability: target_danceability / total,
    max_energy,
    min_energy,
    target_energy: target_energy / total,
    max_loudness,
    min_loudness,
    target_loudness: target_loudness / total,
    max_acousticness,
    min_acousticness,
    target_acousticness: target_acousticness / total,
    max_instrumentalness,
    min_instrumentalness,
    target_instrumentalness: target_instrumentalness / total,
    max_liveness,
    min_liveness,
    target_liveness: target_liveness / total,
  };

  return result;
}

export { getAudioFeatures, getTracks, calcularAudioFeatures };
