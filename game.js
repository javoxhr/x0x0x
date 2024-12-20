import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyA3csFmPhTfAFfYZfhOFQ_QN-zEV8aRlKY",
    authDomain: "x0x0-c8ed6.firebaseapp.com",
    databaseURL: "https://x0x0-c8ed6-default-rtdb.firebaseio.com",
    projectId: "x0x0-c8ed6",
    storageBucket: "x0x0-c8ed6.appspot.com",
    messagingSenderId: "675946173756",
    appId: "1:675946173756:web:6e0ee354925496a7e7ba39",
    measurementId: "G-Z66VJYF6QR"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const gameRef = ref(db, "games/game_id_1");

const board = document.getElementById("board");
const status = document.getElementById("status");

function createBoard(gameState) {
    board.innerHTML = "";
    gameState.board.forEach((cell, index) => {
        const cellElement = document.createElement("div");
        cellElement.classList.add("cell");
        if (cell) {
            cellElement.textContent = cell;
            cellElement.classList.add('class-for-x')
            // cellElement.classList.add("disabled");
        }
        cellElement.addEventListener("click", () => makeMove(index, gameState));
        board.appendChild(cellElement);
    });
    status.textContent = gameState.winner
        ? `Победитель: ${gameState.winner}`
        : `Ход: ${gameState.currentPlayer}`;
        if(gameState.winner) {
            const playAgainBtn = document.querySelector('.play-again-button-wrapper')
            playAgainBtn.style.display = 'flex'

            playAgainBtn.addEventListener("click", ()=> {
                window.location.reload()
            })
        }
}

function makeMove(index, gameState) {
    if (gameState.board[index] || gameState.winner) return;

    gameState.board[index] = gameState.currentPlayer;
    gameState.currentPlayer = gameState.currentPlayer === "X" ? "O" : "X";

    const winner = checkWinner(gameState.board);
    if (winner) {
        gameState.winner = winner;
    }

    set(gameRef, gameState);
}

function checkWinner(board) {
    const winCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (const combo of winCombinations) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}

onValue(gameRef, (snapshot) => {
    const gameState = snapshot.val();
    if (gameState) createBoard(gameState);
});

set(gameRef, {
    board: Array(9).fill(""),
    currentPlayer: "X",
    winner: null
});