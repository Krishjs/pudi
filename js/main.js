var pudi = function(location) {
    this.spot = document.getElementById(location);
    this.board = this.spot.getContext("2d");
    this.artDirector = new art(this.spot, this.board, window);
    this.addListeners = function() {
        window.addEventListener('onresize', this.resizer);
    }
    this.resizer = function() {
        this.spot.width = window.innerWidth;
        this.spot.height = window.innerHeight;
        this.artDirector.reCreate();
    };
    this.artDirector.init();
    this.addListeners();
}
var editor = function(spot, board, frame) {
    var events = [];
    this.animator = function() {

    }
    this.init = function() {

    }

    this.registerEvent = function(func) {
        events.push(func);
    }

}

var starSet = function(set, board) {
    var stars = [];
    this.set = set;
    this.board = board;
    this.init = function() {
        this.createStars();
        this.paint();
    };
    this.reCreate = function() {
        this.init();
    };
    this.createStars = function() {
        stars = [];
        for (i = 0; i < this.set.width; i++) {
            stars.push({
                x: Math.random() * this.set.width,
                y: Math.random() * this.set.height,
                point: Math.random(),
            });
        }
    };
    this.paint = function() {
        this.board.clearRect(0, 0, this.set.width, this.set.height);
        this.board.fillStyle = "white";
        for (i = 0; i < stars.length; i++) {
            var star = stars[i];
            this.board.beginPath();
            this.board.arc(star.x, star.y, star.point, 0, 2 * Math.PI);
            this.board.fill();
        }
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
        var starartSet = new starSet(spot, board);
        this.showSet(starartSet);
        sets.push(starartSet);
    }
    this.reCreate = function() {
        sets.forEach(function(set) {
            set.reCreate();
        });
    }
    this.showSet = function(set) {
        set.init(spot, board);
    };
}

var catcherSet = function(set, board) {
    this.shapes = {
        circle: function() {},
        square: function() {},
        triangle: function() {},
        squaretilt: function() {}
    };
    this.init = function() {

    };
    this.reCreate = function() {

    };
    this.
}