function Raindrop() {
    var splash;
    sizeX = $(window).width();
    sizeY = $(window).height();
    dropColor = [255, 255, 255];
    this.x = random((-sizeX * 0.25), sizeX * 1.25);
    this.y = random(-sizeY);
    this.fallspeed = random(5, 50);
    this.length = random(15, 20);
    wind = 0;
    gravity = .1;
    // stroke(random(255),random(255),random(255));


    this.fall = function() {
        this.y = this.y + this.fallspeed;
        this.x = this.x + ((wind / this.length) * this.fallspeed);
        this.fallspeed += gravity;
        if (this.y > sizeY) {
            this.collide(this.x, sizeY);
        }
        for (var i = 0; i < blocksArray.length; i++) {
            if (this.x > blocksArray[i].x &&
                this.x < blocksArray[i].x + blocksArray[i].scale &&
                this.y > blocksArray[i].y &&
                this.y < blocksArray[i].y + blocksArray[i].scale) {
                this.collide(this.x, blocksArray[i].y);
                console.log("collided!")
            }
        }
    }


    this.collide = function(x, y) {
        splash = new Splash(this.fallspeed, x, y, wind, y);
        this.y = random(-sizeY);
        this.fallspeed = random(5, 50);
        this.x = random((-sizeX * 0.5), sizeX * 1.5);
    }


    this.show = function() {
        strokeWeight(1 * (this.fallspeed * 0.025));
        // stroke(random(0,255),random(0,255),random(0,255));
        stroke(dropColor[0], dropColor[1], dropColor[2]);
        line(this.x, this.y, this.x + wind, this.y + this.length);
        try {
            if (splash != 'undefined' && splash.checkY()) {
                splash.show()
            }
        } catch (err) {}

    }
    this.log = function() {
        console.log(`I'm a thing`)
    }
}
