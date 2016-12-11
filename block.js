function Block(x, y, size, color) {

  this.x = x;
  this.y = y;
  this.scale = size;
  this.color = color;

  this.show = function() {
    // noStroke();
    fill(this.color);
    stroke(255, 128);
    rect(this.x, this.y, this.scale, this.scale);
  }


}
