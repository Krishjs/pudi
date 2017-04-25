var pudi = function(location) {
    var self = this;
    this.spot = document.getElementById(location);
    this.board = this.spot.getContext("2d");
    this.artDirector = new art(this.spot, this.board, window);
    this.addListeners = function() {
        window.addEventListener('resize', function() { self.resizer(); });
    }
    this.resizer = function() {
        this.spot.width = window.innerWidth;
        this.spot.height = window.innerHeight;
        this.artDirector.reCreate();
    };
    this.artDirector.init();
    setInterval(function() {
        self.artDirector.animate();
    }, 100);
    this.addListeners();
}

var editor = function(spot, board, frame) {
    var events = [];
    this.animator = function() {
        events.forEach(function() {
            fn();
        });
    }
    this.init = function() {
        var self = this;
        requestAnimationFrame(function() {
            self.animator();
        });
    }
    this.registerEvent = function(func) {
        events.push(func);
    };
}

var starSet = function(spot, board) {
    var stars = [];
    this.spot = spot;
    this.board = board;
    this.init = function() {
        this.createStars();
        this.paint();
    };
    this.animate = function() {
        this.init();
    };
    this.reCreate = function() {
        this.init();
    };
    this.createStars = function() {
        stars = [];
        for (i = 0; i < this.spot.width; i++) {
            stars.push({
                x: Math.random() * this.spot.width,
                y: Math.random() * this.spot.height,
                point: Math.random(),
            });
        }
    };
    this.paint = function() {
        this.board.clearRect(0, 0, this.spot.width, this.spot.height);
        this.board.fillStyle = "white";
        for (i = 0; i < stars.length; i++) {
            var star = stars[i];
            this.board.beginPath();
            this.board.arc(star.x, star.y, star.point, 0, 2 * Math.PI);
            this.board.fill();
        }
    };
};
var catcherSet = function(spot, board) {
    var self = this;
    this.spot = spot;
    this.board = board;
    this.color = ['green', '#57c1eb', '#d5b60a', 'red'];
    this.shape = ['square', 'traingle', 'cricle', 'squareTilt'];
    this.default = {
        boxGap: 5,
    };
    this.dimension = {
        box: {
            height: 300,
            width: 300
        }
    };
    this.shapes = {
        drawSquare: function(point, side, color, brd) {
            brd.beginPath();
            brd.rect(point.x - (side / 2), point.y - (side / 2), side, side);
            brd.strokeStyle = color;
            brd.lineWidth = 5;
            brd.stroke();
        },
        drawSquareTilt: function(point, side, color, brd) {
            var sqroot = Math.sqrt(3);
            var lcorner = {
                x: point.x - (side / 2),
                y: point.y
            };
            var top = {
                x: point.x,
                y: point.y - (side / 2)
            };
            var rcorner = {
                x: point.x + (side / 2),
                y: point.y
            };
            var bottom = {
                x: point.x,
                y: point.y + (side / 2)
            };
            brd.beginPath();
            brd.moveTo(lcorner.x, lcorner.y);
            brd.lineTo(top.x, top.y);
            brd.lineTo(rcorner.x, rcorner.y);
            brd.lineTo(bottom.x, bottom.y);
            brd.closePath();
            brd.lineWidth = 5;
            brd.strokeStyle = color;
            brd.stroke();

        },
        drawCircle: function(point, diameter, color, brd) {
            brd.beginPath();
            brd.arc(point.x, point.y, diameter / 2, 0, 2 * Math.PI, false);
            brd.strokeStyle = color;
            brd.lineWidth = 5;
            brd.stroke();
        },
        drawTriangle: function(point, side, color, brd) {
            var sqroot = Math.sqrt(3);
            var lcorner = {
                x: point.x - (side / 2),
                y: point.y + ((sqroot / 6) * side)
            };
            var top = {
                x: point.x,
                y: point.y - ((sqroot / 3) * side)
            };
            var rcorner = {
                x: point.x + (side / 2),
                y: point.y + ((sqroot / 6) * side)
            };
            brd.beginPath();
            brd.moveTo(lcorner.x, lcorner.y);
            brd.lineTo(top.x, top.y);
            brd.lineTo(rcorner.x, rcorner.y);
            brd.closePath();
            brd.lineWidth = 5;
            brd.strokeStyle = color;
            brd.stroke();
        },
    };
    this.dropSequence = null;
    this.currentSequence = null;
    this.dropper = {
        One: {
            x: 0,
            y: 0
        },
        Two: {
            x: 0,
            y: 0
        },
        setdrop: function(x1, x2, y) {
            this.One.x = x1;
            this.Two.x = x2;
            this.One.y = this.Two.y = y;
        },
        animate: function() {
            this.Two.y = this.Two.y + 20;
            this.One.y = this.Two.y;
        },
        drop: function() {
            var sequence = this.dropSequence;
            var gap = self.Gap;
            var width = self.dimension.box.width + gap;
            var triangleSide = (self.dimension.box.width - self.Gap) / 8;
            self.shapes[sequence[0].shape](this.One, triangleSide, sequence[0].color, self.board);
            self.shapes[sequence[1].shape](this.Two, triangleSide, sequence[1].color, self.board);
        }
    }
    this.catcher = {
        One: {
            x: 0,
            y: 0
        },
        Two: {
            x: 0,
            y: 0
        },
        setcatcher: function(x1, x2, y) {
            this.One.x = x1;
            this.Two.x = x2;
            this.One.y = this.Two.y = y;
        },
        sequence: [{
            color: 'green',
            shape: 'drawSquare'
        }, {
            color: '#57c1eb',
            shape: 'drawSquareTilt'
        }, {
            color: '#d5b60a',
            shape: 'drawCircle'
        }, {
            color: 'red',
            shape: 'drawTriangle'
        }],
        //Fisher–Yates Shuffle copied from https://bost.ocks.org/mike/shuffle/
        getSequence: function() {
            var m = this.sequence.length,
                t, i;
            while (m) {
                i = Math.floor(Math.random() * m--);
                t = this.sequence[m];
                this.sequence[m] = this.sequence[i];
                this.sequence[i] = t;
            }
            return this.sequence;
        }
    }
    this.Gap = 10;
    this.init = function() {
        this.currentSequence = this.catcher.getSequence();
        this.dropper.dropSequence = this.catcher.getSequence();
        this.setDimensions();
        this.drawBox();
        this.dropper.drop();
    };
    this.animate = function() {
        this.board.clearRect(0, 0, this.spot.width, this.spot.height);
        this.drawBox();
        this.dropper.animate();
        this.dropper.drop();
    };
    this.reCreate = function() {
        this.drawBox();
        this.dropper.animate();
        this.dropper.drop();
    };
    this.drawBox = function() {
        var x = this.spot.width / 2 - (this.dimension.box.width / 2);
        var y = this.spot.height - (this.spot.height * 0.30);
        var height = this.dimension.box.height;
        var width = this.dimension.box.width;
        var gap = this.spot.height - y;
        if (gap < this.dimension.box.height) {
            y = this.spot.height - this.dimension.box.height - this.Gap;
        }
        this.drawinnerBox(x, y, height, width);
    };
    this.setDimensions = function() {
        var x = this.spot.width / 2 - (this.dimension.box.width / 2);
        var y = this.spot.height - (this.spot.height * 0.30);
        var height = this.dimension.box.height;
        var width = this.dimension.box.width;
        var gap = this.spot.height - y;
        if (gap < this.dimension.box.height) {
            y = this.spot.height - this.dimension.box.height - this.Gap;
        }
        var gap = this.Gap;

        var width = (this.dimension.box.width - (gap * 3)) / 2;
        var height = (this.dimension.box.height - (gap * 3)) / 2;

        var xaxis = x + gap;
        var yaxis = y + gap;

        this.diameter = width;
        this.triangleSide = this.diameter / 4;

        this.firstQuadrant = {
            x: xaxis + (width / 2),
            y: yaxis + (height / 2)
        };
        this.secondQuadrant = {
            x: (xaxis + width + gap) + (width / 2),
            y: yaxis + (height / 2)
        };
        this.thirdQuadrant = {
            x: xaxis + (width / 2),
            y: (yaxis + height + gap) + (height / 2)
        };
        this.fourthQuadrant = {
            x: (xaxis + width + gap) + (width / 2),
            y: (yaxis + height + gap) + (height / 2)
        };
        this.dropper.setdrop(this.firstQuadrant.x, this.secondQuadrant.x, this.Gap * 3);
        this.catcher.setcatcher(this.firstQuadrant.x, this.secondQuadrant.x, yaxis);
    };
    this.drawinnerBox = function(x, y) {
        this.shapes.drawCircle(this.firstQuadrant, this.diameter, this.currentSequence[0].color, this.board);
        this.shapes.drawCircle(this.secondQuadrant, this.diameter, this.currentSequence[1].color, this.board);
        this.shapes.drawCircle(this.thirdQuadrant, this.diameter, this.currentSequence[2].color, this.board);
        this.shapes.drawCircle(this.fourthQuadrant, this.diameter, this.currentSequence[3].color, this.board);

        this.shapes[this.currentSequence[0].shape](this.firstQuadrant, this.triangleSide, this.currentSequence[0].color, this.board);
        this.shapes[this.currentSequence[1].shape](this.secondQuadrant, this.triangleSide, this.currentSequence[1].color, this.board);
        this.shapes[this.currentSequence[2].shape](this.thirdQuadrant, this.triangleSide, this.currentSequence[2].color, this.board);
        this.shapes[this.currentSequence[3].shape](this.fourthQuadrant, this.triangleSide, this.currentSequence[3].color, this.board);
    };
}

var art = function(spot, board, frame) {
    var sets = [];
    this.spot = spot;
    this.init = function() {
        this.setSize();
        this.setupSet();
    }
    this.setSize = function() {
        spot.width = frame.innerWidth;
        spot.height = frame.innerHeight;
    };
    this.setupSet = function() {
        var starartset = new starSet(spot, board);
        var catcherset = new catcherSet(spot, board);
        this.showSet(starartset);
        this.showSet(catcherset);
        sets.push(starartset);
        sets.push(catcherset);
    };
    this.reCreate = function() {
        sets.forEach(function(set) {
            set.reCreate();
        });
    };
    this.animate = function() {
        sets.forEach(function(set) {
            set.animate();
        });
    };
    this.showSet = function(set) {
        set.init();
    };
};