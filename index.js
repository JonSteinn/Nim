class Board {

    constructor(canvas, heaps) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.heaps = heaps;
        this.playersTurn = true;
    }

    static offset() {
        return 0.05;
    }

    getMaxHeight() {
        return Math.max(...this.heaps);
    }

    getDeltaX() {
        return this.canvas.width / this.heaps.length;
    }

    getDeltaY(maxHeight) {
        return this.canvas.height / (maxHeight ? maxHeight : this.getMaxHeight());
    }

    adjustCanvas() {
        this.canvas.width  = Math.round(window.innerWidth * 0.8);
        this.canvas.height = Math.round(window.innerHeight * 0.8);
        this.ctx.fillStyle="#FF0000";
        this.ctx.font = "30px sans-serif";  
        this.ctx.textBaseline = 'middle';
        this.ctx.textAlign = "center";
    }

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

    redraw() {
        this.adjustCanvas();
        if (this.heaps.length > 0) {
            this.plotRectangles();
        } else {
            const results = !this.playersTurn ? 'Win!' : 'Lose!';
            this.ctx.fillText("Game Over - You " + results, this.canvas.width / 2, this.canvas.height / 2);
        }
    }

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

    

    click(x,y) {
        let index = this.findHeap(x);
        if (index !== -1) {
            let amount = this.findAmount(y, index);
            if (amount !== -1) {
                return this.remove(index, amount);
            }
        }
        
    }

    computerPlay() {
        const move = Agent.nextMove(this.heaps);
        this.remove(move.index, move.amount);
    }

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

class Agent {
    static nextMove(heaps) {
        let heapsCopy = Array.from(heaps.entries()).sort((a,b) => b[1] - a[1]);
        for (let i = 0; i < heapsCopy.length && heapsCopy[i][1] !== 0; i++) {
            let nimSum = heapsCopy.reduce((a,b) => a ^ b[1]);
            for (let rem = 0; rem < heapsCopy[i][1]; rem++) {
                if ((rem ^ nimSum) === 0) {
                    return {index: heapsCopy[i][0], amount: heapsCopy[i][1] - rem};
                }
            }
        }
        return {index: heapsCopy[0][0], amount: 1};
    }
}

class Game {
    constructor(canvas, numberOfHeaps) {
        
        this.board = new Board(canvas, Array.from({length: numberOfHeaps}, () => Math.floor(Math.random() * 11) + 5));
        this.board.redraw();
    }

    isOver() {
        return this.board.heaps.length === 0;
    }

    playerMove(x, y) {
        if (this.isOver() || !this.board.playersTurn) {
            return;
        }
        let w = this.board.click(x, y);
        if (w) {
            this.computerMove();
        }
    }

    computerMove() {
        if (!this.isOver()) {
            this.board.computerPlay();
        }
    }
}

(function() {

    let canvas = document.getElementById("canvas");
    let heapCount = 3;
    let game = new Game(canvas, heapCount);
    
    window.addEventListener('resize', function(evt) {
        game.board.redraw();
    });

    window.addEventListener('keypress', function (evt) {
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

    canvas.addEventListener('mousedown', function(evt) {
        if (game.isOver() || game.board.playersTurn) {
            game.playerMove(evt.offsetX, evt.offsetY);
        }
    });

    var x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 5000);
})();