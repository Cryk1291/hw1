<?php


    if(isset($_GET['makeid']) && isset($_GET['makename']) && isset($_GET['modelid']) && isset($_GET['modelname'])){
                
        $conn = mysqli_connect("localhost", "root", "", "agenda_db");

        $makeId = mysqli_real_escape_string($conn,$_GET['makeid']);
        $makeName = mysqli_real_escape_string($conn,$_GET['makename']);
        $modelId = mysqli_real_escape_string($conn,$_GET['modelid']);
        $modelName = mysqli_real_escape_string($conn,$_GET['modelname']);
        
        $query = "INSERT INTO automobile(Make_ID, Make_Name, Model_ID, Model_Name) VALUES ('".$makeId."','".$makeName."','".$modelId."','".$modelName."')";
        
        $res = mysqli_query($conn, $query);
        
        echo $res;
        
        mysqli_close($conn);
        
    }
    
    














?>