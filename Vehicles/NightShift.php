<?php

    session_start();

    if(isset($_SESSION['night_shift']) && isset($_GET['set'])){
        $set = $_GET['set'];

        if($_SESSION['night_shift'] == 'false')
            $_SESSION['night_shift'] = 'true';
        else
            $_SESSION['night_shift'] = 'false';
        echo json_encode($_SESSION['night_shift']);
    }

    if(isset($_SESSION['night_shift']) && isset($_GET['check'])){
       
        echo json_encode($_SESSION['night_shift']);
    }




?>