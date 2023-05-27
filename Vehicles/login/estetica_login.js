/*NIGHT SHIFT OPTION */
const night_shift_button = document.querySelector('#night_shift');
night_shift_button.addEventListener('click', night_shift);


function night_shift(event){
    const button_night_shift = event.currentTarget; //CONTENITORE DEL NIGHT SHIFT
    const button_sender = document.querySelector("#button");
    const night_shift_lever = document.querySelector('#night_shift_lever');
    const body = document.querySelector('body');
    const container = document.querySelector('#container');
    
    if(button_night_shift.classList.contains("OFF")){
        button_night_shift.style.backgroundColor = "black"
        night_shift_lever.classList.remove("Lever_Off");
        night_shift_lever.classList.add("Lever_On");
        button_night_shift.classList.remove("OFF");
        button_night_shift.classList.add("ON");
       // button_sender.classList.replace("night_shift_off","night_shift_on");
        body.classList.remove("night_shift_off");
        body.classList.add("night_shift_on");
        
    }
    else{
        button_night_shift.style.backgroundColor = "white";
        night_shift_lever.classList.remove("Lever_On");
        night_shift_lever.classList.add("Lever_Off");
        button_night_shift.classList.remove("ON");
        button_night_shift.classList.add("OFF");
       // button_sender.classList.replace("night_shift_on","night_shift_off");
       body.classList.remove("night_shift_on");
       body.classList.add("night_shift_off");
       
    }
    
}