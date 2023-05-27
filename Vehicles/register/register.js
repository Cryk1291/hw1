/* FORM GESTION */
const form = document.querySelector('form');
form.addEventListener('submit', form_handler);

function form_handler(event){
    event.preventDefault();

    const nome = form.name.value;
    const surname = form.surname.value;
    const user = form.username.value;
    const email = form.mail.value;
    const pass = form.password.value;

    fetch("register.php?name="+nome+"&surname="+surname+"&username="+user+"&e-mail="+email+"&password="+pass)
    .then((response) => {return response.json()})
    .then((object) => 
            {   
                /* CREAZIONE BOX */
                const box = document.querySelector('#check_box_container');
                if(object.error == 1){
                    box.classList.add('error_code_box');
                    box.textContent = object.error_text;
                }
                else{
                    box.innerHTML = "";
                    const scritta1 = document.createElement('div.check_code_box_content');
                    const scritta2 = document.createElement('div.check_code_box_content');
                    const vector = object.content.split('!');
                    scritta1.textContent = vector[0];
                    scritta2.textContent = vector[1];
                    box.classList.add('check_code_box');
                    box.appendChild(scritta1);
                    box.appendChild(scritta2);
                    setTimeout(function() {location.href = "../login/login.html";}, 800);                    
                }
            });


}





/******************************************************** NIGHT SHIFT OPTION *********************************************************************/
const night_shift_button = document.querySelector('#night_shift');
night_shift_button.addEventListener('click', night_shift);

function night_shift(event){
    const button_night_shift = event.currentTarget; //CONTENITORE DEL NIGHT SHIFT
    const button_sender = document.querySelector("#button");
    const night_shift_lever = document.querySelector('#night_shift_lever');
    const body = document.querySelector('body');
    
    if(button_night_shift.classList.contains("OFF")){
        button_night_shift.style.backgroundColor = "black"
        night_shift_lever.classList.add("Lever_On");
        night_shift_lever.classList.remove("Lever_Off");
        button_night_shift.classList.add("ON");
        button_night_shift.classList.remove("OFF");
        body.classList.add("night_shift_on");
        body.classList.remove("night_shift_off");
    }
    else{
       button_night_shift.style.backgroundColor = "white";
       night_shift_lever.classList.add("Lever_Off");
       night_shift_lever.classList.remove("Lever_On");
       button_night_shift.classList.remove("ON");
       button_night_shift.classList.add("OFF");
       body.classList.remove("night_shift_on");
       body.classList.add("night_shift_off");
       
    }
    
}


const nome = document.querySelector('#name');
const surname = document.querySelector('#surname');
const user = document.querySelector('#username');
const email = document.querySelector('#e-mail');
const pass = document.querySelector('#password');
const button = document.querySelector('#button');
const send = [0,0,0];



surname.addEventListener('keyup', user_handler);
nome.addEventListener('keyup', user_handler);
user.addEventListener('keyup', user_handler);
email.addEventListener('keyup', email_handler);
pass.addEventListener('keyup', password_handler);

button.addEventListener('click', review_answer);



/*****************NAME, SURNAME, USER ***************************/
function user_handler(event){
    const user = (event.currentTarget).querySelector('input');
    const error = (event.currentTarget).querySelector('span');
    error.textContent = "Invalid input";
    if((!/^(([^<>()\[\]\\.,-;:@"]+(\.[^<>()\[\]\\.,-;:@"]+)*))$/.test(String(user.value).toLowerCase())) || user.value.length > 39){
        send[0]=0;
        error.classList.remove("invisible");
    }
    else{
        send[0]=1;
        error.classList.add("invisible");
    }
}

/**************************** EMAIL ******************************/
function email_handler(event){
    const mail = (event.currentTarget).querySelector('input');
    const error = (event.currentTarget).querySelector('span');
    error.textContent = "Inserire una mail valida";
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(mail.value).toLowerCase())){
        send[1]=0;
        error.classList.remove("invisible");
    }
    else{
        send[1]=1;
        error.classList.add("invisible");
    }
}

/***************************** PASS *******************************/
function password_handler(event){
    const pass = (event.currentTarget).querySelector('input');
    const error = (event.currentTarget).querySelector('span');
    if(pass.value.length < 6){
        send[2]=0;
        error.textContent = "Inserire almeno 6 caratteri";
        error.classList.remove("invisible");
    }
    else if(!(containNumber(pass.value))){
        send[2]=0;
        error.classList.add("invisible");
        error.textContent = "Inserire almeno un numero";
        error.classList.remove("invisible");
    }
    else if(!(containUppercase(pass.value))){
        send[2]=0;
        error.textContent = "Inserire almeno una maiuscola";
        error.classList.remove("invisible");
    }else{
        send[2]=1;
        error.classList.add("invisible");
    }
    
    
}

function review_answer(event){
    if(send[0]== 0 || send[1]== 0 || send[2]== 0){
        event.preventDefault();
    }
}



function containUppercase(str){
    return /[A-Z]/.test(str);
}


function containNumber(str){
    return /[0-9]/.test(str);
}




/*
function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function delay(button, state){
    await sleep(100);
    console.log(button.style.justifyContent);
}*/









