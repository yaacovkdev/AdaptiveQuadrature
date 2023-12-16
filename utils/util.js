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

//2 dimensional meshgrid with spacing h
function getMeshGrid(points, h, adjust = h/2){
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

    var starting_pos = new BigNumber(adjust);
    x1 = new BigNumber(x1).dividedBy(h).integerValue(BigNumber.ROUND_FLOOR).multipliedBy(h).plus(starting_pos).toNumber();
    y1 = new BigNumber(y1).dividedBy(h).integerValue(BigNumber.ROUND_FLOOR).multipliedBy(h).plus(starting_pos).toNumber();
    x2 = new BigNumber(x2).dividedBy(h).integerValue(BigNumber.ROUND_FLOOR).multipliedBy(h).plus(starting_pos).toNumber();
    y2 = new BigNumber(y2).dividedBy(h).integerValue(BigNumber.ROUND_FLOOR).multipliedBy(h).plus(starting_pos).toNumber();
   
    for(var i = x1; i <= x2; i += h){
        for(var j = y1; j <= y2; j += h){
            mesh.push([i,j]);
        }
    }
    return mesh;
    //do some math here to return an array of tuples where you have all the grid points that the polygon lays on.
    
}

function meshCenterPointsToSquare(mesh,h){
    var increase = h/2;
    var sqmesh = [];
    for (var i = 0; i < mesh.length; i++){
        sqmesh.push([[mesh[i][0]-increase, mesh[i][1]-increase],[mesh[i][0]+increase, mesh[i][1]+increase]]);
    }
    return sqmesh;
}

function inside(t,x1,x2){
    if((t >= x1 && t <= x2) || (t >= x2 && t <= x1)) return true;
    return false;
}

//not information for graphics but for working with a indexed representation of grid squares only.
function toGrid(squares, h){
    var simple_squares = [];
    for(var i = 0; i < squares.length; i++){
        simple_squares.push([(new BigNumber(squares[i][0]).dividedBy(h).toNumber()), (new BigNumber(squares[i][1]).dividedBy(h).toNumber())]);
    }
    
    return simple_squares;
}

function findSquaresInside(grid){
    //grid is already sorted, x in ascending order first, then y in ascending order for equal x.
    var filler = [];

    //this function does not work correctly for any 'advanced' polygons?
    /*var x1,y1,x2,y2;

    //scans from top to bottom for each column of grids.
    //when walking down the column of squares, if the count of perimiter squares we meet is off, fill down, if not, don't fill.
    var oddperimiter = true;
    
    for (var i = 0; i < grid.length-1; i++){
        x1 = grid[i][0];
        x2 = grid[i+1][0];
        
        if(x1 != x2){
            oddperimiter = true;
            continue;
        }
        if(!oddperimiter){
            oddperimiter = true;
            continue;
        }
        y1 = grid[i][1];
        y2 = grid[i+1][1];

        //
        for(var k = y1+1; k < y2; k++){
            filler.push([x1,k]);
            oddperimiter = false;
        }
        
    }*/
    return filler;
    
}

function lineRectIntersection(l1,l2,s1,s2){
    //when the first point is inside the rectangle
    if(l1.x >= s1.x && l1.y >= s1.y && l1.x <= s2.x && l1.y <= s2.y) return true;
    //when the second point is inside the rectangle
    if(l2.x >= s1.x && l2.y >= s1.y && l2.x <= s2.x && l2.y <= s2.y) return true;
    
    //prevents from doing unnecesary math
    var linelen = distance(l1.x,l1.y,l2.x,l2.y);
    if(linelen <= Math.abs(s1.x - s2.x) || linelen <= Math.abs(s1.y - s2.y)) return false;

    //when the line has the same x value everywhere.
    if(new BigNumber(l1.x).eq(new BigNumber(l2.x))){
        if(l1.x >= s1.x && l1.x <= s2.x && !((l1.y <= s1.y && l2.y <= s1.y) || (l1.y >= s2.y && l2.y >= s2.y))) return true;
        else return false;
    }

    //linear solution
    //y = mx + b
    var m = (l2.y - l1.y)/(l2.x - l1.x);
    var b = l1.y - l1.x*m;
    var intercept;
    
    if(m == 0){
        if(b == s1.y || b == s2.y) return true;
    } else {

        intercept = (s1.y - b) / m;
        if(inside(intercept, s1.x, s2.x) && inside(intercept, l1.x, l2.x)) return true;

        intercept = (s2.y - b) / m;
        if(inside(intercept, s1.x, s2.x) && inside(intercept, l1.x, l2.x)) return true;
    }

    intercept = s1.x*m + b;
    if(inside(intercept, s1.y, s2.y) && inside(intercept, l1.y, l2.y)) return true;

    intercept = s2.x*m + b;
    if(inside(intercept, s1.y, s2.y) && inside(intercept, l1.y, l2.y)) return true;

    return false;
}

function lineLineIntersection(A,B,C,D){
    // Line AB represented as a1x + b1y = c1
    var a1 = new BigNumber(B.y).minus(new BigNumber(A.y));
    var b1 = new BigNumber(A.x).minus(B.x);
    var c1 = a1.multipliedBy(new BigNumber(A.x)).plus(b1.multipliedBy(new BigNumber(A.y)));
    
    // Line CD represented as a2x + b2y = c2
    var a2 = new BigNumber(D.y).minus(new BigNumber(C.y));
    var b2 = new BigNumber(C.x).minus(new BigNumber(D.x));
    var c2 = a2.multipliedBy(new BigNumber(C.x)).plus(b2.multipliedBy(new BigNumber(C.y)));
    
    var determinant = a1*b2 - a2*b1;
    
    return determinant != 0; //true for intersection
}

function inpolygonSq(mesh,points,h){
    var sqmesh = meshCenterPointsToSquare(mesh, h);
    var k = [];
    //comparing every single point with every single line of polygon.
    for(var i = 0; i < sqmesh.length; i++){
        var s1 = {
            x: sqmesh[i][0][0],
            y: sqmesh[i][0][1]
        }
        var s2 = {
            x: sqmesh[i][1][0],
            y: sqmesh[i][1][1]
        }
        var l1, l2;
        for (var j = 0; j < points.length-1; j++){
            l1 = {
                x: points[j][0],
                y: points[j][1]
            }
            l2 = {
                x: points[j+1][0],
                y: points[j+1][1]
            }

            if(lineRectIntersection(l1,l2,s1,s2)){
                //push the point
                k.push([s1.x,s1.y]);
                break;
            }
        }
    }
    
    k = toGrid(k,h);
    
    k.push(...findSquaresInside(k));

    k = toGrid(k,1/h);

    return k;
}

