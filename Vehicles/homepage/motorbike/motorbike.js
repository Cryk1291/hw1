const form = document.querySelector('form');

checksession();


function checksession(){
    fetch("../../ctrl_session.php")
    .then((response) => {return response.json()})
    .then((object) => 
        {
            if(object.error == 1){
                const button = document.querySelector('#search_button');
                button.classList.add('notClickable');
                document.querySelector('.error_message_container').style.display = 'flex';
                form.addEventListener('submit', function (event){event.preventDefault();})
            }
            else
                form.addEventListener('submit', handler);

        });
}

function handler(event){
    event.preventDefault();
    const Make_Name = (document.querySelector('#vehicles_make').value).replaceAll(" ", "");
    const Model_Name = (document.querySelector('#vehicles_model').value).replaceAll(" ", "")
    const year = document.querySelector('#vehicles_year').value;
    let url;

    
    if(Model_Name == "" && year == "")
        url = 'motorbike.php?Make_Name='+Make_Name;     
    else if(Model_Name != "" && year == "")
        url = 'motorbike.php?Make_Name='+Make_Name+'&Model_Name='+Model_Name;
    else 
        url = 'motorbike.php?Make_Name='+Make_Name+'&Model_Name='+Model_Name+'&year='+year;     
    
    console.log(Make_Name);
    console.log(url);
    console.log(year);

    fetch(url)
    .then((response) => {return response.json()})
    .then((object) => 
            {
                if(object.lenght == 0){
                    console.log("Nessun elemento trovato!");
                }
                else{
                    const container = document.querySelector('#bikes_container');
                    container.innerHTML = "";
                    for(let bike of object){
                        const container_bike = document.createElement('div');
                        const left = document.createElement('div');
                        const right = document.createElement('div');
                        
                        const bike_name = document.createElement('h2');
                        const heart = document.createElement('img');
                        heart.id = "heart_image";
                        heart.addEventListener('click', favouriteHandler);
                        bike_name.textContent = bike.model;
                        bike_name.appendChild(heart);
                        container_bike.appendChild(bike_name);
                        
                        const content_container = document.createElement('div');
                        content_container.classList.add('content_container');
                        fetch("../../NightShift.php?check=1")
                        .then((response) => {return response.json()})
                        .then((object) => { console.log(object);
                                            if(object == 'true')
                                                container_bike.classList.add('bike_night_shift_ON');
                                            });
                        content_container.appendChild(left);
                        content_container.appendChild(right);
                        container_bike.appendChild(content_container);
                        let i = 0;
                        let make;
                        let model; 
                        
                        for(let [key,valore] of Object.entries(bike)){
                            const feature_container = document.createElement('div');
                            const title = document.createElement('div');
                            const value = document.createElement('span');
                            
                            title.classList.add('bold');
                            value.classList.add('bold');
                            if(key == "make"){
                                title.id = "make";
                                make = valore;
                            }
                            if(key == "model"){
                                title.id = "model";
                                model = valore;
                            }
                            title.textContent = key + ": ";
                            value .textContent = valore;
                            title.appendChild(value);
                            
                            
                            feature_container.classList.add('feature_container');
                            feature_container.appendChild(title);
                            
                            if(i%2) //(i è pari)
                                left.appendChild(feature_container);
                                else
                                right.appendChild(feature_container);
                                i++;
                            }
                        checkheart(heart, make, model);
                        container_bike.classList.add('container_bike');
                        left.classList.add('side_container');
                        right.classList.add('side_container');
                        container.appendChild(container_bike);
                    }
                }
            });

}
        
        
/*************************************FAVOURITE HANDLER **************************************/
function checkheart(heart, Make_Name, Model_Name){
    const container = heart.parentNode.parentNode;

    fetch("http://localhost/Vehicles/homepage/Configuratore/configuratore.php?check=1&MakeName_favourite="+Make_Name+"&ModelName_favourite="+Model_Name)
    .then((response) => {return response.json()})
    .then((object) => 
    {
        if(object.error == 0){
            heart.classList.add('favourite');
            heart.src = "../images/heart_filled.png";
        }
        else{
            heart.classList.add('not_favourite');
            heart.src = "../images/heart_empty.png";
        }
    });
    
}


function favouriteHandler(event){
        const heart = event.currentTarget;
        const container = heart.parentNode.parentNode;
        const Make_Name_cont = container.querySelector('#make')
        const Make_Name = Make_Name_cont.querySelector('span').textContent;
        const Model_Name_cont = container.querySelector('#model');
        const Model_Name = Model_Name_cont.querySelector('span').textContent;

        console.log(Make_Name);
        console.log(Model_Name);
        
if(heart.classList.contains('favourite')){
        heart.classList.replace('favourite','not_favourite');
        heart.src = "../images/heart_empty.png";
        fetch("http://localhost/Vehicles/homepage/Configuratore/configuratore.php?remove=1&type=bike&MakeName_favourite="+Make_Name+"&ModelName_favourite="+Model_Name)
        .then((response) => {return response.json()})
        .then((object) => {console.log(object)});
    }
    else{
        heart.classList.replace('not_favourite','favourite');
        heart.src = "../images/heart_filled.png";
        fetch("http://localhost/Vehicles/homepage/Configuratore/configuratore.php?insert=1&type=bike&MakeName_favourite="+Make_Name+"&ModelName_favourite="+Model_Name)
        .then((response) => {return response.json()})
        .then((object) => {console.log(object)});
    }

}










/*********************************SEARCH BAR REAL-TIME FILTERING  *********************************/
const button = document.querySelector('#ricerca_button');

button.addEventListener('input', real_time_filtering);

function real_time_filtering(event){
    let value = button.value;
    const bike_containers = document.querySelectorAll('.container_bike');
    
    if(value == ""){
        for(let auto of bike_containers){
            auto.classList.remove('invisible');
        }
    }
    for(let auto of bike_containers){
        const name = ((auto.querySelector('h2')).textContent).toLowerCase(); //prendo h2 --> prendo il valore --> lo converto in minuscolo

        if(!name.includes(value)){
            console.log("entrato")
            auto.style.display = "none";
        }
        else{
            auto.style.display = "flex";
        }
    }
}

/*********************************NIGHT SHIFT FUNCTIONS *********************************************/
const gear_object = document.querySelector('#night_shift');

gear_object.addEventListener('click', gear_event);

function gear_event(){
    const bike_containers = document.querySelectorAll('.container_bike');

    for(const every_container of bike_containers){
        if(every_container.classList.contains('bike_night_shift_ON')){
            every_container.classList.remove('bike_night_shift_ON');
            every_container.classList.add('bike_night_shift_OFF');
        }
        else{
            every_container.classList.add('bike_night_shift_ON');
            every_container.classList.remove('bike_night_shift_OFF');
        }
    }
}