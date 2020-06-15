<?php

$target_path = "../analyses/";
$filename = rand(1000, 9999) . date("U");
$tmpfile = $target_path . $filename . ".json";
$fh = fopen($tmpfile, 'w') or die("can't open file");
fwrite($fh, $_POST['data']);
fclose($fh);

echo $filename;
