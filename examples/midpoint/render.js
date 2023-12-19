const WIDTH = 1000;
const HEIGHT = 1000;

const ORIGINX = WIDTH/2;
const ORIGINY = HEIGHT/2;

let interval = 0.5;
let pxdiv = 40;
let domain = [0,10];

function toCanvas(x,y){
    return [x*pxdiv+ORIGINX, ORIGINY-y*pxdiv];
}

const app = new PIXI.Application({antialias: true,background: '0x000030', width: WIDTH, height: HEIGHT});
document.getElementById('canvasdiv').appendChild(app.view);

const axis = new PIXI.Graphics();
const line1 = new PIXI.Graphics();
const panels = new PIXI.Graphics();
const boxes = new PIXI.Graphics();

let f = function(x){
    x = new BigNumber(x);
    x = x.minus(ORIGINX)
    x = x.dividedBy(pxdiv);

    //core function
    x = x.exponentiatedBy(2).dividedBy(20).plus(Math.sin(x.toNumber()));

    x = x.multipliedBy(-pxdiv);
    x = x.plus(ORIGINY);
    return x.toNumber();
}

var starting = toCanvas(domain[0],0);
var x = starting[0];
var y = f(x);

line1.lineStyle(3, 0xffffff)
    .moveTo(0,HEIGHT/2)
    .lineTo(0,HEIGHT/2);

axis.lineStyle(2, colors['dark red'])
    .moveTo(ORIGINX,0)
    .lineTo(ORIGINX,HEIGHT)
    .moveTo(0,ORIGINY)
    .lineTo(WIDTH,ORIGINY);

setLines(pxdiv);

app.stage.addChild(mesh);
app.stage.addChild(axis);
app.stage.addChild(line1);
app.stage.addChild(boxes);
//app.stage.addChild(panels);

interval *= pxdiv;
//interval += interval/2;

var midpoint_approx = new BigNumber(0);
var trapezoid_approx = new BigNumber(0);
var calculatedintegral = new BigNumber(domain[1]).exponentiatedBy(3).dividedBy(60).minus(new BigNumber(Math.cos(domain[1])).plus(-1));

app.ticker.add((delta) => {
    line1.moveTo(x,y);
    //the graphics render, the higher, the lower the y value, and starts from 0.
    y = f(x);
    
     //trapezoid rule calculation
    var global_relative_y = new BigNumber(ORIGINY).minus(y).dividedBy(pxdiv);
    var global_delta_x = new BigNumber(interval).dividedBy(pxdiv);
    if(x % interval == 0){
       
        
        if((x) == starting[0] || x == domain[1]*pxdiv + ORIGINX){
            trapezoid_approx = trapezoid_approx.plus(global_relative_y);
        } else {
            trapezoid_approx = trapezoid_approx.plus(global_relative_y.multipliedBy(2));
        }
    }
    
    //progressing of x
    x++;
    line1.lineTo(x,y);

    //routine for midpoint rule
    if((x % interval - parseInt(interval/2)) == 0){

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

        rect.x = x-interval/2;
        rect.y = y;
        rect.width = interval;
        rect.height = ORIGINY-y;

        //midpoint rule calculation
        var relative_width = new BigNumber(interval).dividedBy(pxdiv);
        var relative_y = new BigNumber(ORIGINY).minus(y).dividedBy(pxdiv);
        midpoint_approx = midpoint_approx.plus((relative_width).multipliedBy(relative_y));

        //render of midpoint intervals
        [rect.x, rect.y, rect.width, rect.height] = convertToRenderRect(rect.x, rect.y-ORIGINY, rect.width, rect.height);
        boxes.addChild((new PIXI.Graphics())
            .beginFill(colors['black'], 0)
            .lineStyle({ color: colors['orange'], alpha: 0.5, width: 2})
            .drawRect(rect.x,rect.y+ORIGINY, rect.width, rect.height)
            .endFill());
    }

    if(x>domain[1]*pxdiv + ORIGINX){
        app.ticker.stop();

        //finalizing trapezoidal rule
        trapezoid_approx = trapezoid_approx.multipliedBy(global_delta_x.dividedBy(2));

        document.getElementById('calculatedinteg').innerText= `Calculated Integral: ${calculatedintegral.toNumber().toFixed(4)}`
        document.getElementById('approximatedmidpoint').innerText= `Midpoint Rule Approx: ${midpoint_approx.toNumber().toFixed(4)}`
        document.getElementById('approxtrapezoidrule').innerText= `Trapezoidal Rule Approx: ${trapezoid_approx.toNumber().toFixed(4)}`
        document.getElementById('simpsonsrule').innerText= `Simpson's Rule Approx: ${midpoint_approx.multipliedBy(2/3).plus(trapezoid_approx.multipliedBy(1/3)).toNumber().toFixed(4)}`
    }
});