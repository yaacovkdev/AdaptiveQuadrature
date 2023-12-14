const WIDTH = 1000;
const HEIGHT = 1000;

const ORIGINX = WIDTH/2;
const ORIGINY = HEIGHT/2;

let interval = 5;
let g = {
    x:0,
    y:0,
};

function toCanvas(x,y){
    return [x+ORIGINX, ORIGINY-y];
}

const app = new PIXI.Application({antialias: true,background: '0x000030', width: WIDTH, height: HEIGHT});
document.body.appendChild(app.view);

const axis = new PIXI.Graphics();

// Create the circle
const circle = app.stage.addChild(new PIXI.Graphics()
    .beginFill(colors['light yellow'])
    .lineStyle({ color: 0x111111, alpha: 0.87, width: 1 })
    .drawCircle(0, 0, 8)
    .endFill());

const lines = new PIXI.Graphics();

lines.lineStyle(2, colors['light pink'])
    .moveTo(0,0)
    .lineTo(0.1,0.1);

// Enable interactivity!
app.stage.eventMode = 'static';

// Make sure the whole canvas area is interactive, not just the circle.
app.stage.hitArea = app.screen;

axis.lineStyle(2, colors['dark red'])
    .moveTo(ORIGINX,0)
    .lineTo(ORIGINX,HEIGHT)
    .moveTo(0,ORIGINY)
    .lineTo(WIDTH,ORIGINY);


app.stage.addChild(axis);
app.stage.addChild(lines);

// Follow the pointer
app.stage.addEventListener('pointermove', (e) =>
{
    circle.position.copyFrom(e.global);
})

app.stage.addEventListener('pointertap', (e) =>{
    lines.moveTo(g.x, g.y);
    g.x = e.global.x;
    g.y = e.global.y;
    lines.lineTo(g.x, g.y);
});


/*app.ticker.add((delta) => {
    
});*/