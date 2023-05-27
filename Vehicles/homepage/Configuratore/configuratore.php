<?php

session_start();

if(!isset($_SESSION['username'])){
    header("Location: ../../login/login.html");
}

/****************************** RICHIESTA AUTO DALL'API *********************************/
if(isset($_GET['MakeName']) && isset($_GET['ModelName']) && isset($_GET['angle'])){
    $customer = 'itgiovanni-lucadi-bellacompany';
    $make = $_GET['MakeName'];
    $model = $_GET['ModelName'];
    $angle = $_GET['angle'];
    
    //$angle = ['28', '23', '29', '01', '05', '09', '13', '17', '21'];
    
    if(!isset($_GET['color'])){
        $url = "https://cdn-01.imagin.studio/getImage?customer=".$customer."&make=".$make."&modelFamily=".$model."&angle=".$angle."&zoomType=fullscreen";
    }
    else{
        $color = $_GET['color'];
        $url = "https://cdn-01.imagin.studio/getImage?customer=".$customer."&make=".$make."&modelFamily=".$model."&angle=".$angle."&zoomType=fullscreen&paintDescription=".$color;
    }
    
    
    
    $photo_content = file_get_contents($url);
    $code64_url =  base64_encode($photo_content);
    
    
    $error= array(
        "error" => 0,
        "content" => $code64_url
    );
    
    echo json_encode($error);
}



/****************************** RICHIESTA LISTA COLORI DALL'API *********************************/
if(isset($_GET['MakeName_color']) && isset($_GET['ModelName_color'])){
    $customer = 'itgiovanni-lucadi-bellacompany';
    $make = $_GET['MakeName_color'];
    $model = $_GET['ModelName_color'];


    $url = "https://cdn.imagin.studio/getPaints?&customer=".$customer."&target=car&make=".$make."&modelFamily=".$model;

    $curl = curl_init($url);

    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

    $result = curl_exec($curl);


    curl_close($curl);
    
    echo $result;
    
}

/************************************************************* CHECK DAL DATABASE SE L'AUTO E' TRA I PREFERITI *****************************************************/

    if(isset($_GET['check']) && isset($_GET['MakeName_favourite']) && isset($_GET['ModelName_favourite'])){
        
        $connect = mysqli_connect("localhost", "root", "", "agenda_db");

        $make = mysqli_real_escape_string($connect, $_GET['MakeName_favourite']);
        $model = mysqli_real_escape_string($connect, $_GET['ModelName_favourite']);
        $user = mysqli_real_escape_string($connect, $_SESSION['username']);

        $query = "SELECT * FROM favourite_list WHERE user_profile='".$user."' AND Make_Name='".$make."' AND Model_Name='".$model."';";
        
        $res = mysqli_query($connect, $query);
        
        if(mysqli_num_rows($res) > 0){
            $error = array(
                "error" => 0,
                "content" => $res
            );
            echo json_encode($error);
        }
        else{
            $error = array(
                "error" => 1
            );
            echo json_encode($error);
        }

        mysqli_free_result($res);
        mysqli_close($connect);
    }


/***************************************INSERIMENTO NEL DATABASE DELL'AUTO, TRA I PREFERITI **************************************/
    if(isset($_GET['insert']) && isset($_GET['MakeName_favourite']) && isset($_GET['ModelName_favourite']) && isset($_GET['type'])){
        $connect = mysqli_connect("localhost", "root", "", "agenda_db");
        
        $make = mysqli_real_escape_string($connect, $_GET['MakeName_favourite']);
        $model = mysqli_real_escape_string($connect, $_GET['ModelName_favourite']);
        $user = mysqli_real_escape_string($connect, $_SESSION['username']);
        $type = mysqli_real_escape_string($connect, $_GET['type']);
        

        $query = "INSERT INTO favourite_list(user_profile, Make_Name, Model_Name, vehicleType) VALUES ('".$user."','".$make."','".$model."','".$type."');";

        $res = mysqli_query($connect, $query);
        
        if($res){
            $error = array(
                "error" => 0,
                "content" => "Inserimento avvenuto correttamente"
            );
            echo json_encode($error);
        }
        else{
            $error = array(
                "error" => 1,
                "content" => $res
            );
            echo json_encode($error);
        }

        mysqli_close($connect);
    }


/***************************************ELIMINAZIONE DAL DATABASE DELL'AUTO, TRA I PREFERITI **************************************/

    if(isset($_GET['remove']) && isset($_GET['MakeName_favourite']) && isset($_GET['ModelName_favourite'])){
        
        $connect = mysqli_connect("localhost", "root", "", "agenda_db");
        
        $make = mysqli_real_escape_string($connect, $_GET['MakeName_favourite']);
        $model = mysqli_real_escape_string($connect, $_GET['ModelName_favourite']);
        $user = mysqli_real_escape_string($connect, $_SESSION['username']);

        
        $query = "DELETE FROM favourite_list WHERE user_profile='".$user."' AND Make_Name='".$make."' AND Model_Name='".$model."';";

        $res = mysqli_query($connect, $query);
        
        if($res){
            $error = array(
                "error" => 0,
                "content" => "Rimozione avvenuta correttamente",
            );
            echo json_encode($error);
        }
        else{
            $error = array(
                "error" => 1,
                "content" => $res
            );
            echo json_encode($error);
        }

        mysqli_close($connect);
    }


?>