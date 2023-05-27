const form = document.querySelector('form');
form.addEventListener('submit', submit_handler);

function submit_handler(event){
    event.preventDefault();
    const username = form.username.value;
    const pass = form.password.value;



    fetch("ctrl_page.php?username="+username+"&password="+pass).then(onResponse).then(onJson);
    
    function onResponse(event){
         return event.json();
    }
    
    function onJson(object){
        if(object.error == 1){
            /*CREAZIONE BOX ERRORE*/
            const error_box = document.querySelector('#error_box_container');
            error_box.textContent = object.error_text;
            error_box.classList.add('error_code_box');
        }
        else{
            location.href="../homepage/homepage.html";
        }
    
    }

}


