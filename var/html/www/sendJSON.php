<?php
ob_start();
session_start();
$queryObj->text = $_GET["keys"];
$queryObj->actor = $_GET["source"];
$queryObj->time = $_GET["time"];
$queryObj->location = $_GET["location"];
$queryObj->involved = $_GET["object"];
$queryObj->illustrate = "";
$json->event = $queryObj;
$queryJSON = json_encode($json);

$url = "http://tomcat.arg.tech/ArgStructSearch/search/hevy/exec/";
//Use URL below for testing purposes
//$url = "http://ptsv2.com/t/tfpa8-1601412024/post";
$content = $queryJSON;


$curl = curl_init($url);
curl_setopt($curl, CURLOPT_HEADER, false);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_HTTPHEADER,
        array("Content-type: application/json"));
curl_setopt($curl, CURLOPT_POST, true);
curl_setopt($curl, CURLOPT_POSTFIELDS, $content);

$json_response = curl_exec($curl);

$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);

////$test_json = '{"nodesets":["10672", "10671"]}';
////$tst_jsn_string = json_decode($test_json);
$_SESSION["nodesets"] = $json_response;

if ( $status != 200 ) {
    die("Error: call to URL $url failed with status $status, response $json_response, curl_error " . curl_error($curl) . ", curl_errno " . curl_errno($curl));
}


curl_close($curl);
header("Location: searchResults.php");
//echo $json_response;

?>
