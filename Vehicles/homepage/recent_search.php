<?php

session_start();
    if(isset($_SESSION['username'])){
        if(isset($_GET['makename']) && isset($_GET['modelname']) && isset($_GET['clicked'])){

            $connect = mysqli_connect("localhost", "root", "", "agenda_db");
            
            $makeName = mysqli_real_escape_string($connect,$_GET['makename']);
            $modelName = mysqli_real_escape_string($connect,$_GET['modelname']);
            
            $query = "INSERT INTO search(user_profile, Make_Name, Model_Name, giorno, ora) VALUES ('".$_SESSION['username']."','".$makeName."','".$modelName."','".date("Y-m-d")."','".date("h:i:sa")."')";

            $res = mysqli_query($connect, $query);

            echo json_encode($res);

        
        }
    }


/*************************SE IL PROFILO E' LOGGATO, RIEMPIO LA COLONNA DI SINISTRA CON LE RICERCHE EFFETTUATE NELLE ULTIME 24 ORE *********************************/
    if(isset($_SESSION['username'])){
        if(isset($_GET['search_get'])){
            $connect = mysqli_connect("localhost", "root", "", "agenda_db");

            $query = "SELECT * FROM search WHERE user_profile='".$_SESSION['username']."';";

            $res = mysqli_query($connect, $query);
            

            if(mysqli_num_rows($res) > 0){
                while($ris[] = mysqli_fetch_assoc($res))

                $error = array(
                    "error" => 0,
                    "content" => $ris
                );
                
                echo json_encode($error);
                }
                else{
                    $error = array(
                        "error" => 1,
                        "content" => "nessuna ricerca"
                    );
                    echo json_encode($error);
                }

        }

        if(isset($_GET['search_remove']) && isset($_GET['Make_Name']) && isset($_GET['Model_Name'])){
            $connect = mysqli_connect("localhost", "root", "", "agenda_db");

            $makename = mysqli_real_escape_string($connect, $_GET['Make_Name']);
            $modelname = mysqli_real_escape_string($connect, $_GET['Model_Name']);

            $query = "DELETE FROM search WHERE user_profile='".$_SESSION['username']."' AND Make_Name='".$makename."' AND Model_Name='".$modelname."';";

            $res = mysqli_query($connect, $query);

        }
    }
    else{
        $error = array(
        "error" => 1,
        "content" => "No session logged!"
        );
        echo json_encode($error);
    }
?>
