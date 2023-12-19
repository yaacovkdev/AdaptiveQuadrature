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

//problematic function. Does not work
function lineRectIntersection(l1,l2,s1,s2){
    //check if points of l1 and l2 are inside the square first.
    if (l1.x >= s1.x && l1.x <= s2.x && l1.y >= s1.y && l1.y <= s2.y) return true;
    if (l2.x >= s1.x && l2.x <= s2.x && l2.y >= s1.y && l2.y <= s2.y) return true;

    //make 4 line segments of rectangle.
    var side1 = [{
            x: s1.x,
            y: s1.y
        },{
            x: s2.x,
            y: s1.y
        }];

    var side2 = [{
            x: s2.x,
            y: s1.y
        },{
            x: s2.x,
            y: s2.y
        }];

    var side3 = [{
            x: s2.x,
            y: s2.y
        },{
            x: s1.x,
            y: s2.y
        }];

    var side4 = [{
            x: s1.x,
            y: s2.y
        },{
            x: s1.x,
            y: s1.y
        }];
        
    if(doIntersect(l1,l2,side1[0], side1[1])) return true;
    if(doIntersect(l1,l2,side2[0], side2[1])) return true;
    if(doIntersect(l1,l2,side3[0], side3[1])) return true;
    if(doIntersect(l1,l2,side4[0], side4[1])) return true;

    return false;
}
//------- Code Segment Copied From https://www.geeksforgeeks.org/orientation-3-ordered-points/ ----------
// Given three collinear points p, q, r, the function checks if 
// point q lies on line segment 'pr' 
function onSegment(p, q, r) 
{ 
    if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && 
        q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y)) 
    return true; 
    
    return false; 
} 
  
// To find orientation of ordered triplet (p, q, r). 
// The function returns following values 
// 0 --> p, q and r are collinear 
// 1 --> Clockwise 
// 2 --> Counterclockwise 
function orient(p, q, r) 
{ 
    // Copied from https://www.geeksforgeeks.org/orientation-3-ordered-points/ 
    // for details of below formula. 
    var val = (q.y - p.y) * (r.x - q.x) - 
              (q.x - p.x) * (r.y - q.y); 
  
    if (val == 0) return 0;  // collinear 
  
    return (val > 0)? 1: 2; // clock or counterclock wise 
} 
  
// The main function that returns true if line segment 'p1q1' 
// and 'p2q2' intersect. 
function doIntersect(p1, q1, p2, q2) 
{ 
  
    // Find the four orientations needed for general and 
    // special cases 
    let o1 = orient(p1, q1, p2); 
    let o2 = orient(p1, q1, q2); 
    let o3 = orient(p2, q2, p1); 
    let o4 = orient(p2, q2, q1); 
    
    // General case 
    if (o1 != o2 && o3 != o4) 
        return true; 
    
    // Special Cases 
    // p1, q1 and p2 are collinear and p2 lies on segment p1q1 
    if (o1 == 0 && onSegment(p1, p2, q1)) return true; 
    
    // p1, q1 and q2 are collinear and q2 lies on segment p1q1 
    if (o2 == 0 && onSegment(p1, q2, q1)) return true; 
    
    // p2, q2 and p1 are collinear and p1 lies on segment p2q2 
    if (o3 == 0 && onSegment(p2, p1, q2)) return true; 
    
    // p2, q2 and q1 are collinear and q1 lies on segment p2q2 
    if (o4 == 0 && onSegment(p2, q1, q2)) return true; 
    
    return false; // Doesn't fall in any of the above cases 
} 
//------------------------------------------------------------------------------------

function inpolygonSq(mesh,points,h){
    var sqmesh = meshCenterPointsToSquare(mesh, h);
    
    var maxx = sqmesh[sqmesh.length-1][1][0]+h;
   
    var insidesq = [];
    var bordersq = [];
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

        var cs1 = {
            x: mesh[i][0],
            y: mesh[i][1]
        }

        var cs2 = {
            x: maxx,
            y: mesh[i][1]
        }

        var count = 0;
        var perimitersq = false;
        for (var j = 0; j < points.length-1; j++){
            l1 = {
                x: points[j][0],
                y: points[j][1]
            }

            l2 = {
                x: points[j+1][0],
                y: points[j+1][1]
            }

            //prevents a bug of filled squares outside polygon
            //moves the y value of point of line slightly lower if it's in the middle of a square.
            if(h >= 1){
                if(l1.y/h-parseInt(l1.y/h) == 0.5){
                    l1.y+=0.01
                }

                if(l2.y/h-parseInt(l2.y/h) == 0.5){
                    l2.y+=0.01
                }
            }

            if(lineRectIntersection(l1,l2,s1,s2)){
                //push the point
                bordersq.push([s1.x,s1.y]);
                perimitersq = true;
                break;
            }

             //ray casting algorithm.
            if(doIntersect(l1,l2,cs1,cs2)){
                count++;
            }
           
        }
        
        if(perimitersq == false && count % 2 == 1){
            //push the square infor inside the rectangle
            insidesq.push([s1.x,s1.y]);
        }
    }

    return [insidesq,bordersq];
}

function getPerimeter(points){
    var P = 0;
    for (var i = 0; i < points.length-1; i++){
        P += distance(points[i], points[i+1]);
    }
    return P;
}