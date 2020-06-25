<?php
    $ids = $_GET['id'];

    function getout($nid, $e, $type){
        foreach ($e as $edge){
            if($edge->from->id == $nid && $edge->to->type == $type){
                return $edge->to->id;
            }
        }
        return 0;
    }

    function getin($nid, $e, $type){
        $in = array();
        foreach ($e as $edge){
            if($edge->to->id == $nid && $edge->from->type == $type){
                $in[] = $edge->from->id;
            }
        }
        return $in;
    }

    $nsids = explode(",", $ids);

    foreach ($nsids as $nsid){
            //echo "<h1>".$nsid."</h1>";
	    $dbjson = file_get_contents('../db/' . $nsid);

	    $dbs = json_decode($dbjson);
	    $dba = $dbs->{'analysis'};
	    $atxt =  $dba->{'txt'};

	    $mapItoL = array();
	    $mapLtoI = array();
	    $mapIDtoNode = array();
	    foreach ($dbs->nodes as $node){
		$mapIDtoNode[$node->id] = $node;
		if($node->type == 'YA'){
		    $yaID = $node->id;
		    $i = getout($yaID, $dbs->edges, 'I');
		    $ls = getin($yaID, $dbs->edges, 'L');
		    $l = $ls[0];
		    $mapItoL[$i] = $l;
		    $mapLtoI[$l] = $i;
		}
	    }

	    foreach ($dbs->nodes as $node){
		if($node->type == 'CA'){
		    $raID = $node->id;
		    //echo $raID;
		    //echo " c:";
		    $c = getout($raID, $dbs->edges, 'I');
		    //echo $c;
		    $p = getin($raID, $dbs->edges, 'I');
		    //print_r($p);
		    //echo "<hr>";

		    $cl = $mapItoL[$c];
		    foreach($p as $prem){
			$pl = $mapItoL[$prem];
			$pattern = '/node' . $cl . '"' . '>.*?<\/span>(.*)<span[^>]*node' . $pl . '"' . '>.*?<\/span>/';
			preg_match($pattern, $atxt, $m);
			$between = $m[1];
			if ($m[1] && strpos($between, '<span') === false) {
			    echo "C->P" . $between;
			    echo "<hr>";
			}

			$pattern = '/node' . $pl . '"' . '>.*?<\/span>(.*)<span[^>]*node' . $cl . '"' . '>.*?<\/span>/';
			preg_match($pattern, $atxt, $m);
			$between = $m[1];
			if ($m[1] && strpos($between, '<span') === false) {
			    echo "P->C" . $between;
			    echo "<hr>";
			}
		    }
		}
	    }

    }
