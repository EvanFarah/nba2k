let generateButton = document.getElementById("generatePlayersButton");
let teamSize = document.getElementById('teamSize');
const playerBasePath = "../data/nba.txt";
const MIN_PLAYER_RATING = 64;
const MAX_PLAYER_RATING = 97;
const MIN_RATING_RATIO = 86;
const MAX_RATING_RATIO = 95;

generateButton.addEventListener("click", function() {
	generateButton.disabled = true;
	generateButton.className = "btn btn-danger";
	generateButton.textContent = "Generating...";

	$.ajax({
		url: playerBasePath,
		success: function (data) {
			teams = generateTeams(data, teamSize.value);
			display(teams);
			generateButton.className = "btn btn-success";
			generateButton.textContent = "Team Successfully Generated!";

			setTimeout(function() {
				generateButton.className = "btn btn-primary";
				generateButton.textContent = "Generate Teams";
				generateButton.disabled = false;
			}, 1000);
		}
	});
});

function display(teams) {
	let teamDivs = document.getElementsByClassName("team");
	let i = 0;
	for (team in teams) {
		const len = teams[team].length;
		let info = "";
		let totalScore = 0;
		let averageScore = 0;
		const red = [255, 0, 0];
		const green = [0, 255, 0];


		for (let j = 0; j < len; j++) {
			const name = teams[team][j].name;
			const rating = teams[team][j].rating;
			const weight = (rating - MIN_PLAYER_RATING) / (MAX_PLAYER_RATING - MIN_PLAYER_RATING);

			const color = pickHex(green, red, weight).join();
			console.log(weight);

			info += `<p style='color:rgb(${color})'><b>Player ` + (j+1) + "</b>: " + name + " (" + rating + ")</p>"; 
			totalScore += parseInt(rating, 10);
		}

		averageScore = (totalScore / len).toFixed(2);

		info = "<h3>Statistics</h3><hr class='divider'><h4>Total Rating: " + totalScore + "</h4><h4>Average Rating: " + averageScore + "</h4><hr class='divider'>" + info;

		teamDivs[i].innerHTML = info;
		i++;
	}
}

function generateTeams(playerBase, teamSize) {
	const MIN_RATING = MIN_RATING_RATIO * teamSize;
	const MAX_RATING = MAX_RATING_RATIO * teamSize;

	let team_1 = [];
	let team_2 = [];

	players = playerBase.split('\n');

	let fair = false;

	while (!fair) {
		let score = 0;
		let choices = [];
		for (let i = 0; i < teamSize; i++) {
			let choice = getRandomInt(0, players.length - 1);

			const [rating, name] = players[choice].split(',');
			team_1.push({'name': name, 'rating': rating});
			choices.push(choice);
			score += parseInt(rating, 10);
		}

		if (score >= MIN_RATING && score <= MAX_RATING) {
			fair = true;
			for (let j = 0; j < choices.length; j++) {
				players.splice(choices[j], 1);
			}
		} else {
			team_1 = [];
			choices = [];
		}
	}
	
	fair = false;

	while (!fair) {
		let score = 0;
		let choices = [];

		for (let i = 0; i < teamSize; i++) {
			let choice = getRandomInt(0, players.length - 1);

			const [rating, name] = players[choice].split(',');

			team_2.push({'name': name, 'rating': rating});
			choices.push(choice);
			score += parseInt(rating, 10);
		}

		if (score >= MIN_RATING && score <= MAX_RATING) {
			fair = true;
			for (let j = 0; j < choices.length; j++) {
				players.splice(choices[j], 1);
			}
		} else {
			team_2 = [];
			choices = [];
		}
	}

	return {
		'team_1': team_1,
		'team_2': team_2,
	}
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickHex(color1, color2, weight) {
    var p = weight;
    var w = p * 2 - 1;
    var w1 = (w/1+1) / 2;
    var w2 = 1 - w1;
    var rgb = [Math.round(color1[0] * w1 + color2[0] * w2),
        Math.round(color1[1] * w1 + color2[1] * w2),
        Math.round(color1[2] * w1 + color2[2] * w2)];
    return rgb;
}
