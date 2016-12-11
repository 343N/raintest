function Block(x, y, size, color) {

  this.x = x;
  this.y = y;
  this.scale = size;
  this.color = color;

  this.show = function() {
    fill(this.color);
    noStroke();
    rect(this.x, this.y, this.scale, this.scale);
  }


}
