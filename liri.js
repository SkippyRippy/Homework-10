var env = require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
var moment = require("moment");
var nodespotifyapi = require("node-spotify-api");
var fs = require("fs");

spotify = new nodespotifyapi(keys.spotify);

var action = process.argv[2];
var val = process.argv[3];

function spot(val) {
  if (val === undefined) {
    val = "The Sign";
  }
  spotify.search({ type: "track", query: val }, function(err, data) {
    if (err) {
      return console.log("Error occurred: " + err);
    }
    console.log(data.tracks.items[0].artists[0].name);
    console.log(data.tracks.items[0].album.name);
    console.log(data.tracks.items[0].name);
    console.log(data.tracks.items[0].preview_url);
  });
}

function movie(val) {
  if (val === undefined) {
    val = "Mr. Nobody";
  }
  val = val.split(" ").join("+");
  var queryUrl =
    "http://www.omdbapi.com/?t=" + val + "&y=&plot=short&apikey=trilogy";

  axios.get(queryUrl).then(function(response) {
    console.log(
      `${response.data.Title}\nThe movie came out in ${
        response.data.Year
      }.\nIt has a IMDB rating of ${
        response.data.imdbRating
      }.\nIt has a Rotten Tomatoes Rating of ${
        response.data.Ratings[1].Value
      }.\nIt was made in ${response.data.Country}.\nMovie was in ${
        response.data.Language
      }.\nPLOT: ${response.data.Plot}\nMain Actors ${response.data.Actors}\n
      `
    );
  });
}

function band(val) {
  val = val.split(" ").join("+");
  let queryUrl =
    "https://rest.bandsintown.com/artists/" +
    val +
    "/events?app_id=codingbootcamp";

  axios.get(queryUrl).then(function(response) {
    console.log(
      `${response.data[0].venue.name}\n${response.data[0].venue.city}\n${moment(
        response.data[0].datetime
      ).format("MM/DD/YYYY")} `
    );
  });
}
function doWhat() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      return console.log(error);
    }
    var dataArr = data.split(",");
    console.log(dataArr[0]);
    console.log(dataArr[1]);
    var a = dataArr[0];
    var b = dataArr[1];

    eventHandler(a, b);
  });
}

function eventHandler(action, val) {
  if (action === "concert-this" || action === "concert") {
    band(val);
  } else if (action === "spotify-this-song" || action === "spotify") {
    spot(val);
  } else if (action === "movie-this" || action === "movie") {
    console.log("movie");
    movie(val);
  } else if (action === "do-what-it-says" || action === "do") {
    doWhat();
  } else if (action === "help-me" || action === "help") {
    console.log(
      'Type in your command concert-this, spotify-this-song, movie-this or do-what-it-says followed by the band\'s name or song you want to look up. use "the example" if your use multiple words'
    );
  } else {
    console.log("Something went wrong :(");
  }
}

eventHandler(action, val);