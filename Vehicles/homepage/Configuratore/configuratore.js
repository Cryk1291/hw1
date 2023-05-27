checksession();


const url = new URL(window.location.href);

const MakeName = url.searchParams.get("MakeName");
const ModelName = url.searchParams.get("ModelName");

/****************************************************NIGHT SHIFT EVENT ****************************************************/
function night_shift_event(){
    const container_features = document.querySelector('.background_features_container');
        if(night_shift_button.classList.contains("OFF")){
            container_features.style.color = 'white';
            console.log("divento bianco");
        }
        else{
            console.log("divento nero");
            container_features.style.color = 'black';
        }
    
}


night_shift_button.addEventListener('click', night_shift_event);
//In parameters prendo MAKEID e MODELID a partire dal link, (che viene inviato dal js)


const car_title = document.querySelector('#car_title_span');
car_title.textContent = ModelName;


const angle = ['28', '23', '29', '01', '05', '09', '13', '17', '21'];
const tot_photos = angle.length;
getphotos();
getColors();
checkFavourite();

/********************************* FUNZIONE OTTENIMENTO DELLA FOTO (BIANCA) **********************************/
function getphotos(){
    console.log("entro");

    const modal = document.querySelector('#Loading_Layout');
    const modal_dynamic_test = document.querySelector('#dynamic_loading')
    modal.style.display = 'flex';
    modal.style.top = window.pageYOffset + 'px';
    modal_dynamic_test.textContent = '(0 of '+tot_photos+") photos loaded!";
    document.body.classList.add('noScroll');

    let counter = 1;

    const container = document.querySelector('#foto_container');
    const previous_photo = document.querySelector('#previous_photo');
    const next_photo = document.querySelector('#next_photo');
    next_photo.addEventListener('click', nextPhoto);
    previous_photo.addEventListener('click', previousPhoto);

    for(let angolo of angle){
        console.log(angolo);
        fetch("configuratore.php?MakeName="+MakeName+"&ModelName="+ModelName+"&angle="+angolo)
        .then((response) => {return response.json()})
        .then((object) => {
            if(object.error == 0){
                    const img = document.createElement('img');
                    if(angolo == angle[0]){
                        img.classList.add('appear');
                    }
                    else{
                        img.classList.add('disappear');
                    }
                    
                    img.classList.add('imageCollection');
                    img.id = "angle_" + angolo;
                    counter++;
                    img.setAttribute('color', 'gray');
                    img.src = "data:image/png;base64, " + object.content;
                    container.appendChild(img);
                    modal_dynamic_test.textContent = '('+counter+' of '+tot_photos+") photos loaded!";

                    if(angolo == angle[tot_photos-1]){
                        modal.style.display = 'none';
                        document.body.classList.remove('noScroll');
                    }
            }
            else{
                console.log("Mettere tornare alla homepage");
            }
        
        });   
    }
}




/******************************* FUNZIONE PER SCORRERE INDIETRO LE FOTO CON LA FRECCIA SX *********************************/
function previousPhoto(event){
    const photoVisible = document.querySelector('.appear'); 
    const allPhotos = document.querySelectorAll('.imageCollection');
    
    for(let i=0; i<allPhotos.length; i++){
        if(allPhotos[0] == photoVisible){
            allPhotos[0].classList.replace('appear','disappear');
            allPhotos[allPhotos.length-1].classList.replace('disappear','appear');
            break;
        }
        else if(allPhotos[i] == photoVisible){
            allPhotos[i].classList.replace('appear', 'disappear')
            allPhotos[i-1].classList.replace('disappear', 'appear');
            break;
        }
    }
}
/******************************* FUNZIONE PER SCORRERE AVANTI LE FOTO CON LA FRECCIA DX *********************************/

function nextPhoto(event){

    const photoVisible = document.querySelector('.appear'); 
    const allPhotos = document.querySelectorAll('.imageCollection');
    
    for(let i=0; i<allPhotos.length; i++){
        if(i == allPhotos.length-1){
            allPhotos[i].classList.replace('appear','disappear')
            allPhotos[0].classList.replace('disappear','appear');
            break;
        }
        if(allPhotos[i] == photoVisible){
            allPhotos[i].classList.replace('appear', 'disappear');
            allPhotos[i+1].classList.replace('disappear', 'appear');
            break;
        }
    }
}

/****************************** OTTENGO I COLORI DISPONIBILI PER QUELL'AUTO *******************************************************/

function getColors(){
    fetch("configuratore.php?MakeName_color="+MakeName+"&ModelName_color="+ModelName)
    .then((response) => {return response.json()})
    .then((object) => {

        const color_container = document.querySelector('#color_setting');
        const features_container = document.querySelector('.features_container');
        //console.log(object);
        for(let color of Object.entries(object.paintData.paintCombinations)){
            const section_color_container = document.createElement('div');
            section_color_container.classList.add('section_color_container');
            const colore = document.createElement('div');
            let disponibilita;
            
            for(let temporary of Object.entries(color[1].mapped)){
             //   console.log(temporary);
                colore.id = temporary[1].paintDescription;
                disponibilita = temporary[1].available;
                break;
            }
            if((colore.id).length && disponibilita == true){
                colore.classList.add('color_selection'); 
                colore.style.backgroundColor = color[1].paintSwatch.primary.highLight;
                colore.addEventListener('mouseenter', nameappear);
                colore.addEventListener('mouseleave', namedisappear);
                colore.addEventListener('click', requestColor);
                section_color_container.appendChild(colore);
                color_container.appendChild(section_color_container);
                
                features_container.appendChild(color_container);
            }

        }
    
    });
}

function nameappear(event){
    const colore = event.currentTarget;
    const color_name = document.querySelector('#color_name_changing');
    color_name.textContent = colore.id;
}
function namedisappear(event){
    const color_name = document.querySelector('#color_name_changing');
    const Photo = document.querySelector('.imageCollection');
    color_name.textContent = Photo.getAttribute('color'); //variabile definita all'inizio, a partire dall'url
}


/********************************* FUNZIONE DI CAMBIO DEL COLORE DELL'AUTO ***************************************/

function requestColor(event){
    console.log("richiesta cambio colore");
    const colorName = event.currentTarget.id;
    const allPhotos = document.querySelectorAll('.imageCollection');
    
    
    const modal = document.querySelector('#Loading_Layout');
    const modal_dynamic_test = document.querySelector('#dynamic_loading')

    modal.style.display = 'flex';
    modal.style.top = window.pageYOffset + 'px';
    modal_dynamic_test.textContent = '(0 of '+tot_photos+") photos loaded!";
    document.body.classList.add('noScroll');

    let counter = 0;
    
    for(let i = 0; i<tot_photos; i++){
        fetch("configuratore.php?MakeName="+MakeName+"&ModelName="+ModelName+"&angle="+angle[i]+"&color="+colorName)
        .then((response) => {return response.json();})
        .then((object) => 
        {
            if(object.error == 0){
                counter++;
                console.log("Risultato ottenuto");
                    console.log("Imposto il source");
                    allPhotos[i].src = "data:image/png;base64, " + object.content;
                    allPhotos[i].setAttribute('color', colorName);
                    modal_dynamic_test.textContent = '(' + counter + ' of '+tot_photos+") photos loaded!";
                    
                    if(i== tot_photos-1){

                        const color_name = document.querySelector('#color_name_changing');
                        color_name.textContent = colorName;
                        modal.style.display = 'none';
                        document.body.classList.remove('noScroll');
                    }
            }
        });
    }
}




/**************************************** ADD TO FAVOURITE ****************************/

const heart = document.querySelector('#heart');
heart.addEventListener('click', addToFavourite);

function checkFavourite(){
    fetch("configuratore.php?check=1&MakeName_favourite="+MakeName+"&ModelName_favourite="+ModelName)
    .then((response) => {return response.json()})
    .then((object) => {

            if(object.error == 1){
                heart.classList.add('not_favourite');
                heart.src = "../images/heart_empty.png"
            }
            else{
                heart.classList.add('favourite');
                heart.src = "../images/heart_filled.png"
            }
        });

}

function addToFavourite(event){
    //EFFETTUO LA QUERY PER SALVARE IL "FAVOURITE"
    console.log("click_received");
    if(heart.classList.contains('not_favourite')){
        console.log("non favorito");
        fetch("configuratore.php?insert=1&type=car&MakeName_favourite="+MakeName+"&ModelName_favourite="+ModelName)
        .then((response) => {return response.json()})
        .then((object) => 
        {

            if(object.error == 0){
                heart.src = "../images/heart_filled.png"
                heart.classList.replace('not_favourite', 'favourite');
            }
            else{
                console.log(object.content);
            }
        });
    }
    else if(heart.classList.contains('favourite')){
        console.log("favorito");
        fetch("configuratore.php?remove=1&MakeName_favourite="+MakeName+"&ModelName_favourite="+ModelName)
        .then((response) => {return response.json()})
        .then((object) => 
        {
                if(object.error == 0){
                    heart.src = "../images/heart_empty.png"
                    heart.classList.replace('favourite', 'not_favourite');
                }
                else{
                    console.log(object.content);
                }
            });

    }
}









function checksession() {
 fetch(
      "../../ctrl_session.php"
            )
            .then(onSessionResponse)
            .then(onText);
        }

        async function onSessionResponse(response) {
            return response.json();
        }
        
        async function onText(text) {
            if(text.error == 1)
                window.location.href = "../../login/login.html";
        }


  


