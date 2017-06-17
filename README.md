# nba2k

Generates 2 teams with random players to play against.
* Guarantees match fairness based on player ratings.
* Allows team size from 1 to 5
* Minimum rating ratios and maximum rating ratios can be changed inside js/utils.js

To run a server locally (to bypass Cross Origin error, so you can read the file), you can run either of these commands in your terminal:
* python 2: python -m simpleHTTPServer
* python 3: python -m http.server 
* npm: http-server

Open your favorite browser and go to "localhost:<port>". <port> is the port that your server is running on. You can either specify the port in the command above or leave it blank and let it choose a default port for you. 

You can supply your own player data by replacing the existing nba.txt with another one in the same format (ratings and player names in comma separated format). Look at the supplied nba.txt as an example
