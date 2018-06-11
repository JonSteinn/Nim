/**
 * An agent that produces a move given the board.
 */
class Agent {
    /**
     * Calculates the best move and returns it.
     * 
     * @param {Array} heaps A list of remaining chips in each heap
     * @returns {object} The heap to remove from and how much to remove 
     */
    static nextMove(heaps) {
        const heapsCopy = Array.from(heaps.entries()).sort((a,b) => b[1] - a[1]);
        const nimSum = heapsCopy.reduce((total, element) => total ^ element[1]);
        for (let i = 0; i < heapsCopy.length && heapsCopy[i][1] !== 0; i++) {
            for (let rem = 0; rem < heapsCopy[i][1]; rem++) {
                if ((rem ^ nimSum) === 0) {
                    return {index: heapsCopy[i][0], amount: heapsCopy[i][1] - rem};
                }
            }
        }
        return {index: heapsCopy[0][0], amount: 1};
    }
}

/**
 * The board of the game. It holds the 
 * actual drawing and what to draw.
 */
class Board {
    /**
     * Create new board.
     * 
     * @param {object} canvas The canvas DOM element 
     * @param {Array} heaps An array of how many chips are in each heap
     */
    constructor(canvas, heaps) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.heaps = heaps;
        this.playersTurn = true;
    }

    /**
     * Used to seperate rectangles when drawn. If you wanna 
     * change this, keep it between 0 and 1 (exclusively).
     *
     * @returns {number} A offset to seperate rectangles when drawn
     */
    static offset() {
        return 0.05;
    }

    /**
     * Find the tallest heap.
     * 
     * @return {int} The number of chips in the largest heap.
     */
    getMaxHeight() {
        return Math.max(...this.heaps);
    }

    /**
     * How much horizontal space a rectangle can take up of the canvas.
     * 
     * @return {number} The max width of rectangles
     */
    getDeltaX() {
        return this.canvas.width / this.heaps.length;
    }

    /**
     * How much vertical space a ractangle can take up of the canvas.
     * 
     * @param {int} maxHeight The size of the tallest heap.
     * @return {number} The max height of rectangles
     */
    getDeltaY(maxHeight) {
        return this.canvas.height / (maxHeight ? maxHeight : this.getMaxHeight());
    }

    /**
     * Sets attributes of the canvas and its context.
     */
    adjustCanvas() {
        this.canvas.width  = Math.round(window.innerWidth * 0.8);
        this.canvas.height = Math.round(window.innerHeight * 0.8);
        this.ctx.fillStyle="#FF0000";
        this.ctx.font = "30px sans-serif";  
        this.ctx.textBaseline = 'middle';
        this.ctx.textAlign = "center";
    }

    /**
     * Draws all the rectangles (chips) to the canvas.
     */
    plotRectangles() {
        const maxHeight = this.getMaxHeight();
        const dx = this.getDeltaX();
        const dy = this.getDeltaY(maxHeight);

        for (let i = 0; i < this.heaps.length; i++) {
            for (let j = 0; j < this.heaps[i]; j++) {
                this.ctx.fillRect(
                    (i + Board.offset())* dx,
                    ((maxHeight - j - 1) + Board.offset()) * dy,
                    (1 - 2 * Board.offset()) * dx,
                    (1 - 2 * Board.offset()) * dy
                );
            }
        }

        
    }

    /**
     * Draw the state of the game to the canvas.
     */
    redraw() {
        this.adjustCanvas();
        if (this.heaps.length > 0) {
            this.plotRectangles();
        } else {
            // If the game is over
            const results = !this.playersTurn ? 'Win!' : 'Lose!';
            this.ctx.fillText("Game Over - You " + results, this.canvas.width / 2, this.canvas.height / 2);
        }
    }

    /**
     * Find which heap, if any, the click belongs to.
     * 
     * @param {int} x The x coordinate (of a mouse click)
     * @returns {int} The index of the heap being clicked or -1 if none.
     */
    findHeap(x) {
        const dx = this.getDeltaX();
        for (let i = 0; i < this.heaps.length; i++) {
            const minX = (i + Board.offset()) * dx;
            const maxX = minX + (1 - 2 * Board.offset()) * dx;
            if (minX <= x && x <= maxX) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Find which chip (and those above) should be removed, with regards to a click.
     * 
     * @param {int} y The y coordinate (of a mouse click)
     * @param {Array} heap The heaps currently in play
     * @returns {int} The amount that should be removed from a given heap or -1 if none.
     */
    findAmount(y, heap) {
        const maxHeight = this.getMaxHeight();
        const dy = this.getDeltaY(maxHeight);

        for (let j = 0; j < this.heaps[heap]; j++) {
            let a = ((maxHeight - j - 1) + Board.offset()) * dy;
            let b = ((maxHeight - j - 1) + Board.offset()) * dy + (1 - 2 * Board.offset()) * dy;

            if (a <= y && b >= y) {
                return this.heaps[heap] - j;
            }
        }
        return -1;
    }

    /**
     * Validates a click and removes the chips the player asked for.
     * 
     * @param {int} x The x coordinate (of a mouse click) 
     * @param {int} y The y coordinate (of a mouse click)
     * @returns {boolean} true iff successful
     */
    click(x,y) {
        let index = this.findHeap(x);
        if (index !== -1) {
            let amount = this.findAmount(y, index);
            if (amount !== -1) {
                return this.remove(index, amount);
            }
        }
        return false;
    }

    /**
     * The computer's removal of chips.
     */
    computerPlay() {
        const move = Agent.nextMove(this.heaps);
        this.remove(move.index, move.amount);
    }

    /**
     * Removes chips from heap. If the heap is empty 
     * after the removal, it is also removed.
     * 
     * @param {int} index The index of heap to remove from
     * @param {int} amount The amount of chips to remove from the heap
     * @returns {boolean} true iff successful
     */
    remove(index, amount) {
        if (index >= 0 && index < this.heaps.length && this.heaps[index] >= amount) {
            this.heaps[index] -= amount;
            if (this.heaps[index] === 0) {
                this.heaps.splice(index, 1);
            }
            this.playersTurn = !this.playersTurn;
            this.redraw();
            return true;
        }
        this.redraw();
        return false;
    }
}

/**
 * A class that holds the board and players move.
 */
class Game {
    /**
     * Create a new game. Each heap is set to a 
     * random number inclusively between 5 and 15.
     * 
     * @param {object} canvas The canvas DOM element
     * @param {int} numberOfHeaps The number of heaps in this game
     */
    constructor(canvas, numberOfHeaps) {
        this.board = new Board(canvas, Array.from({length: numberOfHeaps}, () => Math.floor(Math.random() * 11) + 5));
        this.board.redraw();
    }

    /**
     * Check if game is over.
     * 
     * @returns {boolean} true if no moves left to make
     */
    isOver() {
        return this.board.heaps.length === 0;
    }

    /**
     * One move from the human player by clicking (x,y)
     * coordinate of the canvas. If successful, it also
     * tells the computer it can make its move.
     * 
     * @param {int} x The horizontal coordinate of a click
     * @param {int} y The vertical coordinate of a click
     */
    playerMove(x, y) {
        if (this.isOver() || !this.board.playersTurn) {
            return;
        }
        if (this.board.click(x, y)) {
            this.computerMove();
        }
    }

    /**
     * Make a move as the computer.
     */
    computerMove() {
        if (!this.isOver()) {
            this.board.computerPlay();
        }
    }
}

/*
 * Function scope wrapper.
 */
(function() {
    let canvas = document.getElementById("canvas");
    let heapCount = 3;
    let game = new Game(canvas, heapCount);
    
    // Resize event redraws the canvas
    window.addEventListener('resize', (evt) => game.board.redraw());

    // Key events for new game or different heap counts
    window.addEventListener('keypress', (evt) => {
        switch (evt.key.toUpperCase()) {
            case 'N':
            game = new Game(canvas, heapCount);
                break;
            case 'ARROWLEFT':
                if (heapCount > 3) {
                    heapCount--;
                    game = new Game(canvas, heapCount);
                }
                break;
            case 'ARROWRIGHT':
                if (heapCount < 7) {
                    heapCount++;
                    game = new Game(canvas, heapCount);
                }
                break;
        }
    });

    // On click event for player to remove from heaps
    canvas.addEventListener('mousedown', (evt) => {
        if (!game.isOver() && game.board.playersTurn) {
            game.playerMove(evt.offsetX, evt.offsetY);
        }
    });
})();
