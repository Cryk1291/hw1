<?php

/******************* SE INSERISCO SIA MARCA CHE MODELLO *************************/
if(isset($_GET['make']) && isset($_GET['model'])){
                
    $conn = mysqli_connect("localhost", "root", "", "agenda_db");

    $make = mysqli_real_escape_string($conn,$_GET['make']);
    $model = mysqli_real_escape_string($conn,$_GET['model']);

    $query = "SELECT * FROM automobile WHERE Make_Name='".$make."' AND Model_Name='".$model."';";

    $res = mysqli_query($conn, $query);

    if(mysqli_num_rows($res) > 0){
        $ris[] = mysqli_fetch_assoc($res); 
        $error = array(
            "error" => 0,
            "Results" => $ris
        );
        
        echo json_encode($error);
    }
    else{
        $error = array(
            "error" => 1
        );
        echo json_encode($error);
    }

    mysqli_close($conn);

}


/********************** SE INSERISCO SOLO LA MARCA ********************/
else if(isset($_GET['make']) && !isset($_GET['model'])){
                
    $conn = mysqli_connect("localhost", "root", "", "agenda_db");

    $make = mysqli_real_escape_string($conn,$_GET['make']);

    $query = "SELECT * FROM automobile WHERE Make_Name='".$make."';";

    $res = mysqli_query($conn, $query);

    if(mysqli_num_rows($res)>0){
        while($row = mysqli_fetch_assoc($res)){
            $ris[] = $row;
        }

        $error = array(
            "error" => 0,
            "Results" => $ris
        );

        echo json_encode($error);
    }
    else{
        $error = array(
            "error" => 1
        );
        echo json_encode($error);
    }

    mysqli_close($conn);

}











?>