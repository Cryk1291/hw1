<?php
    if(isset($_GET['name']) && isset($_GET['surname']) && isset($_GET['username']) && isset($_GET['e-mail']) && isset($_GET['password'])){
        static $counter = 0;
        
        $connect = mysqli_connect("localhost", "root", "", "agenda_db");
        
        $name = mysqli_real_escape_string($connect, $_GET['name']);
        $surname = mysqli_real_escape_string($connect, $_GET['surname']);
        $user = mysqli_real_escape_string($connect, $_GET['username']);
        $email = mysqli_real_escape_string($connect, $_GET['e-mail']);
        $password = mysqli_real_escape_string($connect, $_GET['password']);
        $password = password_hash($password, PASSWORD_BCRYPT);
        
        /****************** VERIFICA REGISTRAZIONE ******************/
        $verify = "SELECT *
                    FROM user_profile
                        WHERE email = '".$email."'";
        $verify = mysqli_query($connect, $verify);
        if(mysqli_num_rows($verify)){
            $varianti = mysqli_fetch_row($verify);
            $error= array(
                "error" => 1,
                "error_text" => "Email già in uso",
            );
            echo json_encode($error); 
            mysqli_free_result($verify);
            mysqli_close($connect);
            exit;             
        }
        mysqli_free_result($verify);
        

        /****************** VERIFICA USERNAME ***************************/
        $verify = "SELECT *
                    FROM user_profile
                        WHERE user_profile = '".$user."'";
        $verify = mysqli_query($connect, $verify);
        if(mysqli_num_rows($verify)){
            $varianti = mysqli_fetch_row($verify);
            $error= array(
                "error" => 1,
                "error_text" => "Username già in uso",
            );
            echo json_encode($error); 
            mysqli_free_result($verify);
            mysqli_close($connect);
            exit;             
        }
        mysqli_free_result($verify);
        
       /****************** PASSATI I CONTROLLI, PROCEDO AD INSERIRE IL NUOVO UTENTE NEL DATABASE */
        
        $query = "INSERT INTO user_profile(nome, cognome, user_profile, pass, email, photo) 
                    VALUES('".$name."','".$surname."','".$user."','".$password."','".$email."','../profile/assets/profile.png')";
        $res = mysqli_query($connect, $query);
        
        
        
        if($res){  
            $result = array(
                    "error" => 0,
                    "content" => "Congratulazioni hai completato la Registrazione!\n
                    Verrai reindirizzato alla pagina di Login.",
            );
            echo json_encode($result);
        }
        else{
            $error= array(
                "error" => 1,
                "error_text" => "error",
            );
            echo json_encode($error);
        }
        mysqli_close($connect);
        exit;
    }
    else{
        $error= array(
            "error" => 1,
            "error_text" => "Invalid fetch",
        );
        mysqli_close($connect);
        echo json_encode($error);
        exit;
    }
    
    
    ?>