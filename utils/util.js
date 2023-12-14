//just some math for PIXI specifically. Junk.
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