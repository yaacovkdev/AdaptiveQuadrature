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

    //do some math here to return an array of tuples where you have all the grid points that the polygon lays on.
    
}