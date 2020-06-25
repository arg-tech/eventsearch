window.nodeIDcounter = 1;
window.unsaved = false;
window.multisel = false;

var nodes = [];
var edges = [];
var participants = [];
var images = [];

var msel = [];
var mselo = [];

var canvas;
var ctx;
var WIDTH, HEIGHT;
var INTERVAL = 20;  // how often, in milliseconds, we check to see if a redraw is needed

var isDrag = false;
var isPan = false;
var isMSel = false;
var mx, my; // mouse coordinates

var canvasValid = false;

var mySel;
var myActiveEdge;

var ghostcanvas;
var gctx;

var startx,starty;
var offsetx, offsety;
var panx,pany;

var lastedit = 0;

window.cqmode = false;
if("cq" in getUrlVars()){
    window.cqmode = true;
}

window.bwmode = false;
if("bw" in getUrlVars()){
    window.bwmode = true;
}

window.iatmode = false;
//if("iat" in getUrlVars()){
if("plus" in getUrlVars()){
    window.iatmode = true;
}


function postEdit(type, action, content){
    if(type == 'text'){
        $.post( "helpers/edit.php", { type: type, action: action, cnt: content, akey: window.akey, sessionid: window.sessionid } ).done(function( data ) {
            dt = JSON.parse(data);
            //lastedit = dt.last;
        });
    }else{
        if(content == null){
            alert("Error with "+type+" "+action);
        }else{
            //$.post( "helpers/edit.php", { type: type, action: action, cnt: JSON.stringify(content), akey: window.akey, sessionid: window.sessionid } ).done(function( data ) {
            //    dt = JSON.parse(data);
                //lastedit = dt.last;
            //});
        }
    }
    window.unsaved = true;
}

function updateAnalysis(){
    var path = 'helpers/edithistory.php?last='+lastedit+'&akey='+window.akey;

    $.get(path, function(data){
        edits = JSON.parse(data);
        eretry = [];
        for (i=0;i<edits.edits.length;i++){
            if(edits.edits[i].sessionid == window.sessionid){
                //do nothing for our own edits
            }else if(edits.edits[i].type == 'node' && edits.edits[i].action == 'add'){
                node = JSON.parse(edits.edits[i].content);
                updateAddNode(node);
            }else if(edits.edits[i].type == 'node' && edits.edits[i].action == 'delete'){
                node = JSON.parse(edits.edits[i].content);
                updateDelNode(node);
            }else if(edits.edits[i].type == 'node' && edits.edits[i].action == 'move'){
                node = JSON.parse(edits.edits[i].content);
                updateMoveNode(node);
            }else if(edits.edits[i].type == 'node' && edits.edits[i].action == 'edit'){
                node = JSON.parse(edits.edits[i].content);
                updateEditNode(node);
            }else if(edits.edits[i].type == 'edge' && edits.edits[i].action == 'add'){
                edge = JSON.parse(edits.edits[i].content);
                //s = updateAddEdge(edge);
                //if(s == false){
                    eretry.push([edge, 'add']);
                //}
            }else if(edits.edits[i].type == 'edge' && edits.edits[i].action == 'delete'){
                edge = JSON.parse(edits.edits[i].content);
                //updateDelEdge(edge);
		eretry.push([edge, 'del']);
            }else if(edits.edits[i].type == 'text' && edits.edits[i].action == 'edit'){
                updateEditText(edits.edits[i].content);
            }
            lastedit = edits.edits[i].editID;
            //doretry = eretry;
            //eretry = [];
            //for (j=0;j<doretry.length;j++){
            //    edge = doretry[j];
            //    s = updateAddEdge(edge);
            //    if(s == false){
            //        eretry.push(edge);
            //    }
            //}
        }
	doretry = eretry;
        eretry = [];
        for (j=0;j<doretry.length;j++){
            edge = doretry[j][0];
            op = doretry[j][1];
            if(op == 'add'){
	        s = updateAddEdge(edge);
	        if(s == false){
	            eretry.push(edge);
	        }
            }else{
                updateDelEdge(edge);
            }
        }
        setTimeout(updateAnalysis, 2000);
    });
}

function updateAddNode(node){
    window.nodeIDcounter = node.id + 1;
    nodes.push(node);
    invalidate();
}

function updateDelNode(node){
    var l = nodes.length;
    for (var i = l-1; i >= 0; i--) {
        if(nodes[i].id == node.id){
            nodes.splice(i,1);
            break;
        }
    }
    var l = edges.length;
    //alert(edges[0].to);
    for (var i = l-1; i >= 0; i--) {
        if(edges[i].to.id == node.id || edges[i].from.id == node.id){
            edges.splice(i,1);
        }
    }
    invalidate();
}

function updateMoveNode(node){
    var l = nodes.length;
    for (var i = l-1; i >= 0; i--) {
        if(nodes[i].id == node.id){
            nodes[i].x = node.x;
            nodes[i].y = node.y;
            break;
        }
    }
    invalidate();
}

function updateEditNode(node){
    var l = nodes.length;
    for (var i = l-1; i >= 0; i--) {
        if(nodes[i].id == node.id){
            nodes[i].color = node.color;
            nodes[i].text = node.text;
            nodes[i].type = node.type;
            nodes[i].scheme = node.scheme;
            nodes[i].descriptors = node.descriptors;
            nodes[i].imgurl = node.imgurl;
            nodes[i].participantID = node.participantID;
            nodes[i].visible = node.visible;
            break;
        }
    }
    invalidate();
}

function updateAddEdge(edge){
    var e = new Edge;
    e.from = getNodeById(edge.from.id);
    e.to = getNodeById(edge.to.id);
    if(e.from == null || e.to == null){
        return false;
    }else{
        e.visible = edge.visible;
        edges.push(e);
        invalidate();
    }
    return true;
}

function updateDelEdge(edge){
    var l = edges.length;
    for (var i = l-1; i >= 0; i--) {
        if(edges[i].to.id == edge.to.id && edges[i].from.id == edge.from.id){
            edges.splice(i,1);
            break;
        }
    }
    invalidate();
}

function updateEditText(txt){
    var iframe = document.getElementById('extsite');
    if(iframe.nodeName.toLowerCase() == 'div'){
        $('#ova_arg_area_div').html(txt);
    }
}

function viewport() {
    return {width: window.innerWidth || (document.documentElement || document.body).clientWidth, height: window.innerHeight || (document.documentElement || document.body).clientHeight};
}

function getRangeObject(selectionObject) {
    if(selectionObject.getRangeAt){
        return selectionObject.getRangeAt(0);
    }else{
        var range = document.createRange();
        range.setStart(selectionObject.anchorNode,selectionObject.anchorOffset);
        range.setEnd(selectionObject.focusNode,selectionObject.focusOffset);
        return range;
    }
}

function getSelText() {
    var iframe = document.getElementById('extsite');
    var txt = "";
    if(iframe.nodeName.toLowerCase() == 'div'){
        if(window.getSelection) {
            userSelection = window.getSelection();
        }else if(document.selection) {
            userSelection = document.selection.createRange();
        }
        if (userSelection.text){ // IE
            txt = userSelection.text;
        }else if(userSelection != ""){
            range = getRangeObject(userSelection);
            txt = userSelection.toString();
            var span = document.createElement("span");
            span.className="highlighted";
            span.id = "node"+window.nodeIDcounter;
            range.surroundContents(span);
            postEdit("text", "edit", $('#ova_arg_area_div').html());
        }
    }else{
        var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
        txt = iframe.contentWindow.getSelection().toString();
    }
    return txt;
}

function remhl(nodeID) {
    var span;
    if(span = document.getElementById("node"+nodeID)){
        var text = span.textContent || span.innerText;
        var node = document.createTextNode(text);
        span.parentNode.replaceChild(node, span);
    }
}

function hlcurrent(nodeID) {
    $(".highlighted").removeClass("hlcurrent");
    if(nodeID != 'none'){
        $("#node"+nodeID).addClass("hlcurrent");
        if($("#node"+nodeID).length != 0) {
            $('#ova_arg_area_div').animate({
            scrollTop: $('#ova_arg_area_div').scrollTop() + $("#node"+nodeID).offset().top - 200
            }, 1000);
        }
    }
}

function getAllText() {
    var iframe = document.getElementById('extsite');
    if(iframe.nodeName.toLowerCase() == 'div'){
        txt = $('#ova_arg_area_div').html();
    }else{
        var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
        txt = "";
    }
    return txt;
}

function setAllText(txt) {
    var iframe = document.getElementById('extsite');
    if(iframe.nodeName.toLowerCase() == 'div'){
        $('#ova_arg_area_div').html(txt);
    }
}

function clearSelText() {
    var iframe = document.getElementById('extsite');
    if(iframe.nodeName.toLowerCase() == 'div'){
        if (window.getSelection) window.getSelection().removeAllRanges();
        else if (document.selection) document.selection.empty();
    }else{
        var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
        var sel = window.getSelection ? document.getElementById("extsite").contentWindow.getSelection() : document.selection;
        if (sel) {
            if (sel.removeAllRanges) {
                sel.removeAllRanges();
            } else if (sel.empty) {
                sel.empty();
            }
        }
    }
}

function Node() {
    this.id = 0;
    this.x = 0;
    this.y = 0;
    this.color = 'w';
    this.text = '';
    this.type = '';
    this.scheme = '';
    this.descriptors = {};
    this.cqdesc = {};
    this.visible = true;
    this.imgurl = '';
    this.participantID = 0;
    this.w = 0;
    this.h = 0;
}

function isSNode(node) {
    return (node.type == 'RA' || node.type == 'CA' || node.type == 'YA' || node.type == 'TA' || node.type == 'MA' || node.type == 'PA');
}

function addNode(x, y, color, text, type, visible, participantID) {
    visible = typeof visible !== 'undefined' ? visible : true;
    //ln = $('input[@name="ln"]:checked').val();
    lns = 'l';
    if(type == 'I'){
        var l = nodes.length;
        for (var i = 0; i < l; i++) {
            if(nodes[i].text == text && nodes[i].type == 'I'){
                return nodes[i];
            }
            if(nodes[i].id >= window.nodeIDcounter){
                window.nodeIDcounter = nodes[i].id + 1;
            }
        }
    }else{
        var l = nodes.length;
        for (var i = 0; i < l; i++) {
            if(nodes[i].id >= window.nodeIDcounter){
                window.nodeIDcounter = nodes[i].id + 1;
            }
        }
    }
    var node = new Node;
    node.id = window.nodeIDcounter;
    window.nodeIDcounter++;
    node.x = x; node.y = y;
    node.color = color;
    node.text = text;
    node.participantID = participantID.toString();

    if(type == 'RA'){
        node.text = 'Default Inference';
        node.scheme = '72';
    }else if(type == 'CA'){
        node.text = 'Default Conflict';
        node.scheme = '71';
    }else if(type == 'YA' && node.text != 'Analysing'){
        node.text = 'Default Illocuting';
        node.scheme = '168';
    }else if(type == 'YA' && node.text == 'Analysing'){
        node.scheme = '75';
    }else if(type == 'PA'){
        node.text = 'Default Preference';
        node.scheme = '161';
    }else if(type == 'MA'){
        node.text = 'Default Rephrase';
        node.scheme = '144';
    }else if(type == 'TA'){
        node.text = 'Default Transition';
        node.scheme = '82';
    }else{
        node.scheme = '0';
    }

    node.type = type;
    node.visible = visible;
    nodes.push(node);

    if((lns == 'l' && node.type == 'L') || (lns == 'ls' && (node.type == 'L' || isSNode(node))) || (lns == 'all')){
        if(visible && text != ""){
            analysisltxt = window.afirstname + ': ' + node.text;
            analysisya = addNode(x, -50, 'w', 'Analysing', 'YA', false, 0);
            analysisl = addNode(x, -50, 'w', analysisltxt, 'L', false, 0);
            addEdge(analysisya, node, false);
            addEdge(analysisl, analysisya, false);
        }
    }

    var url = getUrlVars()["url"];

    if(url != 'local' && node.type == 'I'){
        if(visible && text != ""){
            pubsltxt = url + ': ' + node.text;
            pubsya = addNode(x, -50, 'w', 'Publishing', 'YA', false, 0);
            pubsl = addNode(x, -50, 'w', pubsltxt, 'L', false, 0);
            addEdge(pubsya, node, false);
            addEdge(pubsl, pubsya, false);
        }
    }

    m = node.text.match(/^\\latex{([^}]*)}$/);
    if(m){
        $.post("helpers/tex2png.php", { "latex": m[1] }, function(data){
            obj = JSON.parse(data);
            if(obj.file != ""){
                node.imgurl = "helpers/"+obj.file;
                node.imgw = obj.width;
                node.imgh = obj.height;
                postEdit("node", "add", node);
                invalidate();
            }
        }).fail(function() { alert("Latex Error"); });
    }else if(node.type != 'support' && node.type != 'attack'){
        postEdit("node", "add", node);
    }

    invalidate();
    return node;
}

function editNode() {
    var clear = true;
    if(mySel.type == 'I' || mySel.type == 'L'){
        mySel.text = document.getElementById("n_text").value;
        if(mySel.text == ""){
            deleteNode(mySel);
        }else if(mySel.text.match(/^\\latex{([^}]*)}$/)){
            m = mySel.text.match(/^\\latex{([^}]*)}$/);
            clear = false;
            $.post("helpers/tex2png.php", { "latex": m[1] }, function(data){
                obj = JSON.parse(data);
                if(obj.file != ""){
                    mySel.imgurl = "helpers/"+obj.file;
                    mySel.imgw = obj.width;
                    mySel.imgh = obj.height;
                    mySel = null;
                    invalidate();
                }
            })
            .fail(function() { alert("error"); });
        }
    }else{
        mySel.type = document.getElementById("s_type").value;
        if(mySel.type == 'RA'){
            var ssel = document.getElementById("s_ischeme");
            mySel.scheme = ssel.value;
            mySel.color = 'g';
            if(ssel.selectedIndex == 0){
                mySel.text = 'Default Inference';
                mySel.scheme = '72';
            }else{
                mySel.text = ssel.options[ssel.selectedIndex].text;
            }
        }else if(mySel.type == 'CA'){
            var ssel = document.getElementById("s_cscheme");
            mySel.scheme = ssel.value;
            mySel.color = 'r';
            if(ssel.selectedIndex == 0){
                mySel.text = 'Default Conflict';
                mySel.scheme = '71';
            }else{
                mySel.text = ssel.options[ssel.selectedIndex].text;
            }
        }else if(mySel.type == 'YA'){
            var ssel = document.getElementById("s_lscheme");
            mySel.scheme = ssel.value;
            mySel.color = 'y';
            if(ssel.selectedIndex == 0){
                mySel.text = 'Default Illocuting';
                mySel.scheme = '168';
            }else{
                mySel.text = ssel.options[ssel.selectedIndex].text;
            }
        }else if(mySel.type == 'MA'){
            var ssel = document.getElementById("s_mscheme");
            mySel.scheme = ssel.value;
            mySel.color = 'o';
            if(ssel.selectedIndex == 0){
                mySel.text = 'Default Rephrase';
                mySel.scheme = '144';
            }else{
                mySel.text = ssel.options[ssel.selectedIndex].text;
            }
        }else if(mySel.type == 'PA'){
            var ssel = document.getElementById("s_pscheme");
            mySel.scheme = ssel.value;
            mySel.color = 't';
            if(ssel.selectedIndex == 0){
                mySel.text = 'Default Preference';
                mySel.scheme = '161';
            }else{
                mySel.text = ssel.options[ssel.selectedIndex].text;
            }
        }else if(mySel.type == 'TA'){
            var ssel = document.getElementById("s_tscheme");
            mySel.scheme = ssel.value;
            mySel.color = 'p';
            if(ssel.selectedIndex == 0){
	        mySel.text = 'Default Transition';
	        mySel.scheme = '82';
            }else{
                mySel.text = ssel.options[ssel.selectedIndex].text;
            }
        }else {
            mySel.color = 'y';
            mySel.text = mySel.type
        }
        $('.dselect').each(function(index) {
            mySel.descriptors[$(this).attr('id')] = $(this).val();
        });

        $('.cqselect').each(function(index) {
            mySel.cqdesc[$(this).attr('id')] = $(this).val();
        });
    }

    postEdit("node", "edit", mySel);

    if(clear){
        mySel = null;
    }
    invalidate();
}

function deleteNode(node) {
    var l = nodes.length;
    remhl(node.id);
    deleteEdge(null, node);
    for (var i = l-1; i >= 0; i--) {
        if(nodes[i] == node){
            nodes.splice(i,1);
            break;
        }
    }
    for (var i = 0; i < nodes.length; i++) {
        if((nodes[i].type != "I" && nodes[i].type != "L") || (nodes[i].type == "L" && nodes[i].text == "analyses")){
            gotfrom = false;
            gotto = false;
            for (var j = 0; j < edges.length; j++) {
                if(edges[j].from == nodes[i] && edges[j].to.visible){
                    gotfrom = true;
                }
                if(edges[j].to == nodes[i] && edges[j].from.visible){
                    gotto = true;
                }
            }
            if(!gotfrom || !gotto){
                deleteNode(nodes[i]);
            }
        }
    }

    if(node.type != 'support' && node.type != 'attack'){
        postEdit("node", "delete", node);
    }

    invalidate();
}

function getNodeById(id) {
    var l = nodes.length;
    for (var i = l-1; i >= 0; i--) {
        if(nodes[i].id == id){
            return nodes[i];
        }
    }
    return null;
}

function getNodeByText(text) {
    var l = nodes.length;
    for (var i = l-1; i >= 0; i--) {
        if(nodes[i].text == text){
            return nodes[i];
        }
    }
    return null;
}

function addLocution(node) {
    if($('#p_firstname').val() != ''){
        firstname = $('#p_firstname').val();
        surname = $('#p_surname').val();
        $('#p_firstname').val('');
        $('#p_surname').val('');
        addParticipant(firstname,surname);
        participantID = participants.length;
    }else{
        participantID = $('#p_select').val();
        participant = participants[participantID-1];
        firstname = participant.firstname;
        surname = participant.surname;
    }

    random=Math.floor(Math.random()*101);
    random=random-50;

    if(node.type == 'L' && window.iatmode){
        yax = node.x-200;
        if(yax < 0){ yax = 0; }
        yay = node.y;
        YA = addNode(yax, yay, 'y', 'YA', 'YA', true, 0);
        YA.text = 'Asserting';
        YA.scheme = '74';
        inx = yax-200;
        if(inx < 0){ inx = 0; }
        iny = yay;
        IN = addNode(inx, iny, 'b', node.text, 'I', true, 0);
        ltext = firstname+ ' ' + surname + ' : '+node.text;
        node.text = ltext;
	node.visible = true;
        node.participantID = participantID.toString();
        postEdit("node", "edit", node);
        addEdge(YA, IN);
        addEdge(node, YA);
	analysisltxt = window.afirstname + ': ' + node.text;
	analysisya = addNode(node.x, -50, 'w', 'Analysing', 'YA', false, 0);
	analysisl = addNode(node.x, -50, 'w', analysisltxt, 'L', false, 0);
	addEdge(analysisya, node, false);
	addEdge(analysisl, analysisya, false);
        mySel = null;
        mySel = YA;
        editpopup(YA);
    }else{
        yax = node.x+200;
        yay = node.y+random;
        YA = addNode(yax, yay, 'y', 'YA', 'YA', true, 0);
        lnx = yax+200;
        lny = yay;
        ltext = firstname+ ' ' + surname + ' : '+node.text;
        LN = addNode(lnx, lny, 'b', ltext, 'L', true, participantID);
        addEdge(YA, node);
        addEdge(LN, YA);
    }

    var url = getUrlVars()["url"];
    if(url != 'local' && node.type == 'I'){
        for (var j = 0; j < edges.length; j++) {
            if(edges[j].to == node && edges[j].from.text == "Publishing"){
                tmpfrom = edges[j].from;
                deleteEdge(edges[j], null);
                addEdge(tmpfrom, LN, false);
            }
        }
    }
}

function getNodesIn(node) {
    var nlist = [];
    var l = edges.length;
    for (var i = 0; i < l; i++) {
        if(edges[i].to == node) {
            nlist.push(edges[i].from);
        }
    }
    return nlist;
}

function getNodesOut(node) {
    var nlist = [];
    var l = edges.length;
    for (var i = 0; i < l; i++) {
        if(edges[i].from == node) {
            nlist.push(edges[i].to);
        }
    }
    return nlist;
}


function Edge() {
    this.from = null;
    this.to = null;
    this.visible = true;
}

function addEdge(from, to, visible) {
    visible = typeof visible !== 'undefined' ? visible : true;
    var edge = new Edge;
    edge.from = from;
    edge.to = to;
    edge.visible = visible;
    if(window.eBtn){
        edgeMode('off');
        window.eBtn = false;
    }
    edges.push(edge);

    if(to.type != 'support' && to.type != 'attack'){
        postEdit("edge", "add", edge);
    }

    invalidate();
    return edge;
}

function dcEdges() {
    var l = edges.length;
    for (var i = l-1; i >= 0; i--) {
        gotto = $.grep(window.msel, function(obj) {
            return obj.id == edges[i].to.id;
        });

        gotfrom = $.grep(window.msel, function(obj) {
            return obj.id == edges[i].from.id;
        });

        if(gotto.length>0 && gotfrom.length>0) {
            postEdit("edge", "delete", edges[i]);
            edges.splice(i,1);
        }
    }

    invalidate();
}


function deleteEdge(edge, node) {
    if(edge !== null){
        var l = edges.length;
        for (var i = l-1; i >= 0; i--) {
            if(edges[i] == edge){
                if(edges[i].to.type != 'support' && edges[i].to.type != 'attack'){
                    postEdit("edge", "delete", edge);
                }
                edges.splice(i,1);
                return;
            }
        }
    }
    if(node !== null){
        var l = edges.length;
        for (var i = l-1; i >= 0; i--) {
            if(edges[i].to == node || edges[i].from == node){
                if(edges[i].to.type != 'support' && edges[i].to.type != 'attack'){
                    postEdit("edge", "delete", edges[i]);
                }
                edges.splice(i,1);
            }
        }
    }

    invalidate();
}

function Participant() {
    this.id;
    this.firstname = '';
    this.surname = '';
}

function addParticipant(firstname, surname) {
    var p = new Participant;
    p.firstname = firstname;
    p.surname = surname;
    p.id = participants.length+1;
    $('#p_select').append($("<option/>", {
        value: p.id,
        text: firstname+" "+surname
    }));
    participants.push(p);
    return p;
}

function edgeMode(status) {
    if(status == 'switch' && window.shiftPress){
        status = 'atk';
        window.eBtn = true;
    }else if(status == 'switch' && window.altPress){
        status = 'off';
        window.eBtn = false;
    }else if(status == 'switch'){
        status = 'on';
        window.eBtn = true;
    }

    if(status == 'on'){
        window.altPress = false;
        window.shiftPress = true;
        canvas.style.cursor='crosshair';
        $('#eadd').removeClass("active attack support");
        $('#eadd').addClass("active support");
    }else if(status == 'off'){
        window.shiftPress = false;
        window.altPress = false;
        canvas.style.cursor='auto';
        $('#eadd').removeClass("active attack support");
    }else if(status == 'atk'){
        window.shiftPress = false;
        window.altPress = true;
        canvas.style.cursor='crosshair';
        $('#eadd').removeClass("active attack support");
        $('#eadd').addClass("active attack");
    }
}

function nodeMode(status) {
    if(status == 'switch' && window.nodeAdd){
        status = 'off';
    }else if(status == 'switch'){
        status = 'on';
    }

    if(status == 'on'){
        window.nodeAdd = true;
        canvas.style.cursor='crosshair';
        $('#nadd').addClass("active");
    }else{
        window.nodeAdd = false;
        canvas.style.cursor='auto';
        $('#nadd').removeClass("active");
    }
}


function Select_Value_Set(SelectName, Value) {
  eval('SelectObject = document.' +
    SelectName + ';');
  for(index = 0;
    index < SelectObject.length;
    index++) {
   if(SelectObject[index].value == Value)
     SelectObject.selectedIndex = index;
   }
}

var PIXEL_RATIO = (function () {
    var ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
              ctx.mozBackingStorePixelRatio ||
              ctx.msBackingStorePixelRatio ||
              ctx.oBackingStorePixelRatio ||
              ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
})();

function resize_canvas(neww,newh) {
    $('#c_neww').val(neww);
    $('#c_newh').val(newh);

    canvas = document.getElementById('canvas');
    ratio = PIXEL_RATIO;
    canvas.width = neww * ratio;
    canvas.height = newh * ratio;
    canvas.style.width = neww + "px";
    canvas.style.height = newh + "px";

    HEIGHT = canvas.height;
    WIDTH = canvas.width;

    ctx = canvas.getContext('2d');
    ctx.scale(ratio, ratio);

    ghostcanvas.height = HEIGHT;
    ghostcanvas.width = WIDTH;
    gctx = ghostcanvas.getContext('2d');

    minimap.width = (neww/20) * ratio;
    minimap.height = (newh/20) * ratio;
    minimap.style.width = (neww/20) + "px";
    minimap.style.height = (newh/20) + "px";
    mctx = minimap.getContext('2d');
    mctx.scale(0.05,0.05);

    invalidate();
}

function canvas_init() {
    w = viewport();
    canvas = document.getElementById('canvas');
    ratio = PIXEL_RATIO;
    HEIGHT = canvas.height;
    WIDTH = canvas.width;
    canvas.width = WIDTH * ratio;
    canvas.height = HEIGHT * ratio;
    canvas.style.width = WIDTH + "px";
    canvas.style.height = HEIGHT + "px";

    HEIGHT = canvas.height;
    WIDTH = canvas.width;

    ctx = canvas.getContext('2d');
    ctx.scale(ratio, ratio);
    ghostcanvas = document.createElement('canvas');
    ghostcanvas.height = HEIGHT;
    ghostcanvas.width = WIDTH;
    gctx = ghostcanvas.getContext('2d');

    //fixes a problem where double clicking causes text to get selected on the canvas
    canvas.onselectstart = function () { return false; }

    setInterval(draw, INTERVAL);

    canvas.oncontextmenu = myRClick;
    canvas.onmousedown = myDown;
    canvas.onmouseup = myUp;
    canvas.ondblclick = myDblClick;

    invalidate();
}

//wipes the canvas context
function clear(c) {
    c.clearRect(0, 0, WIDTH, HEIGHT);
}

function draw() {
    if (canvasValid == false) {
        clear(ctx);

        if(nodes.length == 0){
            drawhelp(ctx);
        }

        // draw all nodes
        var l = nodes.length;
        for (var i = 0; i < l; i++) {
            if(nodes[i].visible){
                drawshape(ctx, nodes[i], nodes[i].color);
            }
        }

        // draw all edges
        var l = edges.length;
        for (var i = 0; i < l; i++) {
            if(edges[i].visible && edges[i].to.visible && edges[i].from.visible){
                drawedge(ctx, edges[i]);
            }
        }

        if(isMSel) {
            msdx = msbendx - msbstartx;
            msdy = msbendy - msbstarty;
            ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
            ctx.fillRect(msbstartx, msbstarty, msdx, msdy);
        }

        canvasValid = true;
    }
}

function invalidate() {
  canvasValid = false;
}

function getMouse(e) {
    offset = $('#canvas').offset();
    mx = e.pageX - offset.left;
    my = e.pageY - offset.top;
}

function addCQ(fesel) {
    fename = fesel.id.substring(2);
    if(fesel.selectedIndex == 0){
        $('#cqi-'+fename).css('color', '#c0392b');
    }else{
        $('#cqi-'+fename).css('color', '#27ae60');
    }
}

function setdescriptors(schemeID, node) {
    document.getElementById("descriptor_selects").style.display = "block";
    //document.getElementById("node_edit").style.height = "350px";

    /*$.getJSON("browserint.php?x=ipxx&url="+window.DBurl+"/formedges/scheme/"+schemeID, function(json_data){
        $('#descriptor_selects').empty();
        $('#descriptor_selects').append('<b>Descriptors</b>');
        $('#cq_selects').empty();
        var nodes_in = getNodesIn(node);
        var nodes_out = getNodesOut(node);
        var adddesc = false;
        var addcq = false;
        window.editnode = node;

        var l = nodes.length;
        var nodeselect = $('<select class="cqselect" onChange="addCQ(this);" style="display:none;"></select>');
        nodeselect.append('<option value="-">Click to select</option>');
        var ucselect = $('<select class="cqselect" onChange="addCQ(this);" style="display:none;"></select>');
        ucselect.append('<option value="-">Click to select</option>');
        for(index in nodes_in){
            nin = nodes_in[index];
            if(nin.type == 'I' || nin.type == 'L'){
                nodeselect.append('<option value="' + nin.text + '">' + nin.text + '</option>');
            }else{
                nodes_in_in = getNodesIn(nin);
                for(inindex in nodes_in_in){
                    ninin = nodes_in_in[inindex];
                    if(ninin.type == 'I'){
                        ucselect.append('<option value="' + ninin.text + '">' + ninin.text + '</option>');
                    }
                }
            }
        }

        for(index in json_data.formedges) {
            adddesc = true;
            formedge = json_data.formedges[index];

            if(formedge.Explicit == 1){
                selected = node.descriptors['s_'+formedge.name];
                var newselect = $('<select id="s_'+formedge.name+'" class="dselect" onChange="addCQ(this);"></select>');
                newselect.append('<option value="-">Click to select</option>');

                if(formedge.CQ != null){
                    addcq = true;
                    $('#cq_selects').prepend('<div style="clear:both"><strong>Q: </strong>'+formedge.CQ+' <div style="color:#c0392b; float:right; font-size:22px; margin-top:-8px;" id="cqi-'+formedge.name+'">&#x25CF;</div></div>');
                }

                if(formedge.formEdgeTypeID in {'1':'','5':'','9':'','11':'','13':'','15':'','16':'','20':'','22':''}){
                    for(index in nodes_in) {
                        nin = nodes_in[index];
                        if(nin.type == 'I' || nin.type == 'L'){
                            if(nin.text == selected){
                                $('#cqi-'+formedge.name).css('color', '#27ae60');
                                newselect.append('<option value="' + nin.text + '" selected="selected">' + nin.text + '</option>');
                            }else{
                                newselect.append('<option value="' + nin.text + '">' + nin.text + '</option>');
                            }
                        }
                    }
                }else if(formedge.formEdgeTypeID in {'2':'','7':'','10':'','12':'','14':'','17':'','21':''}){
                    for(index in nodes_out) {
                        nut = nodes_out[index];
                        if(nut.text == selected){
                            newselect.append('<option value="' + nut.text + '" selected="selected">' + nut.text + '</option>');
                        }else{
                            newselect.append('<option value="' + nut.text + '">' + nut.text + '</option>');
                        }
                    }
                }else{
                    continue;
                }

                $('#descriptor_selects').append('<label id="">'+formedge.name+'</label>');
                $('#descriptor_selects').append(newselect);
            }else{
                if(formedge.CQ != null){
                    addcq = true;
                    $('#cq_selects').append('<div style="clear:both"><strong>Q: </strong>'+formedge.CQ+' <div style="color:#c0392b; float:right; font-size:22px; margin-top:-8px;" id="cqi-'+formedge.name+'"><a href="" onClick="$(\'#cq'+formedge.name+'\').toggle();$(this).html($(this).text()==\'&#x25BE;\'?\'&#x25B4;\':\'&#x25BE;\');return false;" style="color:#444;text-decoration:none;font-size:16px;">&#x25BE;</a>&#x25CF;</div></div>');
                    if(formedge.descriptorID != null){
                        nsclone = nodeselect.clone().prop('id', 'cq'+formedge.name);
                    }else{
                        nsclone = ucselect.clone().prop('id', 'cq'+formedge.name);
                    }
                    $('#cq_selects').append(nsclone);
                    if('cq'+formedge.name in node.cqdesc && node.cqdesc['cq'+formedge.name] != '-'){
                        $('#cqi-'+formedge.name).css('color', '#27ae60');
                        $("#cq"+formedge.name+" option").filter(function() {
                            return $(this).text() == node.cqdesc['cq'+formedge.name];
                        }).prop('selected', true);
                    }
                }
            }
        }

        if(!adddesc){
            $('#descriptor_selects').hide();
        }

        if(window.cqmode && addcq){
            $('#cq_selects').prepend('<b>Critical Questions</b>');
            $('#cq_selects').show();
        }else{
            $('#cq_selects').hide();
        }
    });*/
}

function getsocial() {
    $.getJSON("social.json", function(json_data){
        for(i in json_data.users) {
            user = json_data.users[i];
            uimg = '<img src="res/img/avatar_blank.gif" />';
            for(j in user.info){
                if(user.info[j].name == 'Avatar'){
                    uimg = '<img src="'+user.info[j].value+'" />'
                }
            }
            $('<a href="#" class="pselname" onClick="$(\'#p_firstname\').val(\''+user.firstname+'\');$(\'#p_surname\').val(\''+user.surname+'\');addlclick(true);return false;">'+uimg+user.firstname+' '+user.surname+'</a>').appendTo('#socialusers');
            addParticipant(user.firstname,user.surname);
        }
        $('<a href="#" style="padding-left: 56px;" onClick="newprt();return false;">+ Add new</a>').appendTo('#socialusers');
    });
}

function newprt() {
    $('#socialusers').hide();
    $('#prt_name').hide();
    $('#p_sel_wrap').hide();

    var np_name = $('#p_name').val();
    splt = np_name.split(' ');
    np_firstname = splt.shift();
    np_surname = splt.join(' ');

    $('#p_firstname').val(np_firstname);
    $('#p_surname').val(np_surname);

    $('#new_participant').show();

    return false;
}

function addlclick(skipcheck){
    if($('#p_select').val() == '-' && !skipcheck){
        if($('#prt_name').is(':visible')){
            newprt();
            return false;
        }
        if($('#p_firstname').val() == ''){
            $('#p_firstname').css('border-color', '#f00');
            return false;
        }else{
            $('#p_firstname').css('border-color', '#bbb');
        }
        if($('#p_surname').val() == ''){
            $('#p_surname').css('border-color', '#f00');
            return false;
        }else{
            $('#p_surname').css('border-color', '#bbb');
        }
    }
    addLocution(mySel);
    $('#new_participant').hide();
    $('#p_sel_wrap').show();
    $('#p_select').val('-');
    $('#p_name').val('');
    $('#prt_name').show();
    $('#locution_add').hide();
    $('#socialusers').hide();
    $('#modal-bg').hide();

    return false;
}

function addlcancel(){
    $('#new_participant').hide();
    $('#p_sel_wrap').show();
    $('#p_select').val('-');
    $('#p_name').val('');
    $('#prt_name').show();
    $('#socialusers').hide();
    $('#locution_add').hide();
    $('#modal-bg').hide();

    return false;
}

function pfilter(element) {
    var value = $(element).val();
    var rgval = new RegExp(value, "i");
    showing = 0;

    ipsn = $('#p_name').position();
    ih = $('#p_name').outerHeight();
    st = ipsn.top + ih;
    $('#socialusers').css({ "top": st+"px", "left": ipsn.left+"px" });

    $(".pselname").each(function() {
        if ($(this).text().search(rgval) > -1) {
            $(this).show();
            showing = showing + 1;
        } else {
            $(this).hide();
        }
    });

    if(showing > 0 && showing < 15){
        $('#socialusers').show();
    }else{
        $(".pselname").hide();
        $('#socialusers').show();
    }
}

function filterschemes(schemesetID) {
    $("#s_cscheme option").each(function() {
        $(this).show();
    });

    $("#s_ischeme option").each(function() {
        $(this).show();
    });

    $("#s_lscheme option").each(function() {
        $(this).show();
    });

    $("#s_mscheme option").each(function() {
        $(this).show();
    });

    $("#s_pscheme option").each(function() {
        $(this).show();
    });

    $("#s_tscheme option").each(function() {
        $(this).show();
    });

    if(schemesetID != "0"){
        setschemes = window.ssets[schemesetID]

        $("#s_cscheme option").each(function() {
            if(setschemes.indexOf($(this).val()) == -1){
                $(this).hide();
            }
        });

        $("#s_ischeme option").each(function() {
            if(setschemes.indexOf($(this).val()) == -1){
                $(this).hide();
            }
        });

        $("#s_lscheme option").each(function() {
            if(setschemes.indexOf($(this).val()) == -1){
                $(this).hide();
            }
        });

        $("#s_mscheme option").each(function() {
            if(setschemes.indexOf($(this).val()) == -1){
                $(this).hide();
            }
        });

        $("#s_pscheme option").each(function() {
            if(setschemes.indexOf($(this).val()) == -1){
                $(this).hide();
            }
        });

        $("#s_tscheme option").each(function() {
            if(setschemes.indexOf($(this).val()) == -1){
                $(this).hide();
            }
        });
    }
}

var sort_by = function(field, reverse, primer){
    var key = function (x) {return primer ? primer(x[field]) : x[field]};
    return function (a,b) {
        var A = key(a), B = key(b);
        return ((A < B) ? -1 : (A > B) ? +1 : 0) * [-1,1][+!!reverse];
    }
}

function init() {
    $('#extsite').css({'height':(($(window).height())-($('#head-bar').height())-40)+'px'});
    $('#container').css({'height':(($(window).height())-($('#head-bar').height()))+'px'});
    $('#container').css({'width':(($(window).width())-($('#extsite').outerWidth())-40)+'px'});
    $('#modal-bg').css({'height':(($(window).height())-($('#head-bar').height()))+'px'});
    $('#modal-bg').css({'width':($('#container').width())+'px'});

    $(".modal-box").each(function( index ) {
        $(this).css({'right':(($('#container').width())/2-($(this).width())/2)+'px'});
    });
    $('#canvas').show();

    $( "#c_neww" ).blur(function() {
        if($('#c_neww').val() != '' && $('#c_newh').val() != ''){
            resize_canvas($('#c_neww').val(), $('#c_newh').val());
        }
    });

    $( "#c_newh" ).blur(function() {
        if($('#c_neww').val() != '' && $('#c_newh').val() != ''){
            resize_canvas($('#c_neww').val(), $('#c_newh').val());
        }
    });

    //scale for minimap box
    window.containerW = $('#container').width();
    window.containerH = $('#container').height();
    window.sessionid = $.now().toString()+Math.random().toString().substring(3,8);

    canvas_init();
    minimap_init();

    /*$.getJSON("browserint.php?x=ipxx&url="+window.DBurl+"/schemes/all/", function(json_data){
        console.log(json_data);
        schemes = json_data.schemes;
        schemes.sort(sort_by('name', true, function(a){return a.toUpperCase()}));
        for(index in schemes){
            scheme = schemes[index];
            scheme_name = scheme.name.replace(/([a-z])([A-Z])/g, "$1 $2");
            scheme_type = scheme.schemeTypeID

            if(scheme_type == 1 || scheme_type == 2 || scheme_type == 3 || scheme_type == 9){
                $('#s_ischeme').append('<option value="' + scheme.schemeID + '">' + scheme_name + '</option>');
            }else if(scheme_type == 4 || scheme_type == 5){
                $('#s_cscheme').append('<option value="' + scheme.schemeID + '">' + scheme_name + '</option>');
            }else if(scheme_type == 7 || scheme_type == 12){
                $('#s_lscheme').append('<option value="' + scheme.schemeID + '">' + scheme_name + '</option>');
            }else if(scheme_type == 11){
                $('#s_mscheme').append('<option value="' + scheme.schemeID + '">' + scheme_name + '</option>');
            }else if(scheme_type == 6){
                $('#s_pscheme').append('<option value="' + scheme.schemeID + '">' + scheme_name + '</option>');
            }else if(scheme_type == 8){
                $('#s_tscheme').append('<option value="' + scheme.schemeID + '">' + scheme_name + '</option>');
            }
        }
    });

    $.getJSON("browserint.php?x=ipxx&url="+window.SSurl, function(json_data){
        window.ssets = {};
        schemesets = json_data.schemesets;
        schemesets.sort(sort_by('name', true, function(a){return a.toUpperCase()}));
        for(index in schemesets){
            schemeset = schemesets[index];
            $('#s_sset').append('<option value="' + schemeset.id + '">' + schemeset.name + '</option>');
            window.ssets[schemeset.id] = schemeset.schemes;
        }
    });*/

    //updateAnalysis();

    $('#ova_arg_area_div').on('paste', function() {
        setTimeout(function(e) {
            var domString = "", temp = "";

            $("#ova_arg_area_div div").each(function()
            {
                temp = $(this).html();
                domString += ((temp == "<br>") ? "" : temp) + "<br>";
            });

            if(domString != ""){
                $('#ova_arg_area_div').html(domString);
            }

            var orig_text = $('#ova_arg_area_div').html();
            orig_text = orig_text.replace(/<br>/g, '&br&');
            orig_text = orig_text.replace(/<br \/>/g, '&br&');
            orig_text = orig_text.replace(/<span([^>]*)class="highlighted([^>]*)>([^>]*)<\/span>/g, "&span$1class=\"highlighted$2&$3&/span&");

            $('#ova_arg_area_div').html(orig_text);

            var repl_text = $('#ova_arg_area_div').text();
            repl_text = repl_text.replace(/&br&/g, '<br>');
            repl_text = repl_text.replace(/&span([^&]*)class="highlighted([^&]*)&([^&]*)&\/span&/g, "<span$1class=\"highlighted$2>$3</span>");

            $('#ova_arg_area_div').html(repl_text);
        }, 1);
    });

    window.addEventListener('keydown',myKeyDown,true);
    window.addEventListener('keyup',myKeyUp,true);
    document.getElementById('n_file').addEventListener('change', loadbutton, false);

    $(window).bind('beforeunload', function(){
        if(window.unsaved){
            return 'There are unsaved changes to your analysis.';
        }
    });

    getsocial();

    if("aifdb" in getUrlVars()){
        aifdbid = getUrlVars()["aifdb"];
        $.get('./db/'+aifdbid, function(data) {
            if(lastedit == 0){
                loadfile(data);
            }
        }).fail(function() {
            loadfromdb(aifdbid);
        });
    }

    w = viewport();
    if(w.width < 1100){
        $('#newa').hide();
        $('#savea').hide();
        $('#loada').hide();
        $('#stngs').hide();
        $('#alay').hide();
        $('#emenu').show();
    }

    $( window ).resize(function() {
        w = viewport();
        if(w.width < 1100){
            $('#newa').hide();
            $('#savea').hide();
            $('#loada').hide();
            $('#stngs').hide();
            $('#alay').hide();
            $('#emenu').show();
        }else{
            $('#newa').show();
            $('#savea').show();
            $('#loada').show();
            $('#stngs').show();
            $('#alay').show();
            $('#emenu').hide();
        }
    });
}

function nodeTut(){
    var intro = introJs();
      intro.setOptions({
        steps: [
          {
            element: '#s_type',
            intro: "Click here to change the node type."
          },
          {
            element: '#s_sset',
            intro: "Filter the list of available argumentation schemes by selecting a particular scheme set.",
          },
          {
            element: '#s_cscheme',
            intro: 'Select the argumentation scheme which this node corresponds to.',
          },
          {
            element: '#s_ischeme',
            intro: 'Select the argumentation scheme which this node corresponds to.',
          },
          {
            element: '#s_lscheme',
            intro: 'Select the argumentation scheme which this node corresponds to.',
          },
          {
            element: '#s_mscheme',
            intro: 'Select the argumentation scheme which this node corresponds to.',
          },
          {
            element: '#s_pscheme',
            intro: 'Select the argumentation scheme which this node corresponds to.',
          },
          {
            element: '#s_tscheme',
            intro: 'Select the argumentation scheme which this node corresponds to.',
          },
          {
            element: '#descriptor_selects',
            intro: "Assign schematic roles to each of the nodes.",
          },
          {
            element: '#cq_selects',
            intro: "Status of each Critical Question. For additional Critical Questions, click the down arrow to select the corresponding node. Critical Questions associated with undercutters can only be instantiated by undercutters; likewise, premises by premises.",
          },
          {
            element: '#n_text',
            intro: "Edit the text for this node."
          }
        ].filter(function(obj) { return $(obj.element).length && $(obj.element).is(':visible'); }),
        showStepNumbers: false
      });

      intro.start();
}

function locTut(){
    var intro = introJs();
      intro.setOptions({
        steps: [
          {
            element: '#p_select',
            intro: "Select from participants currently used in this analysis."
          },
          {
            element: '#p_name',
            intro: "Add a new participant. Start typing the participant's name to choose from people already in the Argument Web, or to add a new person.",
          }
        ].filter(function(obj) { return $(obj.element).length && $(obj.element).is(':visible'); }),
        showStepNumbers: false
      });

      intro.start();
}

function mainTut(){
    var intro = introJs();
      intro.setOptions({
        steps: [
          {
            element: 'iframe#extsite',
            intro: "<p>Highlight sections of text from the webpage to create a node.</p>",
            position: 'right',
          },
          {
            element: '#ova_arg_area_div',
            intro: "<p>Enter the text that you want to analyse here.</p><p>Select sections of text to create a node.</p>",
            position: 'right',
          },
          {
            element: '#container',
            intro: "<p>Enter the text that you want to analyse here.</p><p>Select sections of text to create a node.</p>",
            position: 'left',
          },
          {
            element: '#minimap',
            intro: "<p>An overview of the analysis can be seen here.</p><p>Drag the box to move around the canvas.</p>",
            position: 'left',
          },
          {
            element: '#nadd',
            intro: "Nodes with custom text (enthymemes) can be added by clicking here and then clicking on the canvas.",
            position: 'bottom-middle-aligned',
          },
          {
            element: '#eadd',
            intro: "<p>Edges can be added between nodes by clicking here, clicking on a node and dragging to the target node.</p><p>Click once for support or twice for conflict. Click again to cancel.</p><p>Edges can also be added by holding shift (support) or 'a' (conflict).</p>",
            position: 'bottom-middle-aligned',
          },
          {
            element: '#newa',
            intro: "<p>Click here to start a new analysis. Any changes since you last saved will be lost.</p>",
            position: 'bottom-middle-aligned',
          },
          {
            element: '#em_newa',
            intro: "<p>Click here to start a new analysis. Any changes since you last saved will be lost.</p>",
            position: 'left',
          },
          {
            element: '#savea',
            intro: "<p>Your analysis can be saved locally as either a JSON file, that can be re-opened in OVA, or an image.</p><p>Analyses can also be saved to AIFdb.</p>",
            position: 'bottom-middle-aligned',
          },
          {
            element: '#em_savea',
            intro: "<p>Your analysis can be saved locally as either a JSON file, that can be re-opened in OVA, or an image.</p><p>Analyses can also be saved to AIFdb.</p>",
            position: 'left',
          },
          {
            element: '#loada',
            intro: "<p>Click here to load a previous analysis saved in JSON format.</p>",
            position: 'bottom-middle-aligned',
          },
          {
            element: '#em_loada',
            intro: "<p>Click here to load a previous analysis saved in JSON format.</p>",
            position: 'left',
          },
          {
            element: '#alay',
            intro: "<p>Automatically layout your diagram.</p><p><strong>Warning:</strong>This will move any nodes that you have already positioned.</p>",
            position: 'bottom-middle-aligned',
          },
          {
            element: '#em_alay',
            intro: "<p>Automatically layout your diagram.</p><p><strong>Warning:</strong>This will move any nodes that you have already positioned.</p>",
            position: 'left',
          },
          {
            element: '#stngs',
            intro: "<p>Click here to change analysis settings.</p>",
            position: 'bottom-middle-aligned',
          },
          {
            element: '#em_stngs',
            intro: "<p>Click here to change analysis settings.</p>",
            position: 'left',
          },
          {
            element: '#linkicon',
            intro: "<p>Click here to share your analysis.</p><p>Shared analyses are collaborative and can be edited by multiple people.</p>",
            position: 'left',
          }
        ].filter(function(obj) { return $(obj.element).length && $(obj.element).is(':visible'); }),
        showStepNumbers: false
      });

      intro.start();
}
