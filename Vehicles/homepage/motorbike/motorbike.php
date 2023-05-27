<?php

    session_start();

    if($_SESSION['username']){
        if(isset($_GET['Make_Name'])){
            $secret_key = "wmUGFt5J3DmoSWHQOmBT4A==Fb26o0FpGvuCk9ON";

            $make= $_GET['Make_Name'];
            $dati = array("make" => $make);

            
            
            if(!isset($_GET['Model_Name']) && !isset($_GET['year']))
            $url = 'https://api.api-ninjas.com/v1/motorcycles?make='.$make;
            else if(isset($_GET['Model_Name']) && !isset($_GET['year'])){
                $model = $_GET['Model_Name'];
                $url = 'https://api.api-ninjas.com/v1/motorcycles?make='.$make.'&model='.$model;
            }
            else{
                $year = $_GET['year'];
                $url = 'https://api.api-ninjas.com/v1/motorcycles?make='.$make.'&model='.$model.'&year='.$year;
            }
            
        $ch = curl_init();

            $secret_key = "wmUGFt5J3DmoSWHQOmBT4A==Fb26o0FpGvuCk9ON";
            $headers = ["X-Api-Key: ".$secret_key];

            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

            $result = curl_exec($ch);

            


            echo $result;
            curl_close($ch);
        }

    }



?>