function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

var ccolors = []
ccolors['r'] = ['#fbdedb','#e74c3c']
ccolors['g'] = ['#def8e9','#2ecc71']
ccolors['b'] = ['#ddeef9','#3498db']
ccolors['w'] = ['#e9eded','#95a5a6']
ccolors['y'] = ['#fdf6d9','#f1c40f']
ccolors['p'] = ['#eee3f3','#9b59b6']
ccolors['o'] = ['#fbeadb','#e67e22']
ccolors['t'] = ['#dcfaf4','#1abc9c']

var bcolors = []
bcolors['r'] = ['#ffffff','#333333']
bcolors['g'] = ['#ffffff','#333333']
bcolors['b'] = ['#ffffff','#333333']
bcolors['w'] = ['#ffffff','#333333']
bcolors['y'] = ['#ffffff','#333333']
bcolors['p'] = ['#ffffff','#333333']
bcolors['o'] = ['#ffffff','#333333']
bcolors['t'] = ['#ffffff','#333333']

function roundRect(context, x, y, r, w, h, fill, stroke_w, stroke_color) {
    context.beginPath();
    context.rect(x,y,w,h);
    context.fillStyle = fill;
    context.fill();
    context.lineWidth = stroke_w;
    context.strokeStyle = stroke_color;
    context.stroke();
}

function drawhelp(context) {
    var help_text = ['Click on the canvas to add a node',
                     'Double click a node to edit',
                     'Shift+click and drag between nodes to join with edges'];

    l_height = 30;
    t_height = help_text.length/2 * l_height;
    var cfont = context.font;

    context.textAlign = "center";
    context.fillStyle = "#888";
    context.font = "14pt Arial";

    for(var i=0;i<help_text.length;i++){
        var text_line = help_text[i]
        context.fillText(text_line, window.containerW/2, window.containerH/2+(28*i)-t_height/2);
    }

    context.font = cfont;
    
}

function drawshape(context, shape, color) {
    if(window.bwmode){
        colors = bcolors;
    }else{
        colors = ccolors;
    }
    // Skip drawing elements that have moved off screen:
    if (shape.x > WIDTH || shape.y > HEIGHT) return; 
    if (shape.x + shape.w < 0 || shape.y + shape.h < 0) return;
    if (shape.type == 'support' || shape.type == 'attack'){
        shape.w=10; shape.h=10;
        return;
    }

    if(shape.imgurl === undefined || shape.imgurl == ''){
        var phraseArray = []
        max_width = 200;
        shape.w = max_width;
        radius = 5;

        if(context.measureText(shape.text).width > max_width){
            var wa=shape.text.split(" "), lastPhrase="", measure=0;
            for (var i=0;i<wa.length;i++) {
                var word=wa[i];
                measure=ctx.measureText(lastPhrase+word).width;
                if(measure<shape.w-30) {
                    lastPhrase+=(" "+word);
                }else{
                    phraseArray.push(lastPhrase);
                    max_width = (max_width < measure) ? measure : max_width
                    lastPhrase=word;
                }
                if (i===wa.length-1) {
                    phraseArray.push(lastPhrase);
                    max_width = (max_width < measure) ? measure : max_width
                    node_width = (shape.w-30 < max_width) ? max_width+30 : shape.w
                    break;
                }
            }
            shape.h = 10 + (phraseArray.length*20)
        }else{
            phraseArray.push(shape.text)
            shape.w = 30 + Math.ceil(ctx.measureText(shape.text).width)
            shape.h = 30
        }

        if(window.msel.length > 0){
            seld = false;
            for (var i=0; i<window.msel.length; i++) {
                if(window.msel[i].id == shape.id){
                    seld = true;
                    roundRect(context, shape.x, shape.y, radius, shape.w, shape.h, colors[color][0], 2, colors[color][1]);
                }
            }
            if(seld == false){
                roundRect(context, shape.x, shape.y, radius, shape.w, shape.h, colors[color][0], 1, colors[color][1]);
            }
        }else if(mySel == shape) {
            roundRect(context, shape.x, shape.y, radius, shape.w, shape.h, colors[color][0], 2, colors[color][1]);
        }else{
            roundRect(context, shape.x, shape.y, radius, shape.w, shape.h, colors[color][0], 1, colors[color][1]);
        }

        for(var i=0;i<phraseArray.length;i++){
            var text_line = phraseArray[i]
            context.textAlign = "center";
            context.fillStyle = "#333";
            var fsize = "8"
            var ffamily = "Arial";
            if("fs" in getUrlVars()){
                fsize = getUrlVars()["fs"];
            }
            if("ff" in getUrlVars()){
                ffamily = getUrlVars()["ff"];
            }
            context.font = fsize + "pt " + ffamily;
            context.fillText(text_line, shape.x+(shape.w/2), shape.y+(20*i)+18);
        }
    }else{
        radius = 5

        shape.w = parseInt(shape.imgw) + 30
        shape.h = parseInt(shape.imgh) + 30

        roundRect(context, shape.x, shape.y, radius, shape.w, shape.h, colors[color][0], 2, colors[color][1]);

        images[shape.imgurl] = new Image();
        images[shape.imgurl].onload = function(){
            context.drawImage(images[shape.imgurl], shape.x+15, shape.y+15)
        }
        images[shape.imgurl].src = shape.imgurl;
    }
}

function drawedge(context, edge) {
    context.strokeStyle = '#666';
    context.fillStyle = '#666';
    mxf = edge.from.x + (edge.from.w/2);
    mxt = edge.to.x + (edge.to.w/2);
    myf = edge.from.y + (edge.from.h/2);
    myt = edge.to.y + (edge.to.h/2);
    curve_offset = 80;
    arrow_length = 10;
    arrow_width = 10;

    if(Math.abs(myf-myt) > Math.abs(mxf-mxt)) { // join top to bottom
        if(myf>myt){ // from below to
            if(myf-myt < curve_offset*2){
                curve_offset = (myf-myt)/2;
            }
            efy = edge.from.y;
            ety = edge.to.y+edge.to.h;
            cp1y = efy-curve_offset;
            cp2y = ety+curve_offset;
            arrow_offset = arrow_length;
        }else{
            if(myt-myf < curve_offset*2){
                curve_offset = (myt-myf)/2;
            }
            efy = edge.from.y+edge.from.h;
            ety = edge.to.y;
            cp1y = efy+curve_offset;
            cp2y = ety-curve_offset;
            arrow_offset = 0-arrow_length;
        }
        fromleft = edge.from.x
        fromright = edge.from.x + edge.from.w
        toleft = edge.to.x
        toright = edge.to.x + edge.to.w
        if(fromleft+5 > toright-5){
            efx = fromleft+5;
            etx = toright-5;
        }else if(fromright-5 < toleft+5){
            efx = fromright-5;
            etx = toleft+5;
        }else{
            efx = edge.from.x+(edge.from.w * (1-((fromright-toleft-5)/(edge.from.w+edge.to.w-10))));
            etx = edge.to.x+(edge.to.w * ((fromright-toleft-5)/(edge.from.w+edge.to.w-10)));
        }
        cp1x = efx;
        cp2x = etx;
        arrow2 = [etx+(arrow_width/2), ety+arrow_offset];
        arrow3 = [etx-(arrow_width/2), ety+arrow_offset];
    }else{ // join side to side
        if(mxf>mxt){ // from right of to
            if(mxf-mxt < curve_offset*2){
                curve_offset = (mxf-mxt)/2;
            }
            efx = edge.from.x;
            etx = edge.to.x+edge.to.w;
            cp1x = efx-curve_offset;
            cp2x = etx+curve_offset;
            arrow_offset = arrow_length;
        }else{
            if(mxt-mxf < curve_offset*2){
                curve_offset = (mxt-mxf)/2;
            }
            efx = edge.from.x+edge.from.w;
            etx = edge.to.x;
            cp1x = efx+curve_offset;
            cp2x = etx-curve_offset;
            arrow_offset = 0-arrow_length;
        }
        frombottom= edge.from.y 
        fromtop = edge.from.y + edge.from.h
        tobottom = edge.to.y
        totop = edge.to.y + edge.to.h
        if(frombottom+5 > totop-5){
            efy = frombottom+5;
            ety = totop-5;
        }else if(fromtop-5 < tobottom+5){
            efy = fromtop-5;
            ety = tobottom+5;
        }else{
            efy = edge.from.y+(edge.from.h * (1-((fromtop-tobottom-5)/(edge.from.h+edge.to.h-10))));
            ety = edge.to.y+(edge.to.h * ((fromtop-tobottom-5)/(edge.from.h+edge.to.h-10)));
        }
        cp1y = efy;
        cp2y = ety;
        arrow2 = [etx+arrow_offset, ety+(arrow_width/2)];
        arrow3 = [etx+arrow_offset, ety-(arrow_width/2)];
    }
    arrow1 = [etx,ety];



    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(efx,efy);
    context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, etx, ety)
    context.stroke();
    
    ctx.beginPath();
    ctx.moveTo(arrow1[0],arrow1[1]);
    ctx.lineTo(arrow2[0],arrow2[1]);
    ctx.lineTo(arrow3[0],arrow3[1]);
    ctx.fill();
}


function editpopup(node) {
    $('#n_text').hide(); $('#n_text_label').hide();
    $('#s_type').hide(); $('#s_type_label').hide();
    $('#s_ischeme').hide(); $('#s_ischeme_label').hide();
    $('#s_cscheme').hide(); $('#s_cscheme_label').hide();
    $('#s_lscheme').hide(); $('#s_lscheme_label').hide();
    $('#s_mscheme').hide(); $('#s_mscheme_label').hide();
    $('#s_pscheme').hide(); $('#s_pscheme_label').hide();
    $('#s_tscheme').hide(); $('#s_tscheme_label').hide();
    $('#descriptor_selects').hide();
    $('#cq_selects').hide();
    $('#s_sset').hide(); $('#s_sset_label').hide();

    if(node.type == 'I' || node.type == 'L'){
        $('#n_text').show();
        $('#n_text_label').show();
    }else{
        nodesIn = getNodesIn(node);

        var addRA = true;
        var addCA = true;
        var addYA = false;
        var addTA = true;
        var addPA = true;
        var addMA = true;

        for(var i = 0; i < nodesIn.length; i++){
            if(nodesIn[i].type == 'L' || nodesIn[i].type == 'TA'){
                addYA = true;
            }
        }

        $('#s_type').empty();
        if(addRA){
            $('#s_type').append('<option value="RA">RA</option>');
        }
        if(addCA){
            $('#s_type').append('<option value="CA">CA</option>');
        }
        if(addYA){
            $('#s_type').append('<option value="YA">YA</option>');
            }
        if(addTA){
            $('#s_type').append('<option value="TA">TA</option>');
        }
        if(addMA){
            $('#s_type').append('<option value="MA">MA</option>');
            }
        if(addPA){
            $('#s_type').append('<option value="PA">PA</option>');
        }

        $('#s_type').show();
        $('#s_type_label').show();
        $('#s_type').val(node.type);

        if(node.scheme == 0){
            //$('#node_edit').height(180);
        }else{
            setdescriptors(node.scheme, node);
            //$('#node_edit').height(350);
            $('#descriptor_selects').show();
        }

        if(node.type == 'RA'){
            $('#s_sset').show(); $('#s_sset_label').show();
            $('#s_ischeme').show();
            $('#s_ischeme_label').show();
            $('#s_ischeme').val(node.scheme);
        }else if(node.type == 'CA'){
            $('#s_sset').show(); $('#s_sset_label').show();
            $('#s_cscheme').show();
            $('#s_cscheme_label').show();
            $('#s_cscheme').val(node.scheme);
        }else if(node.type == 'YA'){
            $('#s_sset').show(); $('#s_sset_label').show();
            $('#s_lscheme').show();
            $('#s_lscheme_label').show();
            $('#s_lscheme').val(node.scheme);
        }else if(node.type == 'MA'){
            $('#s_sset').show(); $('#s_sset_label').show();
            $('#s_mscheme').show();
            $('#s_mscheme_label').show();
            $('#s_mscheme').val(node.scheme);
        }else if(node.type == 'PA'){
            $('#s_sset').show(); $('#s_sset_label').show();
            $('#s_pscheme').show();
            $('#s_pscheme_label').show();
            $('#s_pscheme').val(node.scheme);
        }else if(node.type == 'TA'){
            $('#s_sset').show(); $('#s_sset_label').show();
            $('#s_tscheme').show();
            $('#s_tscheme_label').show();
            $('#s_tscheme').val(node.scheme);
        }
    }

    $('#n_text').val(node.text);
    $('#modal-bg').show();
    $('#node_edit').slideDown(100, function() {
        $('#n_text').focus();
    });
}

function cmenu(node) {
    window.contextnode = node;
    $('#contextmenu').empty();
    $('#contextmenu').css({top: node.y+10, left: node.x+10});
    $('#contextmenu').append( "<a onClick='editpopup(window.contextnode);$(\"#contextmenu\").hide();'>Edit Node</a>" );
    if("plus" in getUrlVars() && node.type == 'I'){
        $('#contextmenu').append( "<a onClick='$(\"#locution_add\").show();$(\"#contextmenu\").hide();'>Add Locution</a>" );
    }
    $('#contextmenu').append( "<a onClick='deleteNode(window.contextnode);$(\"#contextmenu\").hide();'>Delete Node</a>" );
    if(window.msel.length > 0){
        $('#contextmenu').append( "<a onClick='dcEdges();$(\"#contextmenu\").hide();'>Delete Edges</a>" );
    }

    $('#contextmenu').show();
}


function showschemes(type) {
    if(type == 'RA'){
        $('#s_ischeme').show();
        $('#s_ischeme_label').show();
        $('#s_cscheme').hide();
        $('#s_cscheme_label').hide();
        $('#s_lscheme').hide();
        $('#s_lscheme_label').hide();
        $('#s_mscheme').hide();
        $('#s_mscheme_label').hide();
        $('#s_pscheme').hide();
        $('#s_pscheme_label').hide();
        $('#s_tscheme').hide();
        $('#s_tscheme_label').hide();
    }else if(type == 'CA'){
        $('#s_ischeme').hide();
        $('#s_ischeme_label').hide();
        $('#s_cscheme').show();
        $('#s_cscheme_label').show();
        $('#s_lscheme').hide();
        $('#s_lscheme_label').hide();
        $('#s_mscheme').hide();
        $('#s_mscheme_label').hide();
        $('#s_pscheme').hide();
        $('#s_pscheme_label').hide();
        $('#s_tscheme').hide();
        $('#s_tscheme_label').hide();
    }else if(type == 'YA'){
        $('#s_ischeme').hide();
        $('#s_ischeme_label').hide();
        $('#s_cscheme').hide();
        $('#s_cscheme_label').hide();
        $('#s_lscheme').show();
        $('#s_lscheme_label').show();
        $('#s_mscheme').hide();
        $('#s_mscheme_label').hide();
        $('#s_pscheme').hide();
        $('#s_pscheme_label').hide();
        $('#s_tscheme').hide();
        $('#s_tscheme_label').hide();
    }else if(type == 'MA'){
        $('#s_ischeme').hide();
        $('#s_ischeme_label').hide();
        $('#s_cscheme').hide();
        $('#s_cscheme_label').hide();
        $('#s_lscheme').hide();
        $('#s_lscheme_label').hide();
        $('#s_mscheme').show();
        $('#s_mscheme_label').show();
        $('#s_pscheme').hide();
        $('#s_pscheme_label').hide();
        $('#s_tscheme').hide();
        $('#s_tscheme_label').hide();
    }else if(type == 'PA'){
        $('#s_ischeme').hide();
        $('#s_ischeme_label').hide();
        $('#s_cscheme').hide();
        $('#s_cscheme_label').hide();
        $('#s_lscheme').hide();
        $('#s_lscheme_label').hide();
        $('#s_mscheme').hide();
        $('#s_mscheme_label').hide();
        $('#s_pscheme').show();
        $('#s_pscheme_label').show();
        $('#s_tscheme').hide();
        $('#s_tscheme_label').hide();
    }else if(type == 'TA'){
        $('#s_ischeme').hide();
        $('#s_ischeme_label').hide();
        $('#s_cscheme').hide();
        $('#s_cscheme_label').hide();
        $('#s_lscheme').hide();
        $('#s_lscheme_label').hide();
        $('#s_mscheme').hide();
        $('#s_mscheme_label').hide();
        $('#s_pscheme').hide();
        $('#s_pscheme_label').hide();
        $('#s_tscheme').show();
        $('#s_tscheme_label').show();
    }

}

