
const profile_head_section = document.querySelector('#profile_head_section');
const form = document.querySelector('form');
const change_photo_button = document.querySelector('#change_image');
const exit_profile_button = document.querySelector('#exit_account');

exit_profile_button.addEventListener('click', function () {location.href = "../closeSession.php";});
checksession_pf();

function checksession_pf(){
    fetch('http://localhost/Vehicles/ctrl_session.php')
    .then((response) => {return response.json()})
    .then((object) => {

        if(object.error == 0){
            /* EFFETTUO LA QUERY AL DATABASE PER OTTENERE TUTTI I DATI DELL'UTENTE */
            fetch('get_profile_data.php?username='+object.session)
            .then((profile_response) => {return profile_response.json()})
            .then((profile_data) => 
            {
                        console.log(profile_data);

                        if(profile_data.error_dat == 1)
                            location.href = "../closeSession.php";
                        else{
                            create_profile_header(profile_data.header);
                            
                            if(profile_data.error_fav != 1)
                                for(let auto of profile_data.favourite)
                                    create_favourite_list(auto);
                                
                        }

                    });
        }
        else{
            location.href = "../../login/login.html";
        }
    });
}


/**********************************CREO L'HEADER (FOTO + NOME + COGNOME + MAIL) **********************************/
function create_profile_header(data){
    const contenitore = document.querySelector('#profile_description_container');
    
    const username = document.querySelector('h1');
    const nome = document.querySelector('#feature_nome');
    const cognome = document.querySelector('#feature_cognome');
    const email = document.querySelector('#feature_mail');
    
    username.textContent = data.username;
    nome.textContent = data.nome;
    cognome.textContent = data.cognome;
    email.textContent = data.email;
    
    //username.classList.add('profile_feature');
    nome.classList.add('profile_feature');
    cognome.classList.add('profile_feature');
    email.classList.add('profile_feature');
    
    
    /***************    CHECK PROFILE PHOTO **************/
    const profile_photo = document.querySelector('#profile_photo');
    checkphoto(data.username);
}


function checkphoto(username){
    fetch('profile.php?username='+username)
    .then((response) => {return response.json()})
    .then((object) => 
    {
        if(object.error == 0 && object.content.photo != null){
                    const profile_photo = document.querySelector('#profile_photo');
                    profile_photo.src = object.content.photo;
                }
            });
        }
        

/****************************** CREO LA SEZIONE LISTA DI PREFERITI  ****************************/

function create_favourite_list(data){
    const make = data.Make_Name;
    const model = data.Model_Name;
    const type = data.vehicleType;
    const container_list = document.querySelector('#container_favourite_list');
    
    console.log(type);
    
    const container = document.createElement('div')
    container.classList.add('container_favourite_element');
    container.id = type;
    const container_title_descr = document.createElement('div')
    const img = document.createElement('img');
    img.classList.add('favourite_image');
    const title = document.createElement('h3');
    const description_cont = document.createElement('div');
    const span_make_title = document.createElement('span');
    const span_make_content = document.createElement('span');
    span_make_title.classList.add('span_title');
    span_make_content.classList.add('span_descrition');
    
    title.textContent = model;
    span_make_title.textContent = "Marca: "
    span_make_content.textContent =make;
    
    description_cont.appendChild(title);
    span_make_title.appendChild(span_make_content);
    description_cont.appendChild(span_make_title);
    description_cont.classList.add('title_description_container');
    
    //Devo impostare il src dell'immagine
    if(type == "bike"){
        img.src = '../images/motocycle.png';
    }
    else{

        fetch("get_profile_data.php?Make_Name="+make+"&Model_Name="+model)
        .then((response) => {return response.json()})
        .then((object) => 
        {
            img.src = "data:image/png;base64, " + object;
        });
    }
        
    container.appendChild(img);
    container.appendChild(description_cont);
    
    if(container.id != "bike")
        container.addEventListener('click', goConfigurator);
    console.log("evento aggiunto");

    const heart = document.createElement('img');
    heart.src = "../images/heart_filled.png";
    heart.classList.add('heart');
    heart.classList.add('favourite');
    heart.addEventListener('click',addToFavourite);
    description_cont.appendChild(heart);
        
    container_list.appendChild(container);
}

/****************************TORNARE AL CONFIGURATORE SE SI CLICCA UN'AUTO TRA I PREFERITI **********************************/
function goConfigurator(event){
    console.log("cliccato");
    const blocco = event.currentTarget;
    const Model_Name = blocco.querySelector('h3').textContent;
    const Make_Name = blocco.querySelector('.span_descrition').textContent;
    location.href="../Configuratore/configuratore.html?MakeName="+Make_Name+"&ModelName="+Model_Name;
}

/**************************STESSA FUNZIONE DEL FILE configuratore.js RIMOZIONE/RIMESSA DEL CUORICINO *******************************************/
function addToFavourite(event){
    event.stopPropagation();
    const heart = event.currentTarget;
    const blocco = heart.parentNode;
    const container = heart.parentNode.parentNode;
    const ModelName = blocco.querySelector('h3').textContent;
    const MakeName = blocco.querySelector('.span_descrition').textContent;
    //EFFETTUO LA QUERY PER SALVARE IL "FAVOURITE"
    if(heart.classList.contains('not_favourite')){
        fetch("../Configuratore/configuratore.php?insert=1&type="+container.id+"&MakeName_favourite="+MakeName+"&ModelName_favourite="+ModelName)
        .then((response) => {return response.json()})
        .then((object) => 
        {
            console.log(object);
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
        fetch("../Configuratore/configuratore.php?remove=1&type=car&MakeName_favourite="+MakeName+"&ModelName_favourite="+ModelName)
        .then((response) => {return response.json()})
        .then((object) => 
        {
                console.log(object);
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
        
        
        



/***************************** CHANGE IMAGE EVENT ****************************/
const cross = document.querySelector('#cross_close_modal');
cross.addEventListener("click", closeModal);

function closeModal(event){
    modal_container.classList.add('disappear');
    document.querySelector('#upload .file_name').textContent = "Seleziona un file...";
    document.querySelector('#upload .file_size').textContent = "";
    document.querySelector('#selection_photo').removeAttribute('src');
    document.querySelector('.error_box_container').classList.add('disappear');
    photo_upload.value= "";
    
}

const photo_upload = document.querySelector('#upload_original');
change_photo_button.addEventListener('click', change_photo_modal);
const modal_container = document.querySelector('#photo_container_modal');

function change_photo_modal(event){
    
    if(modal_container.classList.contains('disappear')){
        modal_container.classList.remove('disappear');
        photo_upload.addEventListener('change', change_photo_event);
        document.body.style.overflow= "hidden";
        //bottone_invio_provvisorio.addEventListener('click', clickHandler);
        
        function change_photo_event(event){
            const img_provvisorio = document.querySelector('#selection_photo');
            const upload_original = event.currentTarget;
            const o_size = upload_original.files[0].size;       //PRENDE L'ESTENSIONE DEL FILE DAL SUO NOME
            const mb_size = o_size/1000000;
            document.querySelector('#upload .file_name').textContent = upload_original.files[0].name;
            document.querySelector('#upload .file_size').textContent = mb_size.toFixed(2)+" MB";
                    const ext = upload_original.files[0].name.split('.').pop();
                    
                    if(o_size >= 7000000){
                        document.querySelector('.error_box_container').classList.remove('disappear');
                        document.querySelector('#error_message').textContent = "Dimensione file oltre 7 MB";
                        
                    }
                    else if(!['jpeg', 'jpg', 'png', 'gif'].includes(ext))  {
                        document.querySelector('.error_box_container').classList.remove('disappear');
                        document.querySelector('#error_message').textContent = "Estensione non consentita";
                    }else {
                        document.querySelector('.error_box_container').classList.add('disappear');
                        img_provvisorio.src = URL.createObjectURL(upload_original.files[0]);
                        
                        const bottone_invio_provvisorio = document.querySelector('#cambia_immagine');
                        bottone_invio_provvisorio.addEventListener('click', update_profile_photo);
                    }
                }
    }
    else{
        modal_container.classList.add('disappear');
    }
}


/*************************** UPDATE PROFILE PHOTO ***************************/

function update_profile_photo(event){
    const form_data = {method: 'post', body: new FormData(form)};

    fetch('profile.php', form_data)
    .then((response) => {return response.json()})
    .then((object) => 
    {
        if(object.error == '1')
        {
            document.querySelector('.error_box_container').classList.remove('disappear');
            document.querySelector('#error_message').textContent = object.content;
            
        }
        else
        {
            
            fetch('profile.php?destination='+object.content)
            .then((response_mysql) => {return response_mysql.json()})
            .then((object_mysql) => 
            {
                if(object_mysql.error == 1){
                    document.querySelector('.error_box_container').classList.remove('disappear');
                    document.querySelector('#error_message').textContent = object_mysql.content;
                }
                else{
                    const profile_photo = document.querySelector('#profile_photo');
                    profile_photo.src = object.content;
                    modal_container.classList.add('disappear');

                }
            }); 
            
        }
        
    });
            
    
}

