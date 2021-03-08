const pixLen = 32;

var canvas = document.querySelector("canvas");
var cmbExample = document.getElementById("chosenExample");
var tilesetContainer = document.querySelector(".tileset-container");
var tilesetSelection = document.querySelector(".tileset-container_selection");
var tilesetImage = document.querySelector("#tileset-source");
var txtResult = document.querySelector("#lvlcode")

var selection = [0, 0]; //Which tile we will paint from the menu
var startTile = [0, 5]; //Which menu tile represent the start point

var isMouseDown = false;
var currentLayer = 0;
var levelData = {
    boardSize:[canvas.width / pixLen, canvas.height / pixLen],
    start:[0, 0],
    tiles:[
        //Bottom
        {
            //Structure is "x-y": ["tileset_x", "tileset_y"]
            //EXAMPLE: "1-1": [0, 4],
        },
        //Middle
        {},
        //Top
        {}
    ],
    speed:1,
    delay:3,
    version:1, // to enable support for changes later
};

//Select tile from the Tiles grid
tilesetContainer.addEventListener("mousedown", (event) => {
    selection = getCoords(event);
    tilesetSelection.style.left = selection[0] * pixLen + "px";
    tilesetSelection.style.top = selection[1] * pixLen + "px";
});

//Handler for placing new tiles on the map
function addTile(mouseEvent) {
    const clicked = getCoords(event);

    if (mouseEvent.shiftKey) {
        if(clicked[0] !== levelData.start[0] || clicked[1] !== levelData.start[1])
            delete levelData.tiles[currentLayer][toKey(clicked)];
    } else {
        // if start tile
        if(selection[1] === 0) {
            delete levelData.tiles[currentLayer][toKey(levelData.start)];
            levelData.tiles[currentLayer][toKey(clicked)] = [selection[0], selection[1]];
            levelData.start = clicked;
        } else if (clicked[0] !== levelData.start[0] || clicked[1] !== levelData.start[1]) {
            // if not current start tile
            levelData.tiles[currentLayer][toKey(clicked)] = [selection[0], selection[1]];
        }
    }
    draw();
}

function toKey(pos) {
    return pos[0] + "-" + pos[1]
}

//Bind mouse events for painting (or removing) tiles on click/drag
canvas.addEventListener("mousedown", () => {
    isMouseDown = true;
});
canvas.addEventListener("mouseup", () => {
    isMouseDown = false;
});
canvas.addEventListener("mouseleave", () => {
    isMouseDown = false;
});
canvas.addEventListener("mousedown", addTile);
canvas.addEventListener("mousemove", (event) => {
    if (isMouseDown) {
        addTile(event);
    }
});

//Utility for getting coordinates of mouse click
function getCoords(e) {
    const { x, y } = e.target.getBoundingClientRect();
    const mouseX = e.clientX - x;
    const mouseY = e.clientY - y;
    return [Math.floor(mouseX / pixLen), Math.floor(mouseY / pixLen)];
}

//Reset state to empty
function setCanvas() {
    if (cmbExample.value === "none") {
        levelData = {"boardSize":[15,15],"start":[7,9],"tiles":[{"7-9":[0,0],"5-7":[3,3]},{},{}],"speed":1,"delay":3,"version":1};
    } else if  (cmbExample.value === "exm1") {
        levelData = {"boardSize":[15,15],"start":[9,8],"tiles":[{"7-10":[2,3],"7-9":[0,2],"7-8":[0,2],"7-7":[0,2],"7-6":[2,2],"7-5":[0,1],"6-5":[2,2],"5-5":[1,2],"4-5":[3,1],"4-6":[1,1],"3-6":[1,2],"2-6":[2,2],"1-6":[2,1],"2-5":[0,1],"1-5":[3,1],"2-7":[0,2],"2-8":[0,2],"2-9":[0,2],"2-10":[0,2],"2-11":[1,1],"1-11":[1,0],"6-2":[0,3],"6-3":[0,2],"6-4":[0,2],"11-6":[1,3],"10-6":[1,2],"9-6":[1,2],"8-6":[1,2],"9-8":[1,0],"3-2":[2,3],"6-6":[2,1]},{},{}],"speed":1,"delay":3,"version":1};
    } else if  (cmbExample.value === "exm2") {
        levelData = {"boardSize":[15,15],"start":[3,5],"tiles":[{"7-9":[0,2],"7-8":[2,2],"7-7":[3,1],"7-6":[2,4],"7-5":[1,4],"6-5":[0,1],"5-5":[1,2],"4-5":[3,1],"4-6":[2,2],"4-8":[1,3],"5-8":[2,1],"5-7":[0,1],"4-7":[2,1],"3-6":[1,2],"2-6":[2,2],"1-6":[2,1],"2-5":[0,1],"1-5":[3,1],"2-7":[0,2],"2-8":[0,2],"2-9":[0,2],"2-10":[0,2],"2-11":[1,1],"1-11":[3,3],"8-5":[0,3],"8-6":[0,2],"8-7":[2,2],"8-8":[2,2],"9-8":[1,1],"6-7":[2,5],"6-6":[1,1],"6-8":[1,2],"9-7":[0,1],"5-6":[1,2],"3-5":[0,0],"8-9":[2,3],"7-10":[2,3],"3-4":[3,1]},{},{}],"speed":1,"delay":3,"version":1};
    } else if  (cmbExample.value === "exm3") {
        levelData = {"boardSize":[15,15],"start":[1,3],"tiles":[{"13-8":[1,1],"13-7":[0,2],"13-6":[0,2],"13-5":[0,2],"12-8":[1,2],"11-8":[2,2],"10-8":[1,2],"11-7":[0,2],"11-6":[0,2],"11-5":[0,2],"4-5":[1,2],"5-5":[2,2],"1-8":[2,3],"5-8":[2,3],"8-6":[2,3],"1-5":[0,2],"8-5":[0,2],"3-5":[3,3],"1-6":[0,2],"1-7":[0,2],"5-6":[0,2],"5-7":[0,2],"6-5":[1,3],"1-3":[1,0],"12-10":[1,3],"5-4":[0,3],"1-4":[0,3],"13-4":[0,3],"11-9":[2,3],"11-4":[0,3],"8-4":[0,3],"9-8":[3,3]},{},{}],"speed":1,"delay":3,"version":1};
    }
    draw();
}

function setLayer(newLayer) {
    //Update the layer
    currentLayer = newLayer;

    //Update the UI to show updated layer
    var oldActiveLayer = document.querySelector(".layer.active");
    if (oldActiveLayer) {
        oldActiveLayer.classList.remove("active");
    }
    // document.querySelector(`[tile-layer="${currentLayer}"]`).classList.add("active");
}

function draw() {
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var size_of_crop = pixLen;

    levelData.tiles.forEach((layer) => {
        Object.keys(layer).forEach((key) => {
            //Determine x/y position of this placement from key ("3-4" -> x=3, y=4)
            var positionX = Number(key.split("-")[0]);
            var positionY = Number(key.split("-")[1]);
            var [tilesheetX, tilesheetY] = layer[key];

            ctx.drawImage(
                tilesetImage,
                tilesheetX * pixLen,
                tilesheetY * pixLen,
                size_of_crop,
                size_of_crop,
                positionX * pixLen,
                positionY * pixLen,
                size_of_crop,
                size_of_crop
            );
        });
    });

    txtResult.value = JSON.stringify(levelData)
}

//Initialize app when tileset source is done loading
tilesetImage.onload = function() {
    setCanvas();
    setLayer(0);
}
tilesetImage.src = "./pipesWhiteSmall.png";

