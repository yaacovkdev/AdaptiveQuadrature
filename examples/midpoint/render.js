const WIDTH = 1000;
const HEIGHT = 1000;

const ORIGINX = WIDTH/2;
const ORIGINY = HEIGHT/2;

let interval = 5;
let domain = [-150,150];

function toCanvas(x,y){
    return [x+ORIGINX, ORIGINY-y];
}

const app = new PIXI.Application({antialias: true,background: '0x000030', width: WIDTH, height: HEIGHT});
document.body.appendChild(app.view);

const axis = new PIXI.Graphics();
const line1 = new PIXI.Graphics();
const panels = new PIXI.Graphics();
const boxes = new PIXI.Graphics();

var starting = toCanvas(domain[0],0);
var x = starting[0];
var y = -Math.pow((x-ORIGINX) * 0.1,2) + ORIGINY;

line1.lineStyle(3, 0xffffff)
    .moveTo(0,HEIGHT/2)
    .lineTo(0,HEIGHT/2);

axis.lineStyle(2, colors['dark red'])
    .moveTo(ORIGINX,0)
    .lineTo(ORIGINX,HEIGHT)
    .moveTo(0,ORIGINY)
    .lineTo(WIDTH,ORIGINY);


app.stage.addChild(axis);
app.stage.addChild(line1);
app.stage.addChild(boxes);
//app.stage.addChild(panels);

app.ticker.add((delta) => {
    line1.moveTo(x,y);

    //the graphics render, the higher, the lower the y value, and starts from 0.
    y = -Math.pow((x-ORIGINX) * 0.1,2) + ORIGINY;
    x++;
    line1.lineTo(x,y);
    if((x % interval) == 0){
        panels.addChild((new PIXI.Graphics())
            .beginFill(0xffffff)
            .lineStyle({ color: colors['orange'], alpha: 0.90, width: 2 })
            .drawCircle(x,y,2)
            .endFill());

        var rect = {
            x: 0,
            y: 0,
            width:0,
            height:0
        };

        rect.x = x-interval;
        rect.y = y;
        rect.width = interval;
        rect.height = ORIGINY-y;

        [rect.x, rect.y, rect.width, rect.height] = convertToRenderRect(rect.x, rect.y-ORIGINY, rect.width, rect.height);
        console.log(rect);
        boxes.addChild((new PIXI.Graphics())
            .beginFill(colors['black'], 0)
            .lineStyle({ color: colors['orange'], alpha: 0.5, width: 2})
            .drawRect(rect.x,rect.y+ORIGINY, rect.width, rect.height)
            .endFill());
    }
    if(x>domain[1] + ORIGINX){
        //app.stage.removeChild(line1);
        app.ticker.stop();
        //console.log(panels.children);
    }
});