<?php

/*
session_start();
if(!isset($_SESSION['username'])){
    header("Location: ../login/login.html");
} */

    if(isset($_GET['make']) && !isset($_GET['model'])){
        $curl = curl_init();

        $make = urlencode($_GET['make']);

        curl_setopt($curl, CURLOPT_URL, "https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/".$make."?format=json");
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

        $result = curl_exec($curl);

        echo $result;
        curl_close($curl);

    }


    if(isset($_GET['make']) && isset($_GET['model'])){
        $curl = curl_init();

        $make = urlencode($_GET['make']);
        $model = urlencode($_GET['model']);

        curl_setopt($curl, CURLOPT_URL, "https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/".$make."?format=json");
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

        $result = curl_exec($curl);
        $result_array = json_decode($result);
        $result = $result_array->Results;

        foreach($result as $value){
            foreach($value as $make_model_key => $make_model_value){
                if($make_model_key != 'Model_Name')
                    continue;
                if(strcasecmp($make_model_value,$model) == 0){  //COMPARAZIONE DELLE STRINGHE CASE-INSENSITIVE
                    $array_value = array(
                        "Results" => array($value)
                    );                    //CONVERTO L'OGGETTO IN ARRAY PERCHE' VIENE MEGLIO LAVORARCI
                    echo json_encode($array_value);
                    curl_close($curl);
                    exit;
                } 
                
            } 
        }

        echo json_encode(0);
        curl_close($curl);
        
    }




    if(isset($_GET['make_hide']) && isset($_GET['model_hide'])){
        
        $customer = "itgiovanni-lucadi-bellacompany";
        $make = $_GET['make_hide'];
        $model = $_GET['model_hide'];
        if(isset($_GET['modelYear'])){
            $url = "https://cdn-01.imagin.studio/getImage?customer=".$customer."&make=".$make."&modelFamily=".$model."&modelYear=".$_GET['modelYear'];
        }
        else
            $url = "https://cdn-01.imagin.studio/getImage?customer=".$customer."&make=".$make."&modelFamily=".$model;
            
        $photo_content = file_get_contents($url);
        $code64_url =  base64_encode($photo_content);
        echo json_encode($code64_url);

    }

    



?>