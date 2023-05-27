<?php

session_start();
if(!isset($_SESSION['username'])){
    header("Location: ../../login/login.html");
}

if(isset($_GET['username'])){
    $connect = mysqli_connect("localhost", "root", "", "agenda_db");
    
    $username = mysqli_real_escape_string($connect, $_GET['username']);

    $query = "SELECT * FROM user_profile WHERE user_profile = '".$username."'";
    
    $res = mysqli_query($connect, $query);
    
    if(mysqli_num_rows($res) > 0){
        $result = mysqli_fetch_assoc($res);
        $header = array(
            "nome" => $result['nome'],
            "cognome" => $result['cognome'],
            "email" => $result['email'],
            "username" => $result['user_profile'], 
        );
    }
    else{
        $error = array(
            "error_dat" => 1,
            "error_fav" => 1,
        );
        echo json_encode($error);
    }
    
    
    //$query = "SELECT * FROM (user_profile up JOIN favourite_list fl on up.user_profile=fl.user_profile) WHERE up.user_profile='".$username."';";
    $query = "SELECT * FROM favourite_list WHERE user_profile='".$username."';";
    $res = mysqli_query($connect, $query);
    

    if(mysqli_num_rows($res)>0){
        while($row = mysqli_fetch_assoc($res)){
            $ris[] = $row;
        }

        $error = array(
            "error_dat" => 0,
            "error_fav" => 0,
            "header" => $header,
            "favourite" => $ris 
        );
        
    }
    else{
        $error = array(
            "error_dat" => 0,
            "error_fav" => 1,
            "header" => $header
        );
    }

    echo json_encode($error);


    mysqli_free_result($res);
    mysqli_close($connect);
    exit;
}


/*************************** PRENDO SOLO LA FOTO DI COPERTINA PER MOSTRARE LA MACCHINA ***********************************/
if(isset($_GET['Make_Name']) && isset($_GET['Model_Name'])){
    $customer = 'itgiovanni-lucadi-bellacompany';
    $make = $_GET['Make_Name'];
    $model = $_GET['Model_Name'];

    $url = "https://cdn-01.imagin.studio/getImage?customer=".$customer."&make=".$make."&modelFamily=".$model;

    $photo_content = file_get_contents($url);
    $code64_url =  base64_encode($photo_content);

    echo json_encode($code64_url);
}



?>