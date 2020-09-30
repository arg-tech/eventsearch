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
                <a href="http://www.arg-tech.org/" style="border:0px;margin-left:12px;"><img src="res/img/DARG-tech.png" /></a>
                <div id="source-sel" class="mdlg">

        <form method="GET" action="http://www.aifdb.org/search" id="textsearch">
                <br />
                <div class="sectionrule"><div class="srcontent">Text</div></div>
                <input type="text" name="q" class="searchinput" value="" tabindex="10" id="asrchi" />

                <br />
                <br />
                <div class="sectionrule"><div class="srcontent">Speaker</div></div>
                <input type="text" name="p" class="searchinput" value="" tabindex="10" />
                <input type="hidden" name="am" value="1" />
                <br />
                <br />

                <div class="sectionrule"><div class="srcontent">Date Added From and To</div></div>
                <table class="split-date-wrap" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                    <td><input type="text" class="w2em" id="date-1-dd" name="date-1-dd" value="" maxlength="2" placeholder="DD" />
                    <td><input type="text" class="w2em" id="date-1-mm" name="date-1-mm" value="" maxlength="2" placeholder="MM" /></td>
                    <td class="lastTD"><input type="text" class="w4em split-date fill-grid statusformat-l-cc-sp-d-sp-F-sp-Y show-weeks no-today-button" id="date-1" name="date-1" value="" maxlength="4" placeholder="YYYY" /></td>
                    </tr>
                    <tr>
                    <td><input type="text" class="w2em" id="date-2-dd" name="date-2-dd" value="" maxlength="2" placeholder="DD"/></td>
                    <td><input type="text" class="w2em" id="date-2-mm" name="date-2-mm" value="" maxlength="2" placeholder="MM"/></td>
                    <td class="lastTD"><input type="text" class="w4em split-date fill-grid statusformat-l-cc-sp-d-sp-F-sp-Y show-weeks no-today-button" id="date-2" name="date-2" value="" maxlength="4" placeholder="YYYY"/></td>
                    </tr>
                </table>
                <input type="hidden" name="s" value="Hypothesising" />
                <br />
                <br />


            <div class="form-btns">
            <a href="#" onClick="document.getElementById('textsearch').submit()" data-step="2" data-intro="" data-position="bottom-middle-aligned">Hypothesis Search</a>
            </div>
            </form>
                    <br />

                    <hr>
                    <br />

                    <br />
                    <form method="GET" action="sendJSON.php" id="eventsearch">
                <br />
                <div class="sectionrule"><div class="srcontent">Keywords</div></div>
                <input type="text" name="keys" class="searchinput" value="" tabindex="10" id="asrchi" />

                <br />
                <br />
                <div class="sectionrule"><div class="srcontent">Source / Agent</div></div>
                <input type="text" name="source" class="searchinput" value="" tabindex="10" />
                <br />
                <br />

                <div class="sectionrule"><div class="srcontent">Location</div></div>
                <input type="text" name="location" class="searchinput" value="" tabindex="10" />
                <br />
                <br />

                <div class="sectionrule"><div class="srcontent">Involved Object</div></div>
                <input type="text" name="object" class="searchinput" value="" tabindex="10" />
                <br />
                <br />

                <div class="sectionrule"><div class="srcontent">Time - &lt; time or &gt; time or &lt;&gt; time ( between two dates)</div></div>
                <input type="text" name="time" class="searchinput" value="" tabindex="10" />
                <br />
                <br />




                    <div class="form-btns">
                        <a href="#" onClick="document.getElementById('eventsearch').submit()" data-step="1" data-intro="" data-position="bottom-middle-aligned">Event Search</a>
                    </div>
                         </form>
        </div>
            </div>
        </div>
    </body>
</html>
