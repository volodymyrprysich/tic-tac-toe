var turn = "X";
    var gameStarted = false;
    var playerRole = "";
    var playerName = "";
    var sessionList = [];

    function placemarker(cell) {
        if (!gameStarted || document.getElementById("winner").innerHTML !== "") {
            return;
        }
        
        if (cell.innerHTML == "") {
            cell.innerHTML = turn;
            if (turn == "X") {
                turn = "O";
            } else {
                turn = "X";
            }
            var winner = checkWinner();
            if (winner === "draw") {
                document.getElementById("winner").innerHTML = "Draw!";
                setTimeout(function() {
                    backToLobby();
                }, 2000);
            } else if (winner) {
                document.getElementById("winner").innerHTML = "Winner: " + winner;
                setTimeout(function() {
                    backToLobby();
                }, 2000);
            }
        }
    }

    function checkWinner() {
        var cells = document.getElementsByClassName("cell");
        var board = [
            [cells[0].innerHTML, cells[1].innerHTML, cells[2].innerHTML],
            [cells[3].innerHTML, cells[4].innerHTML, cells[5].innerHTML],
            [cells[6].innerHTML, cells[7].innerHTML, cells[8].innerHTML]
        ];

        let isDraw = true;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === "") {
                    isDraw = false;
                    break;
                }
            }
        }
        if (isDraw) {
            return "draw";
        }

        for (let i = 0; i < 3; i++) {
            if (board[i][0] !== "" && board[i][0] === board[i][1] && board[i][0] === board[i][2]) {
                return board[i][0];
            }
        }

        for (let j = 0; j < 3; j++) {
            if (board[0][j] !== "" && board[0][j] === board[1][j] && board[0][j] === board[2][j]) {
                return board[0][j];
            }
        }

        if (board[0][0] !== "" && board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
            return board[0][0];
        }
        if (board[0][2] !== "" && board[0][2] === board[1][1] && board[0][2] === board[2][0]) {
            return board[0][2];
        }

        return null;
    }

    function createSession() {
        playerName = document.getElementById("player").value;
        if (playerName) {
            var session = {
                creator: playerName,
                players: [playerName],
                status: "waiting"
            };
            sessionList.push(session);
            displaySessionList();
            document.getElementById("sessionList").style.display = "block";
        } else {
            alert("Please enter your name.");
        }
    }

    function joinSession() {
        playerName = document.getElementById("player").value;
        if (playerName) {
            displaySessionList();
            document.getElementById("sessionList").style.display = "block";
        } else {
            alert("Please enter your name.");
        }
    }

    function displaySessionList() {
        var sessionListItems = document.getElementById("sessionListItems");
        sessionListItems.innerHTML = "";
        sessionList.forEach(function(session, index) {
            var listItem = document.createElement("li");
            var joinButton = document.createElement("button");
            joinButton.textContent = "Join";
            joinButton.addEventListener("click", function() {
                if (session.players.length < 2 && session.status === "waiting") {
                    var confirmation = confirm("Do you want to join session created by " + session.creator + "?");
                    if (confirmation) {
                        session.players.push(playerName);
                        startGame(session);
                    }
                } else {
                    alert("Session is full or already started.");
                }
            });
            listItem.textContent = "Session " + (index + 1) + " (Creator: " + session.creator + ", Players: " + session.players.length + "/2)";
            listItem.appendChild(joinButton);
            sessionListItems.appendChild(listItem);
        });
    }

    function startGame(session) {
        document.getElementById("waitingMsg").style.display = "block";
        setTimeout(function() {
            gameStarted = true;
            document.getElementById("lobby").style.display = "none";
            document.getElementById("game").style.display = "block";
            playerRole = "X";
            var opponentRole = playerRole === "X" ? "O" : "X";
            document.getElementById("playerInfo").innerHTML = "You are playing as: " + playerRole + " (" + playerName + ")<br>Opponent is playing as: " + opponentRole;
        }, 2000); // 2 seconds simulated waiting time
    }

    function backToLobby() {
        gameStarted = false;
        document.getElementById("lobby").style.display = "block";
        document.getElementById("game").style.display = "none";
        document.getElementById("waitingMsg").style.display = "none";
    }