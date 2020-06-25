window.keyjson = '';
window.keyurl = 'res/waltonkey.json';
window.qhistory = ['arg'];

function ask_setq(q) {
    window.qhistory.push(q);
    ask_updateq();
}

function ask_back() {
    window.qhistory.pop();
    ask_updateq();
}

function ask_showresult(c) {
    cq = window.qhistory[window.qhistory.length-1]
    qu = window.keyjson['questions'][cq];
    options = qu['options'];

    text = "<h4 style='color:#c00'>" + options[c]['result'] + "</h4>";
    text = text + '<a href="" class="ask-btn" onClick="ask_updateq();return false;">&laquo; Back</a>';
    text = text + ' &nbsp; <a href="" class="ask-btn" onClick=\'ask_set("' + options[c]['result'] + '");return false;\'>Use this scheme</a>';
    $('#ask-cont').html(text);
}

function ask_set(text1) {
    $("#s_ischeme option").attr('selected', false);
    $("#s_ischeme option").filter(function() {
        //may want to use $.trim in here
        return $(this).text() == text1;
    }).prop('selected', true);
    $('#ask_dialogue').hide();
    return false;
}

function ask_updateq() {
    cq = window.qhistory[window.qhistory.length-1]
    qu = window.keyjson['questions'][cq];

    text = JSON.stringify(qu);
    text = '';

    options = qu['options'];
    for (i = 0; i < options.length; ++i) {
        option = options[i];
        rt = option['text']

        if(option['resulttype'] == 'SS'){
            text = text + '<a href="" class="ask-opt" onClick="ask_setq(\'' + option['result'] + '\');return false;">' + rt + '</a>';
        }else{
            text = text + '<a href="" class="ask-opt" onClick="ask_showresult(\'' + i + '\');return false;">' + rt + '</a>';
        }
    }

    if(window.qhistory.length > 1){
        text = text + '<a href="" class="ask-btn" onClick="ask_back();return false;">&laquo; Back</a>';
    }


    $('#ask-cont').html(text);
}

function getunique(list) {
  var result = [];
  $.each(list, function(i, e) {
    if ($.inArray(e, result) == -1) result.push(e);
  });
  return result;
}

function ask_detail(node) {
    prems = [];
    conc = '';
    var nodes_in = getNodesIn(node);
    var nodes_out = getNodesOut(node);

    for(index in nodes_in){
        nin = nodes_in[index];
        if(nin.type == 'I' || nin.type == 'L'){
            prems.push('<li>' + nin.text);
        }
    }
    fprems = getunique(prems);
    premt = prems.join(" ");

    for(index in nodes_out){
        nout  = nodes_out[index];
        if(nout.type == 'I' || nout.type == 'L'){
            conc = '<li>' + nout.text;
        }
    }

    text = '<h4>Conclusion</h4><ul>' + conc + '</ul><h4>Premises</h4><ul>' + premt + '</ul>';
    $('#ask-detail').html(text);

}

function ask_init() {
    if(window.keyjson == ''){
        $.getJSON(window.keyurl, function(json) {
            window.qhistory = ['arg'];
            window.keyjson = json;
            ask_updateq();
        });
    }else{
        window.qhistory = ['arg'];
        ask_updateq();
    }
}
