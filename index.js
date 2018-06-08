class Board {

    constructor(canvas, heaps) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.heaps = heaps;
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
            this.ctx.fillText("Game Over", this.canvas.width / 2, this.canvas.height / 2);
        }
    }

    click(x,y) {

    }

    computerPlay() {
        
    }

    remove(index, amount) {
        if (index > 0 && index < this.heaps.length && this.heaps[index] >= amount) {
            this.heaps[index] -= amount;
            if (this.heaps[index] === 0) {
                this.heaps.splice(index, 1);
            }
            this.redraw();
            return true;
        }
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
                    return {index: heapsCopy[i][0], amount: rem};
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
        this.playersTurn = true;

        this.board.canvas.addEventListener('click', function(evt) {
            const x = evt.offsetX;
            const y = evt.offsetY; 
        });
    }

    isOver() {
        return this.board.heaps.length === 0;
    }

    playerMove(x, y) {
        if (this.isOver() || !this.playersTurn) {
            return;
        }
        if (this.board.click()) {
            this.playersTurn = !this.playersTurn;
            if (!this.isOver()) {
                this.board.computerPlay();
            }
        }
    }
}

(function() {

    let canvas = document.getElementById("canvas");
    let game = new Game(canvas, 7);
    
    window.addEventListener('resize', function(evt) {
        game.board.redraw();
    });

    canvas.addEventListener('click', function(evt) {
        if (game.isOver() || !game.playersTurn) {
            game.playerMove(x.offsetX, y.offsetY);
        }
    });
})();