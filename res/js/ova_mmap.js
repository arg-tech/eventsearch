var minimap;
var mctx;

function minimap_init() {
    minimap = document.getElementById('minimap');
    MMH = minimap.height;
    MMW = minimap.width;
    minimap.width = MMW * ratio;
    minimap.height = MMH * ratio;
    minimap.style.width = MMW + "px";
    minimap.style.height = MMH + "px";
    mctx = minimap.getContext('2d');
    mctx.scale(0.05,0.05);

    minimap.onmouseup = mmUp;
    minimap.onmousedown = mmDown;
    setInterval(mmdraw, INTERVAL);
}

function getMMouse(e) {
      offset = $('#minimap').offset();
      mx = e.pageX - offset.left;
      my = e.pageY - offset.top;
}

function mmDown(e){
    getMMouse(e);
    document.getElementById('container').scrollLeft = (mx  * 20) - window.containerW/2;
    document.getElementById('container').scrollTop = (my * 20) - window.containerH/2;
    minimap.onmousemove = mmMove;
}

function mmUp(e){
    getMMouse(e);
    document.getElementById('container').scrollLeft = (mx  * 20) - window.containerW/2;
    document.getElementById('container').scrollTop = (my * 20) - window.containerH/2;
    minimap.onmousemove = null;
}

function mmMove(e){
    getMMouse(e);
    document.getElementById('container').scrollLeft = (mx  * 20) - window.containerW/2;
    document.getElementById('container').scrollTop = (my * 20) - window.containerH/2;
}

function mmdraw() {
    mctx.clearRect(0, 0, WIDTH, HEIGHT);
    mctx.drawImage(canvas, 0, 0);
    mctx.lineWidth=40;
    mctx.strokeStyle = "#FFA500";
    mboxX = document.getElementById('container').scrollLeft;
    mboxY = document.getElementById('container').scrollTop;
    mctx.strokeRect(mboxX*ratio,mboxY*ratio,window.containerW*ratio,window.containerH*ratio);
}

