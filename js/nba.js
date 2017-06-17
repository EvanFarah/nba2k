function initPlayersFromFile(path) {
	$.ajax({
		url: playerPath,
		success: function (data) {
			players = data.split('\n');

			for (let i = 0; i < players.length; i++) {
				const [rating, name] = players[i].split(',');
				playerBase.push({ 'rating': rating, 'name': name });
				playerTable[name] = { 'rating': rating, 'picked': false };
			}

			addGenerateFunction();
		}
	});
}

function generateTeams(teamSize) {
	let team1 = generateTeam(teamSize);
	let team2 = generateTeam(teamSize);

	reset(team1);
	reset(team2);

	return {
		"team1": team1,
		"team2": team2
	}
}

function generateTeam(teamSize) {
	const MIN_RATING = MIN_RATING_RATIO * teamSize;
	const MAX_RATING = MAX_RATING_RATIO * teamSize;

	let team = [];

	let fair = false;

	while (!fair) {
		let score = 0;
		let i = 0;

		while (i < teamSize) {
			let randomChoice = getRandomInt(0, playerBase.length - 1);

			let player = playerBase[randomChoice];

			while (playerTable[player.name].picked) {
				randomChoice = getRandomInt(0, playerBase.length - 1);
				player = playerBase[randomChoice];
			}

			team.push({'name': player.name, 'rating': player.rating});
			playerTable[player.name].picked = true;
			score += parseInt(player.rating, 10);
			i++;
		}

		if (score >= MIN_RATING && score <= MAX_RATING) {
			fair = true;


		} else {
			for (let j = 0; j < team.length; j++) {
				playerTable[team[j].name].picked = false;
			}
			team = [];
		}
	}

	return team;
}

function addGenerateFunction() {
	generateButton.addEventListener("click", function() {
		generateButton.disabled = true;
		generateButton.className = "btn btn-danger";
		generateButton.textContent = "Generating...";

		teams = generateTeams(teamSizeSelect.value);
		display(teams);
		generateButton.className = "btn btn-success";
		generateButton.textContent = "Team Successfully Generated!";

		setTimeout(function() {
			generateButton.className = "btn btn-primary";
			generateButton.textContent = "Generate Teams";
			generateButton.disabled = false;
		}, 1000);
	});
}

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

			info += `<div style='text-align:left'><p style='color:rgb(${color})'><b>Player ${j+1} </b>: ${name}(${rating})</p></div>`;
			totalScore += parseInt(rating, 10);
		}

		averageScore = (totalScore / len).toFixed(2);

		info = `<h3>Statistics</h3><hr class='divider'><h4>Total Rating: ${totalScore} </h4><h4>Average Rating: ${averageScore}</h4><hr class='divider'>${info}`;
		teamDivs[i].innerHTML = info;
		i++;
	}
}

function reset(team) {
	for (let i  = 0; i < team.length; i++) {
		playerTable[team[i].name].picked = false;
	}
}
