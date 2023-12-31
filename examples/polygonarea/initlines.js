const mesh = new PIXI.Graphics();

function setLines(divs){
    mesh.clear();
    mesh.lineStyle(1, colors['white'], 0.25 );

    var nx = parseInt(HEIGHT / divs);
    for (var i = 0; i < nx; i++){
        mesh.moveTo(0,divs*i);
        mesh.lineTo(WIDTH,divs*i);
    }


    var ny = parseInt(WIDTH / divs);
    for (var i = 0; i < ny; i++){
        mesh.moveTo(divs*i,0);
        mesh.lineTo(divs*i,HEIGHT);
    }
}