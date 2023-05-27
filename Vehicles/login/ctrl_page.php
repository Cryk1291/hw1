<?php

session_start();
    if(isset($_SESSION['username'])){
        header('Location: ../homepage/homepage.html');
        exit;
    }

    if(isset($_GET['username']) && isset($_GET['password'])){
        //Inizio il collegamento con il database
        $connect = mysqli_connect("127.0.0.1", "root", "", "agenda_db");
        
        $user = mysqli_real_escape_string($connect, $_GET['username']);
        $password = $_GET['password'];

        $query = "SELECT * FROM user_profile WHERE user_profile = '".$user."'";
        
        $res = mysqli_query($connect, $query);
        
        if(mysqli_num_rows($res)>0){
            $entry = mysqli_fetch_assoc($res);
            
            if(password_verify($password, $entry['pass'])){
                $_SESSION['username'] = $_GET['username']; //CREAZIONE SESSIONE
                $_SESSION['night_shift'] = 'false'; //CREAZIONE SESSIONE
                $result= array(
                    "error" => 0,
                    "content" => "Accesso Effettuato!",
                );
                
                echo json_encode($result);
                mysqli_free_result($res);
                mysqli_close($connect);
                exit;
            }
            else{
                $error= array(
                    "error" => 1,
                    "error_text" => "Invalid Password!",
                );
                echo json_encode($error);
                mysqli_free_result($res);
                mysqli_close($connect);
                exit;
            }
        }
        else{
            $error= array(
                "error" => 1,
                "error_text" => "Invalid Username!",
            );
            echo json_encode($error);
            exit;
        }
    }
    else{
        $error= array(
            "error" => 1,
            "error_text" => "Inserire username e password",
        );
        echo json_encode($error); //Qualora l'input username e password siano stati messi male
        exit;
    }

?>
