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

            $RAs = array();
            foreach ($dbs->nodes as $node){
                if($node->type == 'RA'){
                    $raID = $node->id;
                    $c = getout($raID, $dbs->edges, 'I');
                    $p = getin($raID, $dbs->edges, 'I');

                    $cl = $mapItoL[$c];
                    foreach($p as $prem){
                        $pl = $mapItoL[$prem];
                        $RAs[] = $pl . "->" . $cl;
                    }
                }
            }


            $pattern = '/"node([0-9]*)"/';
            preg_match_all($pattern, $atxt, $m);
            for ($i = 0; $i < count($m[1])-1; $i++) {
                $link = $m[1][$i] . "->" .$m[1][$i+1];
                $rlink = $m[1][$i+1] . "->" .$m[1][$i];
                echo $nsid . " " . $link;

                $pat = '/([^>]*)<span[^>]*node' . $m[1][$i] . '"' . '>.*?<\/span>(.*)<span[^>]*node' . $m[1][$i+1] . '"' . '>.*?<\/span>/';
                preg_match($pat, $atxt, $mb);
                $before = $mb[1];
                $between = $mb[2];
                echo " [BEFORE: ".$before."]";
                echo " [BETWEEN: ".$between."]";
                echo $mb[0];

                if(in_array($link, $RAs)){
                    echo " PC";
                }elseif(in_array($rlink, $RAs)){
                    echo " CP";
                }
                echo "\n";
            }
    }
