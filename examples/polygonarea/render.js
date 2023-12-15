const WIDTH = 1000;
const HEIGHT = 1000;

const ORIGINX = WIDTH/2;
const ORIGINY = HEIGHT/2;

const DISPLAY_MESSAGE = 'Simple Polygons Only!\nClick On Canvas.';

let clear_mode = 1;

let g = {
    x:0,
    y:0,
};

let points = [];

let pxdiv = 100;

let text_area = null;

function toCanvas(x,y){
    return [x+ORIGINX, ORIGINY-y];
}

function toAxis(x,y){
    return [x-ORIGINX, ORIGINY-y];
}

const app = new PIXI.Application({antialias: true,background: '0x000030', width: WIDTH, height: HEIGHT});
document.body.appendChild(app.view);

const axis = new PIXI.Graphics();

// Create the circle for tracking pointer
const circle = app.stage.addChild(new PIXI.Graphics()
    .beginFill(colors['light yellow'])
    .lineStyle({ color: 0x111111, alpha: 0.87, width: 1 })
    .drawCircle(0, 0, 8)
    .endFill());

const lines = new PIXI.Graphics();

axis.lineStyle(2, colors['dark red'])
    .moveTo(ORIGINX,0)
    .lineTo(ORIGINX,HEIGHT)
    .moveTo(0,ORIGINY)
    .lineTo(WIDTH,ORIGINY);

//Intro Message to See the Instructions.
const intro_message = new PIXI.Text(DISPLAY_MESSAGE, {
        fontFamily: 'Arial',
        fontSize: 24,
        fill: colors['light purple'],
        align: 'center',
    });

intro_message.position.set(WIDTH *1/10,HEIGHT * 9/10);

setLines(pxdiv);

//Add the graphics components to the app.
app.stage.addChild(mesh);
//app.stage.addChild(axis);
app.stage.addChild(lines);
app.stage.addChild(intro_message);

//remove the graphic lines and remove the Area display.
function linesReset(){
    points = [];
    lines.clear();
    app.stage.removeChild(text_area);
}


function shapeReset(){
    circle.clear();
    circle.beginFill(colors['light yellow'])
        .lineStyle({ color: 0x111111, alpha: 0.87, width: 1 })
        .drawCircle(0, 0, 8)
        .endFill();
    clear_mode = 0;
}

//finds area of the points, .
function findExactArea(){
    n = points.length;
    var Total = new BigNumber(0);
    for(var i = 0; i < n-1; i++){
        //shoelace formula. 
        Total = Total.plus((BigNumber(points[i][0]).multipliedBy(BigNumber(points[i+1][1]))).minus(BigNumber(points[i+1][0]).multipliedBy(BigNumber(points[i][1]))));
    }

    Total = Total.dividedBy(2);
    return Total.absoluteValue();
}

//Enable interactivity!
app.stage.eventMode = 'static';
// Make sure the whole canvas area is interactive
app.stage.hitArea = app.screen;

// Follow the pointer
app.stage.addEventListener('pointermove', (e) =>
{
    if(clear_mode == 2) return;
    circle.position.copyFrom(e.global);
})

//run this function on click
app.stage.addEventListener('pointertap', (e) =>{
    
    if(clear_mode == 0){
        linesReset();
        clear_mode = 1;
        //intro message gets displayed.
        app.stage.addChild(intro_message);
        return;
    }
    if(clear_mode == 1){
        //intro message gets removed.
        app.stage.removeChild(intro_message);
        lines.lineStyle(2, colors['light pink']);
        circle.clear();
        g.x = e.global.x;
        g.y = e.global.y;
        
        circle.beginFill(colors['white'])
            .lineStyle({ color: colors['light blue'], alpha: 0.87, width: 1 })
            .drawCircle(0,0,8)
            .endFill();
        
        clear_mode = 2;
        points.push([g.x,g.y]);
        return;
    }

    lines.moveTo(g.x, g.y);
    g.x = e.global.x;
    g.y = e.global.y;
    

    if(distance([g.x,g.y],[points[0][0],points[0][1]]) <= 8){
        [g.x,g.y] = [points[0][0],points[0][1]];
        shapeReset();
    }

    points.push([g.x,g.y]);
    lines.lineTo(g.x, g.y);
    
    //finds the exact area inside the polygon using shoelace algorithm
    if(clear_mode == 0){
        var mesh = getMeshGrid(points, pxdiv);

        const somethinggraph = new PIXI.Graphics();
        somethinggraph.beginFill(colors['red']);
        for (var i = 0; i < mesh.length; i++){
            somethinggraph.drawCircle(mesh[i][0], mesh[i][1], 5);
        }   
        somethinggraph.endFill();
        app.stage.addChild(somethinggraph);

        text_area = new PIXI.Text(`Area is: ${(findExactArea()/pxdiv/pxdiv).toFixed(3)} squares`, {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: colors['light purple'],
            align: 'center',
        });
        text_area.position.set(WIDTH *1/10,HEIGHT * 9/10);
        app.stage.addChild(text_area);
    }
});