//just some math for PIXI specifically.
function convertToRenderRect(x,y,width,height){
    if(width < 0) [x,width] = swap(Math.abs(x),x-width);
    if(height < 0) [y,height] = swap(Math.abs(y),0);
    return [x,y,width,height];
}

function swap(a,b){
    var temp = a;
    a = b;
    b = temp;
    return [a,b];
}

function distance(a,b){
    return Math.sqrt(Math.pow(a[0] - b[0],2) + Math.pow(a[1] - b[1],2));
}

function getMeshGrid(points, div){
    var mesh = [];
    var x1 = points[0][0];
    var y1 = points[0][1];
    var x2 = points[0][0];
    var y2 = points[0][1];
    for(var i = 0; i < points.length; i++){
        if(x1 > points[i][0]) x1 = points[i][0];
        if(y1 > points[i][1]) y1 = points[i][1];
        if(x2 < points[i][0]) x2 = points[i][0];
        if(y2 < points[i][1]) y2 = points[i][1]; 
    }
    console.log(x1/div,y1/div,x2/div,y2/div);
    var starting_pos = new BigNumber(div).dividedBy(2);
    x1 = new BigNumber(x1).dividedBy(div).integerValue(BigNumber.ROUND_FLOOR).multipliedBy(div).plus(starting_pos).toNumber();
    y1 = new BigNumber(y1).dividedBy(div).integerValue(BigNumber.ROUND_FLOOR).multipliedBy(div).plus(starting_pos).toNumber();
    x2 = new BigNumber(x2).dividedBy(div).integerValue(BigNumber.ROUND_FLOOR).multipliedBy(div).plus(starting_pos).toNumber();
    y2 = new BigNumber(y2).dividedBy(div).integerValue(BigNumber.ROUND_FLOOR).multipliedBy(div).plus(starting_pos).toNumber();
    console.log(x1/div,y1/div,x2/div,y2/div);
    for(var i = x1; i <= x2; i += div){
        for(var j = y1; j <= y2; j += div){
            mesh.push([i,j]);
        }
    }
    return mesh;
    //do some math here to return an array of tuples where you have all the grid points that the polygon lays on.
    
}