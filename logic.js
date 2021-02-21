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
    version:1, // to enable support for changes later
    boardSize:[canvas.width / 32, canvas.height / 32],
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
    ]
};

//Select tile from the Tiles grid
tilesetContainer.addEventListener("mousedown", (event) => {
    selection = getCoords(event);
    tilesetSelection.style.left = selection[0] * 32 + "px";
    tilesetSelection.style.top = selection[1] * 32 + "px";
});

//Handler for placing new tiles on the map
function addTile(mouseEvent) {
    const clicked = getCoords(event);

    if (mouseEvent.shiftKey) {
        if(clicked[0] !== levelData.start[0] || clicked[1] !== levelData.start[1])
            delete levelData.tiles[currentLayer][toKey(clicked)];
    } else {
        // if start tile
        if(selection[0] === startTile[0] && selection[1] === startTile[1]) {
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
    return [Math.floor(mouseX / 32), Math.floor(mouseY / 32)];
}

//Reset state to empty
function setCanvas() {
    if (cmbExample.value === "none") {
        levelData = {"version":1,"boardSize":[15,15],"start":[7,10],"tiles":[{"7-10":[0,5],"4-6":[1,0]},{},{}]};
    } else if  (cmbExample.value === "exm1") {
        levelData = {"version":1,"boardSize":[15,15],"start":[4,10],"tiles":[{"7-10":[0,1],"7-9":[2,1],"7-8":[2,1],"7-7":[2,1],"7-6":[0,3],"7-5":[2,3],"6-5":[0,4],"5-5":[1,3],"4-5":[0,2],"4-6":[2,2],"3-6":[1,3],"2-6":[2,5],"1-6":[1,2],"2-5":[2,3],"1-5":[0,2],"2-7":[2,1],"2-8":[2,1],"2-9":[2,1],"2-10":[2,1],"2-11":[2,2],"1-11":[1,0],"6-2":[1,1],"6-3":[2,1],"6-4":[2,1],"11-6":[2,0],"10-6":[1,3],"9-6":[1,3],"8-6":[1,3],"4-10":[0,5],"9-8":[1,0],"3-2":[0,1]},{},{}]}
    } else if  (cmbExample.value === "exm2") {
        levelData = {"version":1,"boardSize":[15,15],"start":[3,5],"tiles":[{"7-10":[0,1],"7-9":[2,1],"7-8":[2,1],"7-7":[2,4],"7-6":[2,4],"7-5":[1,4],"6-5":[1,3],"5-5":[1,3],"4-5":[0,2],"4-6":[2,4],"4-8":[1,2],"5-8":[2,2],"5-7":[0,2],"4-7":[2,1],"3-6":[1,3],"2-6":[2,5],"1-6":[1,2],"2-5":[2,3],"1-5":[0,2],"2-7":[2,1],"2-8":[2,1],"2-9":[2,1],"2-10":[2,1],"2-11":[2,2],"1-11":[1,0],"8-5":[2,3],"8-6":[2,1],"8-7":[2,1],"8-8":[1,2],"9-8":[2,0],"6-7":[2,5],"6-6":[0,2],"6-8":[0,1],"3-5":[0,5],"9-7":[0,1]},{},{}]};
    } else if  (cmbExample.value === "exm3") {
        levelData = {"version":1,"boardSize":[15,15],"start":[12,10],"tiles":[{"13-8":[2,2],"13-7":[2,1],"13-6":[2,1],"13-5":[1,1],"12-8":[1,3],"11-8":[0,4],"10-8":[1,0],"11-7":[2,1],"11-6":[2,1],"11-5":[1,1],"4-5":[1,3],"5-5":[1,4],"12-10":[0,5],"1-8":[0,1],"5-8":[0,1],"8-6":[0,1],"1-3":[1,0],"1-5":[1,1],"8-5":[1,1],"3-5":[1,0],"1-6":[2,1],"1-7":[2,1],"5-6":[2,1],"5-7":[2,1],"6-5":[2,0]},{},{}]};
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

    var size_of_crop = 32;

    levelData.tiles.forEach((layer) => {
        Object.keys(layer).forEach((key) => {
            //Determine x/y position of this placement from key ("3-4" -> x=3, y=4)
            var positionX = Number(key.split("-")[0]);
            var positionY = Number(key.split("-")[1]);
            var [tilesheetX, tilesheetY] = layer[key];

            ctx.drawImage(
                tilesetImage,
                tilesheetX * 32,
                tilesheetY * 32,
                size_of_crop,
                size_of_crop,
                positionX * 32,
                positionY * 32,
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
tilesetImage.src = "./PipeSpritesheetSmall.png";

