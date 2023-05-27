<?php

session_start();
if(!isset($_SESSION['username'])){
    header('Location: ./login/login.html');
}

if(isset($_GET['username'])){
    $connect = mysqli_connect("localhost", "root", "", "agenda_db");

    $username = mysqli_real_escape_string($connect, $_GET['username']);

    $query = "SELECT photo FROM user_profile WHERE user_profile='".$username."';";

    $res = mysqli_query($connect, $query);

    
    if(mysqli_num_rows($res) > 0){
        $error = array(
            "error" => 0,
            "content" => mysqli_fetch_assoc($res)['photo']
        );
        echo json_encode($error);
    }
    else{
        $error = array(
            "error" => 1,
            "content" => "Missing User"
        );
        echo json_encode($error);
    }


}






?>