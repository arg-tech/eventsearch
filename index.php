<?php
    if(isset($_COOKIE['ovauser'])) {
        $user = explode(";", $_COOKIE['ovauser']);
        $af = $user[0];
        $as = $user[1];
    }
?><!doctype html>
<html class="no-js" lang="">
    <head>
        <meta charset="utf-8">
        <title>ArgSearch</title>
        <meta name="description" content="">
        <link rel="stylesheet" href="res/css/reset.css">
        <link rel="stylesheet" href="res/css/splash.css">
        <link rel="stylesheet" href="res/css/formstyle.css">
        <link rel="stylesheet" href="res/css/introjs.css">
        <script src="res/js/jquery-1.11.2.min.js"></script>
        <script src="res/js/setup.js"></script>
        <script src="res/js/intro.min.js"></script>
    </head>

    <body>
        <div id="wrap" onclick="$('#aboutmodal').hide();"><div style='width:0;height:0'>&nbsp;</div>
            <div id="content">
                <img src="" onerror="" id="ova-logo" height="60" />
                <div id="source-sel" class="mdlg">


                    <div class="form-btns">
                        <a href="./analyse.php" onClick="" data-step="1" data-intro="Click here to analyse using the original version of OVA" data-position="bottom-middle-aligned">Graph Search</a>
                        <a href="http://www.aifdb.org/search" onClick="" data-step="2" data-intro="" data-position="bottom-middle-aligned">Text Search</a>
                    </div>


                </div>
                <div id="analyst-details" class="mdlg" style="display:none; position:relative;">
                    <div class="mdlg-title">
                        <p>Analyst Details</p>
                    </div>
                    <div id="showfs" style="display:none; position: absolute; top: 130px; left: 20px;"><a onClick="resetform('ep');" style="cursor:pointer;padding:2px 3px;background-color:#e6e6e6;">&laquo;</a></div>
                    <form method="GET" action="./analyse.php" id="fs" class="fstyle" style="width:86%; float: left;">
                        <p style="padding: 20px 0px;"> 
                        <label>First Name:<br /> 
                        <input type="text" name="af" id="afinput" class="input" value="<?php echo $af; ?>" style="font-size: 22px; padding: 3px; width:90%; color: #666;" /></label> 
                        <label>Surname:<br /> 
                        <input type="text" name="as" id="asinput" class="input" value="<?php echo $as; ?>" style="font-size: 22px; padding: 3px; width:90%; color: #666;" /></label> 
                        </p>
                    </form>
                    <!--<div id="adsep" class="vsep" style="float: left;margin-top: 40px; margin-left:50px;"><div>or</div></div>
                    <form method="GET" action="./analyse.php" id="ep" class="fstyle" style="width:30%; float: left;">
                        <p style="padding: 20px 0px;"> 
                        <label>Email:<br /> 
                        <input type="text" name="af" id="afinput" class="input" value="" style="font-size: 22px; padding: 3px; width:90%; color: #666;" onfocus="expandform('ep')" /></label> 
                        <label>Password:<br /> 
                        <input type="password" name="as" id="asinput" class="input" value="" style="font-size: 22px; padding: 3px; width:90%; color: #666;" onfocus="expandform('ep')" /></label>
                        </p>
                    </form>
                    <div id="showep" style="display:none; position: absolute; top: 130px; right: 20px;"><a onClick="resetform('fs');" style="cursor:pointer;padding:2px 3px;background-color:#e6e6e6;">&laquo;</a></div>
                    -->
                    <div style="clear: both; line-height: 0;">&nbsp;</div>

                    <div class="form-btns">
                        <a href="#" onClick="ovaPlus();return false;">Continue &#x27a1;</a>
                        <a href="#" onClick="$('#analyst-details').slideUp(400, function() {$('#source-sel').slideDown()});return false;">&#x2b05; Back</a>
                    </div>
                </div>
            </div>
            <div id="push"></div>
        </div>



    </body>
</html>
