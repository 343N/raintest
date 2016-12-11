var raindrops = [];
var limit = false;
var count = 0;
var slider;
var lightning;
var opacity = 255;
var branches;
var blocksArray = [];
var blockScale = 16;

function setup() {
    sizeX = $(window).width();
    initialCount = sizeX * 4;
    count = sizeX * 4;
    slider = createSlider(0, sizeX * 4, sizeX / 8);
    gravitySlider = createSlider(0, 10, .1, .01);
    sizeSlider = createSlider(1, 64, 16, 1);
    sizeY = $(window).height();
    copyDiv = createInput(0,0,sizeX, 64);
    copyDiv.style('background-color' ,'#BDBDBD');
    copyDiv.style('color' ,'black');
    copyDiv.style('text-align','center');
    copyDiv.style('border','0');
    copyDiv.style('width','100%');
    copyDiv.style('height','32px');
    copyDiv.style('font-family','sans-serif')
    copyDiv.mousePressed(saveDrawingToString);
    copyDiv.changed(setNewDrawing);
    copyDiv.value('Click me to generate a link of your drawing. Paste text in me from other people, then press enter to view their drawings!');


    createCanvas(sizeX, sizeY - 32);
    translate(0,16);

    // frameRate(4)

    for (var i = 0; i < count; i++) {
        raindrops.push(new Raindrop);
    }
}


function saveDrawingToString() {
  var temp = []

  for (var i = 0; i < blocksArray.length; i++){
    var s = "";

    if (i === blocksArray.length - 1) {
      s += blocksArray[i].x + ",";
      s += blocksArray[i].y + ",";
      s += blocksArray[i].scale;
    } else {
      s += blocksArray[i].x + ",";
      s += blocksArray[i].y + ",";
      s += blocksArray[i].scale + "--";
    }
    temp.push(s);
  }
  // console.log(temp);
  // console.log(temp.join('').split('--'));
  copyDiv.value(btoa(temp.join('')));

}

function setNewDrawing() {
  try {
    var newDrawingString = atob(copyDiv.value());
    for (var i = blocksArray.length - 1; i >= 0; i--) {
      blocksArray.splice(0, 1);
    }
    var temp = newDrawingString.split('--');
    console.log(temp);
    for (var i = 0; i < temp.length; i++){
      var sections = temp[i].split(',');
      console.log(sections);
      blocksArray.push(new Block(parseInt(sections[0]), parseInt(sections[1]), parseInt(sections[2]), color(random(255),random(255),random(255))));
    }
  } catch(err){
    copyDiv.value("Oh no! Something went wrong! you fucked it ;d");
  }
}

function draw() {
    slider.position((sizeX / 8) * 3, sizeY - (sizeY / 6));
    slider.size((sizeX / 8) * 2);
    sizeSlider.position((sizeX / 3) * 2, sizeY - (sizeY / 6));
    sizeSlider.size((sizeX / 8) * 1);

    gravitySlider.position((sizeX / 8), sizeY - (sizeY / 6));
    gravitySlider.size((sizeX / 8));

    // textposition((sizeX / 8) * 3, sizeY - (sizeY/7));
    // textAlign(CENTER);
    sizeX = $(window).width();
    count = slider.value()
    sizeY = $(window).height();
    gravity = gravitySlider.value()
    background(0);
    wind = (mouseX - (sizeX / 2)) / (sizeX / 2) * 10;
    wind = -wind
    blockScale = sizeSlider.value()

    // fill(0);
    textSize(16);
    stroke(255);
    text("Raindrop Count: " + Math.round(slider.value()), (sizeX / 8) * 3, sizeY - (sizeY / 10));
    text("Brush size: " + Math.round(sizeSlider.value()) + " px", (sizeX / 3) * 2, sizeY - (sizeY / 10));
    text("Gravity: " + Math.round(gravitySlider.value() * 100) / 100, (sizeX / 8), sizeY - (sizeY / 10));


    // console.log(gravitySlider.mouseOver());
    if (mouseIsPressed) {
        var x = mouseX % blockScale;
        x = mouseX - x;
        var y = mouseY % blockScale;
        y = mouseY - y;
        // console.log(gravitySlider.size());

        var spaceIsAlreadyOccupied = false;
        for (var i = 0; i < blocksArray.length; i++) {
            if (blocksArray[i].x == x && blocksArray[i].y == y) {
                spaceIsAlreadyOccupied = true;
            }
        }
        if (mouseY < 64) {
          spaceIsAlreadyOccupied = true;
        }
        if (mouseX > gravitySlider.position().x &&
            mouseX < gravitySlider.position().x + gravitySlider.size().width &&
            mouseY > gravitySlider.position().y - (slider.size().height * .5) &&
            mouseY < gravitySlider.position().y + (gravitySlider.size().height * 1.5)) {
            console.log('a');
            spaceIsAlreadyOccupied = true;
        } else if (mouseX > sizeSlider.position().x &&
            mouseX < sizeSlider.position().x + sizeSlider.size().width &&
            mouseY > sizeSlider.position().y - (slider.size().height * .5) &&
            mouseY < sizeSlider.position().y + (sizeSlider.size().height * 1.5)) {
            spaceIsAlreadyOccupied = true;
        } else if (mouseX > slider.position().x &&
            mouseX < slider.position().x + slider.size().width &&
            mouseY > slider.position().y - (slider.size().height * .5) &&
            mouseY < slider.position().y + (slider.size().height * 1.5)) {
            spaceIsAlreadyOccupied = true;
        }

        if (!spaceIsAlreadyOccupied) {
            blocksArray.push(new Block(x, y, blockScale, color(random(255), random(255), random(255))));
            // console.log(y);
            // console.log(x);
        }
    }

    try {
        if (random(1) < ((count / initialCount) / 20)) {
            lightning = new Lightning(sizeX, sizeY);
            opacity = 255;
            // console.log("tried showing branches");

        }
        if (opacity > 0) {
            for (var i = 0; i < lightning.oldEndsX().length; i++) {
                stroke(125, 249, 255, opacity);
                // strokeWidth(1);
                line(lightning.oldEndsX()[i],
                    lightning.oldEndsY()[i],
                    lightning.newEndsX()[i],
                    lightning.newEndsY()[i]);
                opacity -= .05;
            }
        }

        // lightning.show()

    } catch (err) {
        // console.log(err);
    }

    for (var i = 0; i < blocksArray.length; i++) {
        blocksArray[i].show();
    }

    for (var i = 0; i < count; i++) {
        raindrops[i].fall();
        raindrops[i].show();
        // raindrops[i].log();
    }


}
