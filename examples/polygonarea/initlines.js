const mesh = new PIXI.Graphics();
mesh.lineStyle(1, colors['white'], 0.25 );

function setLines(divs){
    var nx = parseInt(HEIGHT / divs);
    for (var i = nx/2; i < nx; i++){
        mesh.moveTo(0,divs*i);
        mesh.lineTo(WIDTH,divs*i);
    }

    for (var i = nx/2; i > 0; i--){
        mesh.moveTo(0,divs*i);
        mesh.lineTo(WIDTH,divs*i);
    }

    var ny = parseInt(WIDTH / divs);
    for (var i = ny/2; i < ny; i++){
        mesh.moveTo(divs*i,0);
        mesh.lineTo(divs*i,HEIGHT);
    }

    for (var i = ny/2; i > 0; i--){
        mesh.moveTo(divs*i,0);
        mesh.lineTo(divs*i,HEIGHT);
    }
}

