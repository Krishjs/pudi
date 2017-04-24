var pudi = function(location) {
    this.spot = document.getElementById(location);
    this.board = this.spot.getContext("2d");
    this.artDirector = new art(this.spot, this.board, window);
    this.addListeners = function() {
        var self = this;
        window.addEventListener('resize', function() { self.resizer(); });
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
    this.animator = function() {}
    this.init = function() {}
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
}
var catcherSet = function(spot, board) {
    this.spot = spot;
    this.board = board;
    this.default = {
        boxGap: 5,
    };
    this.dimension = {
        box: {
            height: 200,
            width: 300
        }
    };
    this.shapes = {
        circle: function() {},
        square: function() {},
        triangle: function() {},
        squaretilt: function() {}
    };
    this.init = function() {
        this.drawBox();
    };
    this.reCreate = function() {
        this.init();
    };
    this.drawBox = function() {
        var width = this.spot.height * 0.30;
        var height = this.spot.height * 0.30;
        var x = this.spot.width / 2 - (this.dimension.box.width / 2);
        var y = this.spot.height - (this.spot.height * 0.30);
        this.board.strokeStyle = "#FF0000";
        this.board.strokeRect(x, y, this.dimension.box.width, this.dimension.box.height);
        this.drawinnerBox(x, y);
    }
    this.drawinnerBox = function(x, y) {
        var width = (this.dimension.box.width - 15) / 2;
        var height = (this.dimension.box.height - 15) / 2;
        var xaxis = x + 5;
        var yaxis = y + 5;
        this.board.strokeStyle = "green";
        this.board.strokeRect(xaxis, yaxis, width, height);
        this.board.strokeStyle = "blue";
        this.board.strokeRect(xaxis + width + 5, yaxis, width, height);
        this.board.strokeStyle = "blue";
        this.board.strokeRect(xaxis, yaxis + height + 5, width, height);
        this.board.strokeStyle = "green";
        this.board.strokeRect(xaxis + width + 5, yaxis + height + 5, width, height);
    }
};

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
    }
    this.reCreate = function() {
        sets.forEach(function(set) {
            set.reCreate();
        });
    }
    this.showSet = function(set) {
        set.init();
    };
}