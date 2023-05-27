<?php

session_start();

if(isset($_SESSION['username'])){
    if(isset($_SESSION['night_shift'])){
        $error = array(
            "error" => 0,
            "session" => $_SESSION['username'],
            "night_shift" => $_SESSION['night_shift']);
    }
    else{
        $error = array(
            "error" => 0,
            "session" => $_SESSION['username'],
            "night_shift" => null);
    }
    echo json_encode($error);
}
else{
     $error = array(
        "error" => 1
    );
    echo json_encode($error);
}
    
    


?>