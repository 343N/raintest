var raindrops = [];
var collisionEnabled = true;
var limit = false;
var collisionCheckbox;
var count = 0;
var slider;
var lightning;
var opacity = 255;
var branches;
var blocksArray = [];
var blockScale = 16;
var dontDelete = false;
var colFirstBlock = true;
var menuDiv;
var menuOpened = false;
var colMinX, colMaxX, colMinY, colMaxY;
var db, nameInput;
var allEntries;

function setup() {
    var config = {
        apiKey: "AIzaSyDTP7GQiYO2S9pmwEudzUOfVOhCGMsk6fM",
        authDomain: "rain-test-drawings.firebaseapp.com",
        databaseURL: "https://rain-test-drawings.firebaseio.com",
        storageBucket: "rain-test-drawings.appspot.com",
        messagingSenderId: "429023551339"
    };
    firebase.initializeApp(config);
    db = firebase.database();
    sizeX = $(window).width();
    sizeY = $(window).height();
    createCanvas(sizeX, sizeY - 40);
    initialCount = sizeX * 4;
    count = sizeX * 4;
    slider = createSlider(0, sizeX * 4, sizeX / 8);
    gravitySlider = createSlider(0, 10, .1, .01);
    sizeSlider = createSlider(1, 64, 16, 1);
    fillerDiv = createDiv();
    fillerDiv.id('fillerDiv');
    fillerDiv.html('');
    clearButton = createDiv();
    clearButton.id('clearButton');
    clearButton.html('Clear Drawing');
    clearButton.mouseClicked(clearDrawing);
    menuButton = createDiv();
    menuButton.id('menuButton');
    menuButton.html('Menu');
    menuButton.mouseClicked(toggleMenu);
    menuDiv = createDiv();
    saveButton = createDiv();
    saveButton.id('saveButton');
    saveButton.mouseClicked(saveDrawing);
    saveButton.html(`Save drawing as`);
    nameInput = createInput('Unnamed');
    nameInput.id('nameInput');

    // menuDiv.mouseClicked();
    menuDiv.html('');
    menuDiv.id('menuDiv');
    saveButton.parent('#menuDiv');
    nameInput.parent('#menuDiv');
    // copyDiv = createDiv(0, 0, sizeX, 64);
    // copyDiv.style('background-color', '#BDBDBD');
    // copyDiv.style('color', 'black');
    // copyDiv.style('text-align', 'center');
    // copyDiv.style('border', '0');
    // copyDiv.style('width', '100%');
    // copyDiv.style('height', '32px');
    // copyDiv.style('font-family', 'sans-serif')
    // copyDiv.mousePressed(saveDrawingToString);
    // copyDiv.changed(setNewDrawing);
    // copyDiv.html('Clear drawing.');
    collisionCheckbox = createCheckbox('Enable Collision', true);
    collisionCheckbox.changed(toggleCollision);
    // translate(0,);

    // frameRate(4)

    for (var i = 0; i < count; i++) {
        raindrops.push(new Raindrop);
    }
}

function clearDrawing() {
    blocksArray = [];
    if (menuOpened) toggleMenu();
}

function toggleCollision() {
    if (this.checked()) {
        collisionEnabled = true;
    } else {
        collisionEnabled = false;
    }
}

function toggleMenu() {
    if (menuOpened) {
        menuDiv.style('left', '-20%')
        menuOpened = false;
    } else {
        menuDiv.style('left', '0')
        refreshList();
        menuOpened = true;
    }
}

function saveDrawing() {
    var temp = []

    for (var i = 0; i < blocksArray.length; i++) {
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
    var savedString = btoa(temp.join(''));
    var name = nameInput.value();
    db.ref('drawings').push({
        drawingName: name,
        drawingData: savedString
    });
    refreshList();

}

function refreshList() {
    db.ref('drawings').once('value', dataRetrieved, errData);
    if (select('#error')) select('#error').remove();
    var contE = selectAll('.drawingEntryContainer');
    for (var i = 0; i < contE.length; i++) {
        // console.log(keysArray);
        // elmts[i].remove();
        contE[i].remove();
    }
    var loadingDiv = createDiv('Loading...');
    loadingDiv.parent('#menuDiv');
    loadingDiv.style('font-size','1.2vw');

    function dataRetrieved(data) {
        console.log(data.val());
        if (data.val() === null) {
            loadingDiv.html(`There's no drawings yet!`);

            loadingDiv.id('error');
            console.log('UNDEFINED!')
        } else {
            var allDrawings = data.val();
            var keysArray = Object.keys(allDrawings);
            // var allEntries = [];
            // data.val();
            // var elmts = selectAll('.drawingEntry');

            loadingDiv.remove();
            for (var i = 0; i < keysArray.length; i++) {
                var key = keysArray[i];
                var name = allDrawings[key].drawingName;
                var drawingData = allDrawings[key].drawingData;
                // console.log(drawingData);
                var entryContainer = createDiv(name);
                entryContainer.parent('#menuDiv');
                entryContainer.class('drawingEntryContainer');
                // var entry = createP(name)
                // entry.class('.drawingEntry');
                // entry.parent(entryContainer);
                createDrawingListing(entryContainer, drawingData);
            }
        }
    }

    function errData() {
        console.log(err);
    }
}

function createDrawingListing(element, data) {
    element.mouseClicked(function() {
        setNewDrawing(data);
        // toggleMenu();
    });
}

function setNewDrawing(data) {
    try {
        clearDrawing();
        var newDrawingString = atob(data);
        // aotb(data);
        // console.log(newDrawingString);
        console.log(data);
        console.log(newDrawingString);
        colFirstBlock = true;
        var temp = newDrawingString.split('--');
        console.log(temp);
        // console.log(temp[0]);
        for (var i = 0; i < temp.length; i++) {
            var sections = temp[i].split(',');
            // console.log(sections);
            x = parseInt(sections[0]);
            y = parseInt(sections[1]);
            blockScale = parseInt(sections[2]);
            blocksArray.push(new Block(x, y, blockScale, color(random(255), random(255), random(255))));
            if (colFirstBlock) {
                colMinX = x;
                colMinY = y;
                colMaxX = x + blockScale;
                colMaxY = y + blockScale;
                colFirstBlock = false;
            }
            if (x < colMinX) {
                colMinX = x;
            }
            if (y < colMinY) {
                colMinY = y;
            }
            if (x + blockScale > colMaxX) {
                colMaxX = x + blockScale;
            }
            if (y + blockScale > colMaxY) {
                colMaxY = y + blockScale;
            }
        }
        // console.log(temp)

    } catch (err) {
        // copyDiv.value("Oh no! Something went wrong! you fucked it ;d");
        console.log("ERROR! \n" + err);
    }
}

function mouseClicked() {
    for (var i = 0; i < blocksArray.length; i++) {
        if (mouseX > blocksArray[i].x &&
            mouseX < blocksArray[i].x + blocksArray[i].scale &&
            mouseY > blocksArray[i].y &&
            mouseY < blocksArray[i].y + blocksArray[i].scale && !dontDelete) {
            blocksArray.splice(i, 1);
            spaceIsAlreadyOccupied = true;
            break;
        }
    }
    // if (blocksArray.length === 1 && !dontDelete) {
    //   if (mouseX > blocksArray[0].x &&
    //       mouseX < blocksArray[0].x + blocksArray[0].scale &&
    //       mouseY > blocksArray[0].y &&
    //       mouseY < blocksArray[0].y + blocksArray[0].scale){
    //         blocksArray.splice(i, 1);
    //       }
    // }
    dontDelete = false;

}

function setHeight() {
    menuDiv.style('height', (height) + 'px');
}

function draw() {

    slider.position((sizeX / 8) * 3, sizeY - (sizeY / 6));
    slider.size((sizeX / 8) * 2);
    sizeSlider.position((sizeX / 3) * 2, sizeY - (sizeY / 6));
    sizeSlider.size((sizeX / 8) * 1);

    collisionCheckbox.position((sizeX / 8) * 7, sizeY - (sizeY / 6));
    collisionCheckbox.size(20, 20);

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
    setHeight();
    // fill(0);
    textSize(16);
    stroke(255);
    text("Raindrop Count: " + Math.round(slider.value()), (sizeX / 8) * 3, sizeY - (sizeY / 7));
    text("Brush size: " + Math.round(sizeSlider.value()) + " px", (sizeX / 3) * 2, sizeY - (sizeY / 7));
    text("Gravity: " + Math.round(gravitySlider.value() * 100) / 100, (sizeX / 8), sizeY - (sizeY / 7));
    text("FPS: " + Math.floor(frameRate()), 0, height - 16);
    // text("Collision: " + collisionEnabled, (sizeX/8)*7, sizeY - (sizeY / 6));

    // console.log(gravitySlider.mouseOver());
    if (mouseIsPressed) {
        var x = mouseX % blockScale;
        x = mouseX - x;
        var y = mouseY % blockScale;
        y = mouseY - y;
        var spaceIsAlreadyOccupied = false;
        // console.log(gravitySlider.size());


        // if (blocksArray[i].x == x && blocksArray[i].y == y) {
        //
        // }
        for (var i = 0; i < blocksArray.length; i++) {
            if (y === blocksArray[i].y && x === blocksArray[i].x) {
                spaceIsAlreadyOccupied = true;
                break;
            }
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
        if (mouseY < 8) {
            spaceIsAlreadyOccupied = true;
        }

        if (!spaceIsAlreadyOccupied) {
            dontDelete = true;
            blocksArray.push(new Block(x, y, blockScale, color(random(255), random(255), random(255))));
            if (colFirstBlock) {
                colMinX = x;
                colMinY = y;
                colMaxX = x + blockScale;
                colMaxY = y + blockScale;
                colFirstBlock = false;
            }
            if (x < colMinX) {
                colMinX = x;
            }
            if (y < colMinY) {
                colMinY = y;
            }
            if (x + blockScale > colMaxX) {
                colMaxX = x + blockScale;
            }
            if (y + blockScale > colMaxY) {
                colMaxY = y + blockScale;
            }
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
