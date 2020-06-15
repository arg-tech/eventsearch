panpress = null;
paninc = 0;

// Happens when the mouse is moving inside the canvas
function myMove(e){
    if (isDrag){
        getMouse(e);
        if(window.msel.length > 0){
            mvx = mx - mstartx;
            mvy = my - mstarty;
            for (var i=0; i<window.msel.length; i++) {
                window.msel[i].x = window.mselo[i].x + mvx;
                window.msel[i].y = window.mselo[i].y + mvy;
            }
        }else{
            mySel.x = mx - offsetx;
            mySel.y = my - offsety;   
        }
        invalidate();
    }else if(isMSel){
        getMouse(e);
        msbendx = mx;
        msbendy = my;
        invalidate();
    }else if(isPan){
        getMouse(e);
        var mvx = e.pageX - offsetx;
        var mvy = e.pageY - offsety;

        document.getElementById('container').scrollLeft = panx - mvx;
        document.getElementById('container').scrollTop = pany - mvy;
    }
}

// Happens when the mouse is clicked in the canvas
function myDown(e){
    if(e.button === 2){
        return false;
    }
    $('#contextmenu').hide();
    getMouse(e);
    clear(gctx);
    var l = nodes.length;
    for (var i = l-1; i >= 0; i--) {
        // draw shape onto ghost context
        drawshape(gctx, nodes[i], 'w');

        // get image data at the mouse x,y pixel
        var imageData = gctx.getImageData(mx, my, 1, 1);
        var index = (mx + my * imageData.width) * 4;

        // node clicked
        if (imageData.data[3] > 0) {
            if(window.multisel) {
                window.msel.push(nodes[i]);
                mox = nodes[i].x;
                moy = nodes[i].y;
                window.mselo.push({'x':mox,'y':moy});
                mySel = nodes[i];
            }else if(window.shiftPress) {
                mySel = nodes[i];
                window.msel = [];
                NN = addNode(mx, my, 'w', '', 'support', true, 0);
                myActiveEdge = addEdge(mySel, NN);
                mySel = NN;
            }else if(window.altPress) {
                mySel = nodes[i];
                window.msel = [];
                NN = addNode(mx, my, 'w', '', 'attack', true, 0);
                myActiveEdge = addEdge(mySel, NN);
                mySel = NN;
            }else if(mySel != nodes[i]){
                mySel = nodes[i];
                window.msel = [];
                window.mselo = [];
                if(mySel.type=='I' && mySel.color != 'w'){
                    hlcurrent(mySel.id);
                }else{
                    $(".highlighted").removeClass("hlcurrent");
                }
            }
            offsetx = mx - mySel.x;
            offsety = my - mySel.y;
            mySel.x = mx - offsetx;
            mySel.y = my - offsety;
            startx = mySel.x;
            starty = mySel.y;
            isDrag = true;
            mstartx = mx;
            mstarty = my;
            canvas.onmousemove = myMove;
            invalidate();
            clear(gctx);
            return;
	}
    }

    t = getSelText();
    if(t != '') {
        if(window.iatmode){
            NN = addNode(mx, my, 'b', t, 'L', false, 0);
            mySel = NN;
            $('#locution_add').show();
        }else{
            NN = addNode(mx, my, 'b', t, 'I', true, 0);
        }
        mySel = NN;
        hlcurrent(mySel.id);
    }else {//if(window.nodeAdd){
        window.addnodeIDcounter = window.addnodeIDcounter + 1;
        t = 'I-Node' + window.addnodeIDcounter;
        NN = addNode(mx, my, 'b', 'I-Node', 'I', true, 0);
        nodeMode('off');
        mySel = NN;
        //editpopup(mySel);
    }
    clearSelText();

    clear(gctx);
    invalidate();
}

function myUp(){
    if(isMSel){
        var l = nodes.length;
        msbl = msbstartx;
        msbr = msbendx;
        msbt = msbstarty;
        msbb = msbendy;
        if(msbstartx > msbendx){ 
            msbr = msbstartx;
            msbl = msbendx;
        }
        if(msbstarty > msbendy){
            msbb = msbstarty;
            msbt = msbendy;
        }
        for (var i = 0; i < l; i++) {
            if((nodes[i].x > msbl && nodes[i].x < msbr) && (nodes[i].y > msbt && nodes[i].y < msbb)){
                window.msel.push(nodes[i]);
                mox = nodes[i].x;
                moy = nodes[i].y;
                window.mselo.push({'x':mox,'y':moy});
            }
        }
        isMSel = false;
        canvas.onmousemove = null;
        invalidate();
        return;
    }
    if(mySel != null && (mySel.type == 'attack' || mySel.type == 'support')) {
        var l = nodes.length;
        var nodeto = null;
        for (var i = l-1; i >= 0; i--) {
            drawshape(gctx, nodes[i], 'w');
            var imageData = gctx.getImageData(mx, my, 1, 1);
            var index = (mx + my * imageData.width) * 4;

            // node clicked
            if (imageData.data[3] > 0 && nodes[i] != mySel && nodes[i] != myActiveEdge.from) {
                nodeto = nodes[i];
                rndm = Math.floor(Math.random() * 12)-6;
                if(mySel.type == 'attack'){
                    snx = (nodeto.x-myActiveEdge.from.x)/2+myActiveEdge.from.x+rndm;
                    sny = (nodeto.y-myActiveEdge.from.y)/2+myActiveEdge.from.y+rndm;
                    SN = addNode(snx, sny, 'r', 'CA', 'CA', true, 0);
                    myActiveEdge.to = SN;
                    postEdit("edge", "add", myActiveEdge);
                    addEdge(SN, nodeto);
                }else if(nodeto.type == 'I'){
                    snx = (nodeto.x-myActiveEdge.from.x)/2+myActiveEdge.from.x+rndm;
                    sny = (nodeto.y-myActiveEdge.from.y)/2+myActiveEdge.from.y+rndm;
                    SN = addNode(snx, sny, 'g', 'RA', 'RA', true, 0);
                    myActiveEdge.to = SN;
                    postEdit("edge", "add", myActiveEdge);
                    addEdge(SN, nodeto);
                }else if(myActiveEdge.from.type == 'L' && nodeto.type == 'L') {
                    tax = (nodeto.x-myActiveEdge.from.x)/2+myActiveEdge.from.x+rndm;
                    tay = (nodeto.y-myActiveEdge.from.y)/2+myActiveEdge.from.y+rndm;
                    TA = addNode(tax, tay, 'p', 'TA', 'TA', true, 0);
                    myActiveEdge.to = TA;
                    postEdit("edge", "add", myActiveEdge);
                    addEdge(TA, nodeto);
                    addEdge(myActiveEdge.from, TA);
                }else if(myActiveEdge.from.type == 'TA' && (nodeto.type == 'RA' || nodeto.type == 'CA' || nodeto.type == 'MA' || nodeto.type == 'PA')) {
                    yax = (nodeto.x-myActiveEdge.from.x)/2+myActiveEdge.from.x+rndm;
                    yay = (nodeto.y-myActiveEdge.from.y)/2+myActiveEdge.from.y+rndm;
                    YA = addNode(yax, yay, 'y', 'YA', 'YA', true, 0);
                    myActiveEdge.to = YA;
                    postEdit("edge", "add", myActiveEdge);
                    addEdge(YA, nodeto);
                    addEdge(myActiveEdge.from, YA);
                }else if(myActiveEdge.from.type == 'I' && nodeto.type == 'L') {
                    snx = (nodeto.x-myActiveEdge.from.x)/2+myActiveEdge.from.x+rndm;
                    sny = (nodeto.y-myActiveEdge.from.y)/2+myActiveEdge.from.y+rndm;
                    SN = addNode(snx, sny, 'g', 'RA', 'RA', true, 0);
                    myActiveEdge.to = SN;
                    postEdit("edge", "add", myActiveEdge);
                    addEdge(SN, nodeto);
                    addEdge(myActiveEdge.from, SN);
                }else{
                    myActiveEdge.to = nodeto;
                    postEdit("edge", "add", myActiveEdge);
                }

                invalidate();
                clear(gctx);
            }
        }
        deleteNode(mySel);
        mySel = null;
    }
    if(mySel != null && isDrag && (mySel.type != 'attack' && mySel.type != 'support') && (Math.abs(mySel.x-startx)>1 || Math.abs(mySel.y-starty)>1)) {
        postEdit("node", "move", mySel);
    }
    if(window.msel.length > 0 && isDrag && (Math.abs(mx-mstartx)>1 || Math.abs(my-mstarty)>1)){
        for (var i=0; i<window.msel.length; i++) {
            postEdit("node", "move", window.msel[i]);
        }
    }
    isDrag = false;
    isPan = false;
    canvas.onmousemove = null;
}

function myDblClick(e) {
    $('#contextmenu').hide();
    getMouse(e);
    clear(gctx);
    var l = nodes.length;
    for (var i = l-1; i >= 0; i--) {
        drawshape(gctx, nodes[i], 'w');
        var imageData = gctx.getImageData(mx, my, 1, 1);
        var index = (mx + my * imageData.width) * 4;

        // node clicked
        if (imageData.data[3] > 0) {
            mySel = nodes[i];
            editpopup(mySel);
            clear(gctx);
            return;
        }
    }
}

function myRClick(e) {
    $('#contextmenu').hide();
    getMouse(e);
    clear(gctx);
    var l = nodes.length;
    for (var i = l-1; i >= 0; i--) {
        drawshape(gctx, nodes[i], 'w');
        var imageData = gctx.getImageData(mx, my, 1, 1);
        var index = (mx + my * imageData.width) * 4;

        // node clicked
        if (imageData.data[3] > 0) {
            mySel = nodes[i];
            cmenu(mySel);
            clear(gctx);
            return false;
        }
    }
}

function pancanvas(){
    if(window.panup){
        document.getElementById('container').scrollTop = document.getElementById('container').scrollTop - (16+paninc);
    }
    if(window.pandown){
        document.getElementById('container').scrollTop = document.getElementById('container').scrollTop + (16+paninc);
    }
    if(window.panleft){
        document.getElementById('container').scrollLeft = document.getElementById('container').scrollLeft - (16+paninc);
    }
    if(window.panright){
        document.getElementById('container').scrollLeft = document.getElementById('container').scrollLeft + (16+paninc);
    }

    paninc = paninc + 2;
}

function myKeyDown(e) {
    if($('#modal-bg').is(":visible")){
        return;
    }

    keycode = e.keyCode;
    if(keycode == 16 || keycode == 83){
        edgeMode('on');
    }
    if(keycode == 65){
        edgeMode('atk');
    }
    if(keycode == 77 || keycode == 18){
        window.multisel = true;
    }

    if(keycode == 37 || keycode == 38 || keycode == 39 || keycode == 40){
        switch (keycode) {
        case 40:
            window.pandown = true;
            break;
        case 38:
            window.panup = true;
            break;
        case 37:
            window.panleft = true;
            break;
        case 39:
            window.panright = true;
            break;
        }

        if(panpress === null){
            panpress = setInterval(pancanvas, 40);
        }
    }
}

function myKeyUp(e) {
    if($('#modal-bg').is(":visible")){
        return;
    }

    keycode = e.keyCode;
    if(keycode == 16 || keycode == 83){
        edgeMode('off');
    }
    if(keycode == 65){
        edgeMode('off');
    }
    if(keycode == 77){
        window.multisel = false;
    }

    if(keycode == 37 || keycode == 38 || keycode == 39 || keycode == 40){
        switch (keycode) {
        case 40:
            window.pandown = false;
            break;
        case 38:
            window.panup = false;
            break;
        case 37:
            window.panleft = false;
            break;
        case 39:
            window.panright = false;
            break;
        }

        if(!(window.pandown || window.panup || window.panleft || window.panright)){
            clearTimeout(panpress);
            panpress = null;
            paninc = 0;
        }
    }
}

