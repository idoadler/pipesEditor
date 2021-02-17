var canvas = document.querySelector("canvas");
var tilesetContainer = document.querySelector(".tileset-container");
var tilesetSelection = document.querySelector(".tileset-container_selection");
var tilesetImage = document.querySelector("#tileset-source");
var txtResult = document.querySelector("#lvlcode")

var selection = [0, 0]; //Which tile we will paint from the menu

var isMouseDown = false;
var currentLayer = 0;
var levelData = {
    version:1,
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
    var clicked = getCoords(event);
    var key = clicked[0] + "-" + clicked[1];

    if (mouseEvent.shiftKey) {
        delete levelData.tiles[currentLayer][key];
    } else {
        levelData.tiles[currentLayer][key] = [selection[0], selection[1]];
    }
    draw();
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

//converts data to image:data string and pipes into new browser tab
function exportImage() {
    var data = canvas.toDataURL();
    var image = new Image();
    image.src = data;

    var w = window.open("");
    w.document.write(image.outerHTML);
}

//Reset state to empty
function clearCanvas() {
    levelData.tiles = [{}, {}, {}];
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
    document.querySelector(`[tile-layer="${currentLayer}"]`).classList.add("active");
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

//Default image for booting up -> Just looks nicer than loading empty canvas
var defaultState = [{"7-10":[0,1],"7-9":[2,1],"7-8":[2,1],"7-7":[2,1],"7-6":[2,1],"7-5":[2,3],"6-5":[1,3],"5-5":[1,3],"4-5":[0,2],"4-6":[2,4],"4-8":[1,2],"5-8":[2,2],"5-7":[1,1],"4-7":[2,1],"3-6":[1,3],"2-6":[2,5],"1-6":[1,2],"2-5":[2,3],"1-5":[0,2],"2-7":[2,1],"2-8":[2,1],"2-9":[2,1],"2-10":[2,1],"2-11":[2,2],"1-11":[1,0]},{},{}]

//Initialize app when tileset source is done loading
tilesetImage.onload = function() {
    levelData.tiles = defaultState;
    draw();
    setLayer(0);
}
tilesetImage.src = "./PipeSpritesheetSmall.png";
