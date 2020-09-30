<?php
session_start();
?>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
    <head>
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <title>AIFdb Search</title>
        <link href="res/css/searchresultsam.css" rel="stylesheet" type="text/css" />

    </head>

   <body>
        <div id="topmenu">
            <a href="http://corpora.aifdb.org/" id="corporalink">
            <img src="res/img/icon-corpora.png" alt="corpora" style="border: 0px;" /> Corpora
            </a>
        </div>

        <div id="header">
            <h1>
                <a href="http://www.aifdb.org/">
                <img src="http://www.aifdb.org/images/AIFdb_small.png" alt="AIFdb" height="34px" style="border: 0px;" />
                </a>
            </h1>

        </div>


	<div id="ccol">
    <?php

        $json_data = json_decode($_SESSION['nodesets'], true);
        //echo $_GET['nodesets'];
        //$json_data = json_decode($_GET['nodesets'], true);
        if ($json_data['result'] == "" || strpos($json_data['result'], 'Error') !== false ){
            echo "<p> No nodesets found </p>";
        } else {
        $results_array =  explode(',', $json_data['result']);
                    foreach($results_array as $entry) {
                        echo "<div class='nodeset clearfix'>";
                        echo "<a href='http://www.aifdb.org/argview/".$entry."' class='nodesetimglink'><div class='nodesetimg' style='background-image:url(\"http://www.aifdb.org/diagram/$entry\");'></div></a><h3>Argument Map " .$entry."</h3></div>";
                    }
        }
        ?>
    </div>
    </body>
</html>
