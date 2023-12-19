const WIDTH = 1500;
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

let pxdiv = 20;

let pxinputfield = document.getElementById('pxdivision');
pxinputfield.value = pxdiv;

function toCanvas(x,y){
    return [x+ORIGINX, ORIGINY-y];
}

function toAxis(x,y){
    return [x-ORIGINX, ORIGINY-y];
}

const app = new PIXI.Application({antialias: true,background: '0x000030', width: WIDTH, height: HEIGHT});
document.getElementById('canvasdiv').appendChild(app.view);

const axis = new PIXI.Graphics();



const lines = new PIXI.Graphics();
const approximatingsquares = new PIXI.Graphics();

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
app.stage.addChild(lines);
app.stage.addChild(intro_message);

// Create the circle for tracking pointer
const circle = app.stage.addChild(new PIXI.Graphics()
    .beginFill(colors['light yellow'])
    .lineStyle({ color: 0x111111, alpha: 0.87, width: 1 })
    .drawCircle(0, 0, 8)
    .endFill());

//remove the graphic lines and remove the Area display.
function linesReset(){
    points = [];
    lines.clear();
    approximatingsquares.clear();
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

//reset the stage when "Reset" button clicked
document.getElementById('resetbutton').addEventListener('click', (e) => {
    linesReset();
    pxdiv = parseFloat(pxinputfield.value);
    setLines(pxdiv);
    clear_mode = 1;
    //intro message gets displayed.
    app.stage.removeChild(intro_message);
    app.stage.addChild(intro_message);
});

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
        
        circle.beginFill(colors['dark blue'])
            .lineStyle({ color: colors['light blue'], alpha: 0.87, width: 1 })
            .drawCircle(0,0,8)
            .endFill();
        
        clear_mode = 2;

        //debugging purposes
        //g.x  = new BigNumber(g.x).dividedBy(pxdiv).integerValue().multipliedBy(pxdiv).toNumber()-pxdiv/2;
        //g.y  = new BigNumber(g.y).dividedBy(pxdiv).integerValue().multipliedBy(pxdiv).toNumber()-pxdiv/2;
        points.push([g.x,g.y]);
        return;
    }

    lines.moveTo(g.x, g.y);
    g.x = e.global.x;
    g.y = e.global.y;

    //debugging purposes
    //g.x  = new BigNumber(g.x).dividedBy(pxdiv).integerValue().multipliedBy(pxdiv).toNumber()-pxdiv/2;
    //g.y  = new BigNumber(g.y).dividedBy(pxdiv).integerValue().multipliedBy(pxdiv).toNumber()-pxdiv/2;
    

    if(distance([g.x,g.y],[points[0][0],points[0][1]]) <= 8){
        [g.x,g.y] = [points[0][0],points[0][1]];
        shapeReset();
    }

    points.push([g.x,g.y]);
    lines.lineTo(g.x, g.y);
    
    //finds the exact area inside the polygon using shoelace algorithm
    if(clear_mode == 0){
        
        var mesh = getMeshGrid(points, pxdiv);
        var [k1,k2] = inpolygonSq(mesh, points,pxdiv);


        
        approximatingsquares.beginFill(colors['red'],0.5);
        for (var i = 0; i < k1.length; i++){
            if(pxdiv< 1 && (k1[i][0] - parseInt(k1[i][0]) != 0 || k1[i][1] - parseInt(k1[i][1]) != 0)){
                continue;
            }
            approximatingsquares.drawRect(k1[i][0], k1[i][1], pxdiv,pxdiv);
        }
        for (var i = 0; i < k2.length; i++){
            if(pxdiv< 1 && (k2[i][0] - parseInt(k2[i][0]) != 0 || k2[i][1] - parseInt(k2[i][1]) != 0)){
                continue;
            }
            approximatingsquares.drawRect(k2[i][0], k2[i][1], pxdiv,pxdiv);
        }   
        approximatingsquares.endFill();
        app.stage.addChild(approximatingsquares);
        var exact_area = new BigNumber(findExactArea()).dividedBy(pxdiv).dividedBy(pxdiv).toNumber();

        var approxarea = k1.length + k2.length;
        var approxmodarea = k1.length + 0.5 * k2.length;
        var ratiok = (exact_area - k1.length) / (k2.length);

        var winner = Math.abs(approxarea - exact_area) > Math.abs(approxmodarea - exact_area) ? "Modified" : "Normal";
        
        document.getElementById('exactarea').innerText=`Exact Area: ${exact_area.toFixed(3)} squares`;
        document.getElementById('approxarea').innerText=`Approx Area is: ${approxarea} squares`;
        document.getElementById('approxmod').innerText=`Approx Modified Area is: ${approxmodarea} squares (k=0.5)`;
        document.getElementById('calculatedk').innerText=`Ratio of k = ${ratiok}`;
        document.getElementById('winner').innerText=`Winner: ${winner}`;
    }
});