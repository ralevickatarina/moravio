// logging to the file using log4js or winston
// since it's a library would be the best to use something that doesnt create a dependencie like logger api 
const logger = require('./logger')

var initialState;
var numRows, numCols;

// Starting the game with the given grid sizes, randomly populating the first generation
function startGameOfLife(rows, cols) {

    if (!Number.isInteger(rows) || !Number.isInteger(cols)) {
        logger.error("Error when creating the game, invalid type for grid sizes.");
        throw new Error('Invalid type for grid sizes.');
    }

    if (rows <= 0 || cols <= 0) {
        logger.error("Error when creating the game, invalid initial grid sizes. ");
        throw new Error('Invalid initial grid sizes.');
    }

    numRows = rows;
    numCols = cols;

    initialState = new Array(numRows);

    for (var i = 0; i < numRows; i++) {
        initialState[i] = new Array(numCols);
        for (var j = 0; j < numCols; j++) {
            initialState[i][j] = Math.round(Math.random());
        }
    }   

    logger.info("Game successfully started.");
}

// Alternatively, option for setting the initial state
function setInitialState(state) {

    if (!Array.isArray(state) || state.length === 0 || !state.every(row => Array.isArray(row) && row.length === state[0].length)) {
        logger.error("Error when creating the game, invalid initial state. ");
        throw new Error('Invalid initial state');
    }

    numRows = state.length;
    numCols = state[0].length;

    initialState = new Array(numRows);

    for (var i = 0; i < numRows; i++) {
        initialState[i] = new Array(numCols);
        for (var j = 0; j < numCols; j++) {
            if (state[i][j] != 0 && state[i][j] != 1) {
                initialState = null;
                logger.error("Error when creating the game, invalid values in the initial state.");
                throw new Error('Invalid values in the initial state');
            }
            initialState[i][j] = state[i][j];
        }
    }
    logger.info("Game successfully started.");
}

function generateNextState() {

    if (!Array.isArray(initialState) || initialState.length === 0 || !initialState.every(row => Array.isArray(row) && row.length === initialState[0].length)) {
        logger.error("Initial state missing, game was not started cannot generate next state");
        throw new Error('Initial state missing, game was not started, cannot generate next state.');
    }

    var nextState = new Array(numRows);

    for (var i = 0; i < numRows; i++) {
        nextState[i] = new Array(numCols);
        for (var j = 0; j < numCols; j++) {
            let count = getLiveNeighboursCount(i, j);

            if (initialState[i][j] == 1) {
                // All other live cells die in the next generation.
                nextState[i][j] = 0;
                
                // Any live cell with two or three live neighbours survives.
                if (count == 2 || count == 3) {
                    nextState[i][j] = 1;
                }
            }
            else {
                // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
                if (count == 3) {
                    nextState[i][j] = 1;
                } else {
                    nextState[i][j] = 0;
                }
            }
        }
    }

    logger.info("Next state successfully generated.");

    initialState = nextState;
    return nextState;
}

function getLiveNeighboursCount(posI, posJ) {

    var count = 0;

    for (var i = posI - 1; i <= posI + 1; i++) {
        for (var j = posJ -1; j <= posJ + 1; j++) {
            
            if (i >= 0 && i < numRows && j >= 0 && j < numCols) {
                count += initialState[i][j];
            }
        }
    }

    if (initialState[posI][posJ] == 1) {
        count--;
    }
    
    return count;
}

function printCurrentState() {
    for (var i = 0; i < numRows; i++) {
        for (var j = 0; j < numCols; j++) {
            process.stdout.write(initialState[i][j] + "");
        }
    }
}

module.exports = { startGameOfLife, setInitialState, generateNextState, printCurrentState }