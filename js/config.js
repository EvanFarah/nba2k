let playerBase = [];
let playerTable = {};
const playerPath = "../data/nba.txt";
const MIN_PLAYER_RATING = 64;
const MAX_PLAYER_RATING = 97;
const MIN_RATING_RATIO = 86;
const MAX_RATING_RATIO = 95;

let generateButton = document.getElementById("generatePlayersButton");
let teamSizeSelect = document.getElementById('teamSize');
