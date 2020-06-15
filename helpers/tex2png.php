<?php
    if(isset($_POST['latex'])){
        $latex = $_POST['latex'];
    }else{
        $latex = '$\alpha$';
    }

    $latex = str_replace("'", "'\"'\"'", $latex);

    $png = exec("./bin/tex2png -c '".$latex."' -d pngs -T tight");
    $pngpath = preg_replace('/file=/', '', $png);


    list($width, $height, $type, $attr) = getimagesize($pngpath);
    echo '{"file":"'.$pngpath .'","width":"'.$width.'","height":"'.$height.'"}';
