<?php

session_start();

    if(!$_SESSION['username']){
        header("Location: ../../login/login.html");
    }

    if(isset($_FILES['avatar']['size'])){
        
        $file_photo = $_FILES['avatar']; //METTO IL CONTENUTO DELLA PHOTO IN UNA VARIABILE
        $type = exif_imagetype($file_photo['tmp_name']); //NOME TEMPORANEO DEL FILE DATO DAL PHP 
        $allowed_type= array(IMAGETYPE_PNG => 'png', IMAGETYPE_JPEG => 'jpg', IMAGETYPE_GIF => 'gif');
            if(isset($allowed_type[$type])){ //SE SI VUOL DIRE CHE IL TIPO COINCIDE CON UNO DEI TRE
                if($file_photo['error'] === 0){
                    if ($file_photo['size'] < 7000000) {
                        $fileNameNew = uniqid('', true).".".$allowed_type[$type]; //GENERO L'ID CON LA FUNZIONE uniqid //QUESTO NOME SERVIRA' SOLO PER AGGIUNGERLO IN FILEDESTINATION
                        $fileDestination = 'assets/'.$fileNameNew; //GLI ASSEGNO IL NUOVO NOME
                        move_uploaded_file($file_photo['tmp_name'], $fileDestination);    //MUOVO IL FILE NELLA DESTINAZIONE


                        $error = array(
                            "error" => 0,
                            "content" => "$fileDestination"
                        );
                        echo json_encode($error);
                        
                    }
                    else{
                        $error = array(
                            "error" => 1,
                            "content" => "L'immagine non deve avere dimensioni maggiori di 7MB"
                        );
                        echo json_encode($error);
                    }
                }
                else{
                    $error = array(
                        "error" => 1,
                        "content" => "Errore nel carimento del file"
                    );
                    echo json_encode($error);
                }
            }
            else{
                $error = array(
                    "error" => 1,
                    "content" => "I formati consentiti sono .png, .jpeg, .jpg e .gif"
                );
                echo json_encode($error);
            }
            
    }
        
          
    if(isset($_GET['destination'])){
        
        // Faccio la query per aggiungerlo al database 
        $connect = mysqli_connect("localhost", "root", "", "agenda_db");
        
        $fileDestination = $_GET['destination'];
        $fileDestination = mysqli_real_escape_string($connect, $fileDestination);

        
        $query = "UPDATE user_profile SET photo = '".$fileDestination."' WHERE user_profile = '".$_SESSION['username']."';";

        $res = mysqli_query($connect, $query);

        if($res){
            $error = array(
                "error" => 0,
                "content" => "Inserimento riuscito"
            );
            echo json_encode($error);
        }
        else{
            $error = array(
                "error" => 1,
                "content" => "Inserimento non riuscito"
            );
            echo json_encode($error);
        }
    }
    
    
    
    if(isset($_GET['username'])){
        $connect = mysqli_connect("localhost", "root", "", "agenda_db");
        
        $username = $_GET['username'];
        $username = mysqli_real_escape_string($connect, $username);
    
        
        $query = "SELECT photo FROM user_profile WHERE user_profile = '".$username."';";
    
        $res = mysqli_query($connect, $query);
    
        if(mysqli_num_rows($res) > 0){
            $error = array(
                "error" => 0,
                "content" => mysqli_fetch_assoc($res)
            );
            echo json_encode($error);
        }
        else{
            $error = array(
                "error" => 1,
                "content" => "Utente non trovato"
            );
            echo json_encode($error);
        }

    }


    

?>