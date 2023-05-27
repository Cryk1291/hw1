const profile = document.querySelector("#header_profile");
const contenitore = document.querySelector("#header_profile_access");


const header_selection = document.querySelectorAll('.header.selection');
contenitore.innerHTML = "";

checksession_hp();

/********** HEADER SELECTION BUTTON EVENTS *****************/
for(let bottone of header_selection){
  bottone.addEventListener('click', redirection);
}

function redirection(event){
  if(event.currentTarget.id =="header_profile"){
    location.href = "http://localhost/Vehicles/homepage/profile/profile.html";
    console.log(event.target);
  }
}


function guest_popup_appear(event) {
  contenitore.classList.remove("disappear");
  const scritta1 = document.createElement("div");
  const scritta2 = document.createElement("div");
  const button2 = document.createElement("button");
  const scritta3 = document.createElement("div");
  const button3 = document.createElement("button");

  contenitore.classList.remove("visible");
  scritta1.textContent = "Ops! Non sei loggato";
  scritta2.textContent = "Possiedi gia' un account?";
  button2.textContent = "login";
  button2.classList.add("login_register_button");
  button2.addEventListener('click', login_button_pressed);
  // button2.href = "http://localhost/esempi/database/agenda/login/login.html";
  scritta3.textContent = "Se non ne possiedi uno Registrati";
  button3.textContent = " Registrati";
  button3.classList.add("login_register_button");
  button3.addEventListener('click', register_button_pressed);
  //a3.href = "http://localhost/esempi/database/agenda/register/register.html";

  contenitore.appendChild(scritta1);
  contenitore.appendChild(scritta2);
  contenitore.appendChild(button2);
  contenitore.appendChild(scritta3);
  contenitore.appendChild(button3);
}

function profile_popup_appear(event) {
  const profilo = event.currentTarget;
  const name = profile.querySelector("name");
  contenitore.classList.remove("disappear");
  const profile_container = document.createElement("div");  //CONTAINER DI TUTTO
  const profile_image = document.createElement("img");      //CONTAINER IMMAGINE DI PROFILO
  const profile_name = document.createElement("div");       //CONTAINER NOME DEL PROFILO
  const profile_search_counter = document.createElement("div"); //CONTAINER COUNTER RICERCHE EFFETTUATE
  const image_url = document.createElement("a");            //URL IMMAGINE DEL PROFILO CHE RIPORTA ALLA HOME PAGE
  
  const specifics = document.createElement('div');           //CONTENITORE PARTE DI SCRITTURA A DESTRA DELLA FOTO
  specifics.classList.add('specifics');
  
  //BOTTONE DI USCITA DALL'ACCOUNT
  const exit_button = document.createElement('button');
  exit_button.addEventListener('click', closeSession)  
  exit_button.classList.add('exit_button');                          //IMPOSTO L'EVENTO DI USCITA AL BUTTON
  exit_button.textContent = "Esci dall'Account";
  
  
  profile_container.id = "profile_popup_container";
  
  fetch('http://localhost/Vehicles/ctrl_session.php')
    .then((object) => {return object.json()})
    .then((response) =>
    {
      if(response.error==0){
              /********************************** FACCIO LA QUERY PER OTTENERE L'IMMAGINE DI PROFILO ****************************************/
        fetch('http://localhost/Vehicles/getProfileImage.php?username='+response.session)
        .then((response) => {return response.json()})
        .then((object) => 
          {
            if(object.error==1){
              console.log(object);
              profile_image.src = "http://localhost/Vehicles/homepage/profile/assets/profile.png";
            }
            else{
              console.log(object);
              profile_image.src = "http://localhost/Vehicles/homepage/profile/"+object.content;
            }
          });
          image_url.href = "http://localhost/Vehicles/homepage/profile/profile.html";
  
            profile_image.classList.add("profile_image");
            profile_name.id = "profile_name";
            profile_name.classList.add("profile_write");
            profile_search_counter.classList.add("profile_write");
            profile_search_counter.id= "profile_search_counter"
            profile_name.textContent = response.session;                  //NOME DEL PROFILE DENTRO IL RIQUADRO BIANCO
          profile_search_counter.textContent = "Ricerche effettuate: 0";    //RICERCHE EFFETTUATE
  
          image_url.appendChild(profile_image);
          profile_container.appendChild(image_url);
          specifics.appendChild(profile_name);
          specifics.appendChild(profile_search_counter);
          specifics.appendChild(exit_button);
  
          profile_container.appendChild(specifics);
          contenitore.appendChild(profile_container);
      
      }
  });
}


/***************************************************** PROFILE POPUP DISAPPEAR **************************************************************/
function profile_popup_disappear(event) {
   contenitore.innerHTML = "";               //CANCELLA TUTTO L'HTML (QUINDI NASCONDE ANCHE IL BANNER)
   contenitore.classList.add("disappear");   //NASCONDE IL BANNER MA L'HTML RIMANE
}


function login_button_pressed(event){
  event.stopPropagation();
  location.href ="http://localhost/Vehicles/login/login.html";
}
function register_button_pressed(event){
  event.stopPropagation();
  location.href = "http://localhost/Vehicles/register/register.html";
}


/************************************************ NIGHT SHIFT ********************************************************/
const night_shift_button = document.querySelector('#night_shift');
night_shift_button.addEventListener('click', night_shift);

function night_shift(event){
  const button_night_shift = event.currentTarget; //CONTENITORE DEL NIGHT SHIFT
  const night_shift_lever = document.querySelector('#night_shift_lever');
  const body = document.querySelector('body');
  let setting;

  fetch('http://localhost/Vehicles/NightShift.php?set=1')
  .then((response) => {return response.json();})
  .then((object) => 
    { console.log(object);
      night_shift_click();
    });
}

function night_shift_click(event){
  
    fetch('http://localhost/Vehicles/NightShift.php?check=1')
    .then((response) => {return response.json();})
    .then((object) => {
        night_shift_change(object);
      }); 
}



function night_shift_change(state){
  const button_night_shift = document.querySelector('#night_shift'); //CONTENITORE DEL NIGHT SHIFT
  const night_shift_lever = document.querySelector('#night_shift_lever');
  const body = document.querySelector('body');

  if(state == 'false'){  //FALSE == NIGHT SHIFT SPENTO
    button_night_shift.style.backgroundColor = "white";
    night_shift_lever.classList.add("Lever_Off");
    night_shift_lever.classList.remove("Lever_On");
    button_night_shift.classList.remove("ON");
    button_night_shift.classList.add("OFF");
    body.classList.remove("night_shift_on");
    body.classList.add("night_shift_off"); 
  } 
  else{
    button_night_shift.style.backgroundColor = "black"
    night_shift_lever.classList.add("Lever_On");
    night_shift_lever.classList.remove("Lever_Off");
    button_night_shift.classList.add("ON");
    button_night_shift.classList.remove("OFF");
    body.classList.add("night_shift_on");
    body.classList.remove("night_shift_off");
  }
}


/**************************************************** GEAR MENU TENDINA ANIMAZIONE **************************************************/
const gear = document.querySelector('.gear_image');
gear.addEventListener('click', gear_event);

function gear_event(event){
  const settings_container = document.querySelector('#gear_setting_container');
  settings_container.classList.remove('disappear');
  
  if(settings_container.classList.contains('open')){
    settings_container.classList.replace('open', 'close');
    setTimeout(disappearing_element_function, 500);
  }
  else{
    settings_container.style.display = 'block';
    settings_container.classList.replace('close', 'open');
  }
  
}
function disappearing_element_function(){
  const settings_container = document.querySelector('#gear_setting_container');
  settings_container.style.display = 'none';
}



/**************************************************CHECK SESSION FUNCTION **********************************************/
  function checksession_hp() {
    fetch('http://localhost/Vehicles/ctrl_session.php')
      .then(onSessionResponse)
      .then(onText);
  }

  function onSessionResponse(response) {
    return response.json();
  }
  
  function onText(text) {
    const name = profile.querySelector("name");
  
    if(text.error == 0 && text.night_shift != null && text.night_shift != 'false'){
      night_shift_change(text.night_shift);
    }
    
    if (text.error == 0) {
      name.textContent = text.session;                    //NOME DEL PROFILE NELL'HEADER
      profile.addEventListener("mouseenter", profile_popup_appear);
      profile.addEventListener("mouseleave", profile_popup_disappear);
      
    } else {
      name.textContent = "Profile";
      profile.addEventListener("mouseenter", guest_popup_appear);
      profile.addEventListener("mouseleave", profile_popup_disappear);
    }
  }




function closeSession(event){
    event.stopPropagation();
    location.href = "http://localhost/Vehicles/homepage/closeSession.php";
}
