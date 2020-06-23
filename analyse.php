<?php

?><!doctype html>
<html class="no-js" lang="">
    <head>
        <meta charset="utf-8">
        <title>OVA from ARG-tech</title>
        <meta name="description" content="">
        <link rel="stylesheet" href="res/css/reset.css">
        <link rel="stylesheet" href="res/css/main.css">
        <link rel="stylesheet" href="res/css/formstyle.css">
        <link rel="stylesheet" href="res/css/introjs.css">
	<link rel="stylesheet" href="res/css/ask.css">
        <script src="res/js/jquery-1.11.2.min.js"></script>
        <script src="res/js/ova_fn.js"></script>
        <script src="res/js/ova_draw.js"></script>
        <script src="res/js/ova_mmap.js"></script>
        <script src="res/js/ova_ctrl.js"></script>
        <script src="res/js/ova_init.js"></script>
        <script src="res/js/ova_save.js"></script>
        <script src="res/js/intro.min.js"></script>
	<script src="res/js/ask.js"></script>
        <script type="text/javascript">
            window.DBurl = '<?php echo $DBurl; ?>';
            window.SSurl = '<?php echo $SSurl; ?>';
            window.akey = '<?php echo $akey; ?>';
            <?php echo $anamejs; ?>
        </script>
    </head>

    <body onLoad="init();">
        <div id="head-bar">
            <img src="" onerror="" id="ova-logo" height="48" />
            <a href="" style="border:0px;margin-left:12px;"><img src="" /></a>
            <span class="csep"></span>
            <a href="" onClick="$('#extramenu').toggle(); return false;" class="cbtn" id="emenu" style="display:none;"><div class="cbtn-icon" style="background-image: url('res/img/icon_emenu.png');"></div>Menu</a>
            <span class="csep"></span>
            <a href="" onClick="save2db();return false;" class="cbtn" id="savea" data-step="7" data-intro="<p>Your analysis can be saved locally as either a JSON file, that can be re-opened in OVA, or an image.</p><p>Analyses can also be saved to AIFdb.</p>" data-position="bottom-middle-aligned"><div class="cbtn-icon" style="background-image: url('res/img/icon-savedb.png');"></div>Search AIFdb</a>
            <span class="csep"></span>
            <a href="" onClick="edgeMode('switch'); return false;" class="cbtn" id="eadd" data-step="5" data-intro="<p>Edges can be added between nodes by clicking here, clicking on a node and dragging to the target node.</p><p>Click once for support or twice for conflict. Click again to cancel.</p><p>Edges can also be added by holding shift (support) or 'a' (conflict).</p>" data-position="bottom-middle-aligned"><div class="cbtn-icon" style="background-image: url('res/img/icon_eadd.png');"></div>Add Edge</a>
            <a href="" onClick="nodeMode('switch'); return false;" class="cbtn" id="nadd" data-step="4" data-intro="Nodes with custom text (enthymemes) can be added by clicking here and then clicking on the canvas." data-position="bottom-middle-aligned"><div class="cbtn-icon" style="background-image: url('res/img/icon_nadd.png');"></div>Add Node</a>
        </div>

        <div id="container" data-step="2" data-intro="Click the canvas to add the selected text as a new node." data-position="left"> 
            <div id="contextmenu">
            </div>
            <canvas id="canvas" width="4000" height="4000" style="display: none;">
                This text is displayed if your browser does not support HTML5 Canvas.
            </canvas> 
            <canvas id="minimap" width="100" height="200" data-step="3" data-intro="<p>An overview of the analysis can be seen here.</p><p>Drag the box to move around the canvas.</p>" data-position="left" style="display:none;"> </canvas>
        </div>


        <div id="modal-bg" style="display:none;"> 
        </div>

        <?php if($source == "local"){ ?>
            <div id="extsite">
                <div id="ova_arg_area_div" contenteditable="true" data-step="1" data-intro="<p>Enter the text that you want to analyse here.</p><p>Select sections of text to create a node.</p>" data-position="right" style="display:none;">Enter your text here...</div>
            </div>
        <?php }else{ ?>
            <iframe style="display:none;" src="<?php echo $analysis; ?>" id="extsite" name="extsite" onLoad="$('#loadingmodal').hide();" style="width:35%;border-right:1px solid #666;" data-step="1" data-intro="<p>Highlight sections of text from the webpage to create a node.</p>" data-position="right"></iframe>
        <?php } ?>


        <div id="node_edit" class="modal-box">
            <div class="modal-title">
                <p>Edit Node</p>
                <a href="javascript:void(0);" class="helpbtn" onclick="nodeTut(); return false;">?</a>
            </div>
            <form id="f_node_edit" class="fstyle" style="width: 78%;">
                <label for="s_type" id="s_type_label">Type</label>
                <select id="s_type" onChange="showschemes(this.value);">
                    <option value="RA">RA</option>
                    <option value="CA">CA</option>
                </select>


                <label for="s_cscheme" id="s_cscheme_label">Scheme</label>
                <select id="s_cscheme" onChange="setdescriptors(this.value);">
                    <option value="0">-</option>
                </select>

                <label for="s_ischeme" id="s_ischeme_label">Scheme</label>
                <select id="s_ischeme" onChange="setdescriptors(this.value, mySel);">
                    <option value="0">-</option>
                </select>

                <label for="s_lscheme" id="s_lscheme_label">Scheme</label>
                <select id="s_lscheme" onChange="setdescriptors(this.value, mySel);">
                    <option value="0">-</option>
                </select>

                <label for="s_mscheme" id="s_mscheme_label">Scheme</label>
                <select id="s_mscheme" onChange="setdescriptors(this.value, mySel);">
                    <option value="0">-</option>
                </select>

                <label for="s_pscheme" id="s_pscheme_label">Scheme</label>
                <select id="s_pscheme" onChange="setdescriptors(this.value, mySel);">
                    <option value="0">-</option>
                </select>

		<label for="s_tscheme" id="s_tscheme_label">Scheme</label>
                <select id="s_tscheme" onChange="setdescriptors(this.value, mySel);">
                    <option value="0">-</option>
                </select>

		<p style="text-align: right;">

                </p>

                <label for="n_text" id="n_text_label">Text</label>
                <textarea id="n_text" name="n_text"></textarea>

                <div id="descriptor_selects" style="display:none;"></div>

                <div id="cq_selects" style="display:none;"></div>
            </form>
            <ul class="btnlist">
                <li><a href="#" onClick="deleteNode(mySel);$('#node_edit').hide();$('#modal-bg').hide();return false;" class="bgred"><div class="btnicn" style="background-image: url('res/img/icon-delnode.png');">&nbsp;</div> Delete Node</a></li>
                <?php if($pro){ ?>
                <li><a href="#" onClick="$('#node_edit').hide();$('#locution_add').show();return false;"><div class="btnicn" style="background-image: url('res/img/icon_ladd.png');">&nbsp;</div> Add Locution</a></li>
                <?php } ?>
            </ul>

            <div class="modal-btns">
                <a class="save" href="#" onClick="editNode();this.parentNode.parentNode.style.display='none';$('#modal-bg').hide(); return false;">&#x2714; Save</a>
                <a class="cancel" href="#" onClick="this.parentNode.parentNode.style.display='none';$('#modal-bg').hide(); return false;">&#10008; Cancel</a>
            </div>
        </div>

	<div id="ask_dialogue" class="modal-box">
            <div class="modal-title">
                <p>Argument Scheme Key</p>
            </div>

            <div style="height: 260px; padding: 10px;">
                <div id="ask-detail"></div>
                <div id="ask-cont"></div>
            </div>

            <div class="modal-btns">
                <a class="cancel" href="#" onClick="this.parentNode.parentNode.style.display='none'; return false;">&#10008; Cancel</a>
            </div>
        </div>

        <div id="locution_add" class="modal-box">
            <div class="modal-title">
                <p>Locution Details</p>
                <a href="javascript:void(0);" class="helpbtn" onclick="locTut(); return false;">?</a>
            </div>
            <form id="f_node_edit" class="fstyle">
                <div id="p_sel_wrap">
                    <p style="font-weight: bold; color: #999;">Existing Participants</p>
                    <label for="p_select" id="p_select_label">Participant</label>
                    <select id="p_select">
                        <option value="-">-</option>
                    </select>
                    <br />
                    <br />
                </div>

                <div id="prt_name">
                    <p style="font-weight: bold; color: #999;">New Participant</p>
                    <label for="p_name" id="p_name_label">Name</label>
                    <input id="p_name" name="p_name" class="itext" onkeyup="pfilter(this)" />
                </div>

                <div id="new_participant" style="display:none;">
                    <label for="p_firstname" id="p_firstname_label">Firstname</label>
                    <input id="p_firstname" name="p_firstname" />
                    <label for="p_surname" id="p_surname_label">Surname</label>
                    <input id="p_surname" name="p_surname" />
                </div>
                <!--<button type="button" onClick="addLocution(mySel);this.parentNode.parentNode.style.display='none';">Add Locution</button>-->
            </form>
            <div id="socialusers" style="display:none;"></div>

            <div class="modal-btns">
                <a class="save" href="#" onClick="addlclick(false); return false;">Add</a>
                <a class="cancel" href="#" onClick="addlcancel(); return false;">&#10008; Cancel</a>
            </div>
        </div>

        <div id="save_analysis" class="modal-box">
            <div class="modal-title">
                <p>Save Analysis</p>
            </div>
            <ul class="btnlist">
                <li><a href="#" onClick="save2file(); return false;"><div class="btnicn" style="background-image: url('res/img/icon-savefile.png');">&nbsp;</div> Save to local file</a></li>
                <li><a href="#" onClick="canvas2image(); return false;"><div class="btnicn" style="background-image: url('res/img/icon-saveimg.png');">&nbsp;</div> Save as image</a></li>
                <li><a href="#" onClick="save2db(); $('#save_analysis').hide(); return false;"><div class="btnicn" style="background-image: url('res/img/icon-savedb.png');">&nbsp;</div> Save to AIFdb</a></li>
            </ul>

            <div class="modal-btns">
                <a class="cancel" href="#" onClick="this.parentNode.parentNode.style.display='none';$('#modal-bg').hide(); return false;">&#10008; Cancel</a>
            </div>
        </div>

        <div id="load_analysis" class="modal-box">
            <div class="modal-title">
                <p>Load Analysis</p>
            </div>
            <form id="f_loadfile" class="fstyle">
                <label for="n_file" id="n_file_label">Select a file to load</label>
                <input type="file" id="n_file" name="files[]" multiple />
            </form>
            <output id="list"></output>

            <div class="modal-btns">
                <a class="cancel" href="#" onClick="this.parentNode.parentNode.style.display='none';$('#modal-bg').hide(); return false;">&#10008; Cancel</a>
            </div>
        </div>

        <div id="ova_settings" class="modal-box">
            <div class="modal-title">
                <p>Settings</p>
            </div>
            <form id="settings_form" class="fstyle">
            <?php if($source == "local"){ ?>
                <div id="textstg">
                <strong>Text Settings</strong>
                <p style="color: #444; line-height: 36px;">Font Size
                <a href="#" class="itl" style="background-image: url('res/img/txt-lrg.png');" onClick='$("#extsite").removeClass("ts tm");$("#extsite").addClass("tl"); return false;'></a>
                <a href="#" class="itm" style="background-image: url('res/img/txt-med.png');" onClick='$("#extsite").removeClass("ts tl");$("#extsite").addClass("tm"); return false;'></a>
                <a href="#" class="its" style="background-image: url('res/img/txt-sml.png');" onClick='$("#extsite").removeClass("tm tl");$("#extsite").addClass("ts"); return false;'></a>
                </p>
                </div>
            <?php } ?>
            <div id="anlstg">
            <strong>Analysis Settings</strong>
            <p style="color: #444; line-height: 22px;">Critical Questions
            <?php if(isset($_GET['cq']) && $_GET['cq'] == 'true'){ ?>
                <a href="#" id="cqtoggle" class="togglesw on" onClick='$(this).toggleClass("on");$(this).toggleClass("off");window.cqmode=!window.cqmode;return false;'><span class="tson">On</span><span class="tsoff">Off</span></a>
            <?php }else{ ?>
                <a href="#" id="cqtoggle" class="togglesw off" onClick='$(this).toggleClass("on");$(this).toggleClass("off");window.cqmode=!window.cqmode;return false;'><span class="tson">On</span><span class="tsoff">Off</span></a>
            <?php } ?>
            </p>
            <p style="color: #444; line-height: 22px;">Black &amp; White Diagram
            <?php if(isset($_GET['bw']) && $_GET['bw'] == 'true'){ ?>
                <a href="#" class="togglesw on" onClick='$(this).toggleClass("on");$(this).toggleClass("off");window.bwmode=!window.bwmode;invalidate();return false;'><span class="tson">On</span><span class="tsoff">Off</span></a>
            <?php }else{ ?>
                <a href="#" class="togglesw off" onClick='$(this).toggleClass("on");$(this).toggleClass("off");window.bwmode=!window.bwmode;invalidate();return false;'><span class="tson">On</span><span class="tsoff">Off</span></a>
            <?php } ?>
            </p>
            <?php if($pro){ ?>
            <p style="color: #444; line-height: 22px;">IAT Mode
            <?php if(isset($_GET['iat']) && $_GET['iat'] == 'true'){ ?>
                <!--<a href="#" class="togglesw on" onClick='$(this).toggleClass("on");$(this).toggleClass("off");window.iatmode=!window.iatmode;invalidate();return false;'><span class="tson">On</span><span class="tsoff">Off</span></a>-->
		<a href="#" class="togglesw on" onClick='alert("Turning off IAT mode is currently disabled in OVA+");return false;'><span class="tson">On</span><span class="tsoff">Off</span></a>
            <?php }else{ ?>
                <!--<a href="#" class="togglesw off" onClick='$(this).toggleClass("on");$(this).toggleClass("off");window.iatmode=!window.iatmode;invalidate();return false;'><span class="tson">On</span><span class="tsoff">Off</span></a>-->
	        <a href="#" class="togglesw on" onClick='alert("Turning off IAT mode is currently disabled in OVA+");return false;'><span class="tson">On</span><span class="tsoff">Off</span></a>
            <?php } ?>
            </p>
            <?php } ?>
            <p style="color: #444; line-height: 22px;">Canvas Size <br />
            Width <input id="c_neww" name="c_neww" class="itext" style="display: inline-block; width: 80px;" value="2000" /> 
            Height <input id="c_newh" name="c_newh" class="itext" style="display: inline-block; width: 80px;" value="4000" />
            </p>
            </div>
            </form>

            <div class="modal-btns">
                <a class="cancel" href="#" onClick="this.parentNode.parentNode.style.display='none';$('#modal-bg').hide(); return false;">&#10008; Close</a>
            </div>
        </div>

        <div id="save_modal" class="modal-box">
            <div id="m_load">Processing<br /><img src="res/img/loading_modal.gif" /></div>
            <div id="m_content" style="text-align: left; font-size: 0.8em; padding: 0px 20px;"></div>
            <div class="modal-btns">
                <a class="cancel" href="#" onClick="this.parentNode.parentNode.style.display='none';$('#modal-bg').hide(); return false;">&#10008; Close</a>
            </div>
        </div>
    </body>
</html>
