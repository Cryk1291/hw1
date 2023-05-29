const form = document.querySelector('form');
const button = document.querySelector('#search_button');
let counter = 0;


/************************************* RICHIAMO LA FUNZIONE CHE RIEMPIE LA COLONNA DI SINISTRA SE L'ACCOUNT HA ULTIMAMENTE RICERCATO ********************************************/
check_recently_searched();


form.addEventListener('submit', search_vehicle);

function error_message_disappear(event){
    const container = document.querySelector('.error_message_container');
    container.style.display = 'none';
}

function search_vehicle(event){
    //EFFETTO UNA FETCH AL PHP PER FARGLI RICHIEDERE I DATI, GLI INVIERO I PARAMETRI INSERITI
    event.preventDefault();
    const marca = document.querySelector('#vehicles_make').value;
    const modello = document.querySelector('#vehicles_model').value;
    const anno = document.querySelector('#vehicles_year').value;
    
    if(marca == ""){
        const container = document.querySelector('.error_message_container');
        const make_input = document.querySelector('#vehicles_make');
        container.style.display = 'flex';
        make_input.addEventListener('keyup', error_message_disappear);
        make_input.addEventListener('click', error_message_disappear);
        return;
    }


    /********* CHECK FROM DATABASE *********/
    let url_db;
    let url_api;
    if(modello == ""){
        url_db = "vehicle_search_from_database.php?make="+marca;
        url_api = "vehicle_search.php?make="+marca;
    }
    else{
        url_db = "vehicle_search_from_database.php?make="+marca+"&model="+modello;
        url_api = "vehicle_search.php?make="+marca+"&model="+modello;
    }
    
    fetch(url_db)
    .then( (response) => {return response.json()})
    .then( (object) => 
    {
        const all_results = document.querySelector('#All_results_bar');
        all_results.textContent = "Caricamento in corso...";
        if(object.error == 0)
        {
            const every_block_container = document.querySelector('#every_block_container');
            const sons = every_block_container.querySelectorAll('.block_photo_container_class');
            for(let block of sons)
                if(!block.classList.contains('gray'))
                    every_block_container.removeChild(block);
            createElement(object.Results, anno);
            setAppear_Disappear_Animation();
        }
        else
        {  
            fetch(url_api)
            .then((response) => {return response.json()})
            .then((object) => 
            {   
                if(object){
                    if(object.Results.length == 0)          /*SE HO INSERITO SOLO LA MARCA E RICEVO ERRORE*/
                        createErrorBox(marca, modello);
                    else{
                        createElement(object.Results, anno); //Results viene mandato dall'api
                        setAppear_Disappear_Animation();
                    }

                }
                else{                                       /* SE HO INSERITO MARCA E MODELLO E RICEVO ERRORE*/
                    createErrorBox(marca, modello);
                }
            
                
                //    /------------SALVO I DATI NEL DATABASE SE E' STATA RICHIESTA L'INTERA MARCA-----------------/
                if(modello == ""){

                    for(let oggetto of object.Results)
                    {
                        const makeid = oggetto.Make_ID;
                        const makename = oggetto.Make_Name;
                        const modelid = oggetto.Model_ID;
                        const modelname = oggetto.Model_Name;
                        
                        fetch("vehicle_save.php?makeid="+makeid+"&makename="+makename+"&modelid="+modelid+"&modelname="+modelname)
                        .then((response) => {return response.text()})
                        .then((object) => 
                        {
                            if(object == 1){
                                console.log("Salvataggio nel database avvenuto correttamente")
                            }
                            else{
                                console.log("Errore nel salvataggio in database");
                                console.log(object);
                            }
                        });
                    }
                }
            
            });
        }
    });
}


/****************************************** FUNZIONE CREATE ELEMENT ******************************************/
function createErrorBox(marca, modello){
        const contenitore_blocco = document.createElement('div');
        const every_block_container = document.querySelector('#every_block_container');
        
        contenitore_blocco.classList.add('photo_container_class');
        contenitore_blocco.classList.add('error_block_container');
        const description1 = document.createElement('div');
        const description2 = document.createElement('div');
        description1.classList.add('title');
        description2.classList.add('title');
        
        description1.textContent = "Nessun Elemento trovato avente: ";
        description2.textContent = "Marca: " + marca;
        
        contenitore_blocco.appendChild(description1);
        contenitore_blocco.appendChild(description2);
        if(modello != ""){
            const description3 = document.createElement('div');
            description3.classList.add('title');
            description3.textContent = " e Modello:" + modello;
            contenitore_blocco.appendChild(description3);
        }
        
        const num_macchine = document.querySelectorAll('.photo_container_class').length;
        const all_results = document.querySelector('#All_results_bar');
        all_results.textContent = "Tutti i risultati ("+num_macchine+")";
        every_block_container.appendChild(contenitore_blocco);
     

}

function createElement(auto, anno){
    let url_img;
    
    const every_block_container = document.querySelector('#every_block_container');
    let FirstToEliminate = null;
    
    
    for(let i=0; i<auto.length; i++){
        if(!anno || anno < 2015 || anno > new Date().getFullYear)
            url_img = "vehicle_search.php?make_hide="+auto[i].Make_Name+"&model_hide="+auto[i].Model_Name;
        else
            url_img = "vehicle_search.php?make_hide="+auto[i].Make_Name+"&model_hide="+auto[i].Model_Name+"&modelYear="+anno;

         //   console.log(url_img);
        fetch(url_img)
        .then((response) => {return response.json()})
        .then((object) => 
                    {
                        let trovato = 0;
                        const listaAuto= document.querySelectorAll('#bookid');

                        for(let automob of listaAuto){
                            if(automob.src == "data:image/png;base64, " + object){
                                if(FirstToEliminate == null){
                                    FirstToEliminate=automob;
                                    automob.parentNode.parentNode.classList.add('invisible');
                                    automob.parentNode.parentNode.classList.add('gray');
                                }
                            trovato = 1;
                            }
                        }   
                    if(trovato == 0){
                        const img = document.createElement('img');
                        const body_container = document.querySelector('#body_container');
                        const contenitore_blocco_foto = document.createElement('div');
                        
                        
                        const preview = document.createElement('div');
                        preview.classList.add('title');
                        preview.textContent = auto[i].Model_Name;
                        preview.id = "preview_name";
                        img.id = 'bookid';
                        img.src = "data:image/png;base64, " + object;
                        
                            
                            contenitore_blocco_foto.classList.add('block_photo_container_class');
                            contenitore_blocco_foto.classList.add('not_clicked');
                            const contenitore_foto = document.createElement('div');
                            contenitore_foto.classList.add('photo_container_class');
                            contenitore_blocco_foto.id = auto[i].Model_ID;

                            
                            const description = document.createElement('div');
                            const makeId = document.createElement('span');
                            const makeName = document.createElement('span');
                            const modelId = document.createElement('span');
                            const modelName = document.createElement('span');
                            
                            const makeId_head = document.createElement('div');
                            const makeName_head = document.createElement('div');
                            const modelId_head = document.createElement('div');
                            const modelName_head = document.createElement('div');
                            const configurator_button = document.createElement('button');

                            makeId_head.classList.add("bold");
                            makeName_head.classList.add("bold");
                            modelId_head.classList.add("bold");
                            modelName_head.classList.add("bold");
                            configurator_button.classList.add("login_register_button");
                            configurator_button.id = "configurator_button";
                            
                            
                            makeId_head.textContent = "Identificativo Azienda= ";
                            makeName_head.textContent =  "Azienda Produttrice= "; 
                            modelId_head.textContent = "Identificativo Auto= ";
                            modelName_head.textContent = "Modello= ";
                            configurator_button.textContent = "Vai al configuratore ";
                            configurator_button.addEventListener('click', function (){fetch("recent_search.php?makename="+auto[i].Make_Name+"&modelname="+auto[i].Model_Name+"&clicked=1")
                                                                                        .then((response) => {return response.json()})
                                                                                        .then((object) => { console.log(object)});
                                                                                    }  
                                                                );
                            configurator_button.addEventListener('click', function (){location.href="./Configuratore/configuratore.html?MakeName="+auto[i].Make_Name+"&ModelName="+auto[i].Model_Name});

                            makeId.textContent = auto[i].Make_ID;
                            makeName.textContent = auto[i].Make_Name;
                            modelId.textContent = auto[i].Model_ID;
                            modelName.textContent = auto[i].Model_Name;
                            
                            makeId_head.appendChild(makeId);
                            makeName_head.appendChild(makeName);
                            modelId_head.appendChild(modelId);
                            modelName_head.appendChild(modelName);
                            
                            description.classList.add('description');
                            description.classList.add('invisible');
                            description.appendChild(makeId_head);
                            description.appendChild(makeName_head);
                            description.appendChild(modelId_head);
                            description.appendChild(modelName_head);
                            description.appendChild(configurator_button);
                            contenitore_foto.appendChild(img);
                            contenitore_blocco_foto.appendChild(contenitore_foto);
                            contenitore_blocco_foto.appendChild(description);
                            contenitore_blocco_foto.appendChild(preview);
                            every_block_container.appendChild(contenitore_blocco_foto);
                            body_container.appendChild(every_block_container);

                            animation_set_start(contenitore_foto);
                            
                        }

                        /********************* Rimuovo la macchina iniziale grigia che ha fatto da filtro ***************/

                        if(i == auto.length-1 && FirstToEliminate != null){
                           /********************** Imposto il valore di "Tutti i Risultati" *****************************/
                            const num_macchine = listaAuto.length-1; 
                            const all_results = document.querySelector('#All_results_bar');
        
                            all_results.textContent = "Tutti i risultati ("+num_macchine+")";
                        }

                    });
                    
                }

        if(FirstToEliminate != null){
            const gray_auto = document.getElementById(FirstToEliminate.parentNode.parentNode.id);
            console.log("Ultimo figlio rimosso");
            console.log(gray_auto);
            every_block_container.removeChild(gray_auto);
        }               
}


function check_recently_searched(){
    fetch("recent_search.php?search_get=1")
    .then((response) => {return response.json()})
    .then((object) => 
            {
                console.log(object);
                if(object.error == 0){
                    const container = document.querySelector('#last_search_blocks_container');

                    for(let auto of object.content){
                        const Make_Name = auto.Make_Name;
                        const Model_Name = auto.Model_Name;
                        console.log(auto);
                        fetch("vehicle_search.php?make_hide="+Make_Name+"&model_hide="+Model_Name)
                        .then((response) => {return response.json()})
                        .then((object) => {
                            const block_container = document.createElement('div');
                            const block_photo_container = document.createElement('div');
                            const img = document.createElement('img');
                            const heart_name_container = document.createElement('div');
                            heart_name_container.id = "heart_name_container";
                            const name = document.createElement('span');
                            name.textContent = "Name: " + Model_Name;
                            name.classList.add('bold');
                            const heart = document.createElement('img');
                            const trash_can= document.createElement('img');
                            heart.id = "search_heart_image";
                            fetch("http://localhost/Vehicles/homepage/Configuratore/configuratore.php?check=1&MakeName_favourite="+Make_Name+"&ModelName_favourite="+Model_Name)
                            .then((response) => {return response.json()})
                            .then((object) => {
                                if(object.error == 0){
                                    heart.classList.add('favourite');
                                    heart.src='./images/heart_filled.png';
                                }
                                else{
                                    heart.classList.add('not_favourite');
                                    heart.src='./images/heart_empty.png';
                                }
                            });
                            heart.addEventListener('click', function(event){event.stopPropagation();
                                                                            if(heart.classList.contains("not_favourite"))
                                                                            {
                                                                                fetch("./Configuratore/configuratore.php?insert=1&type=car&MakeName_favourite="+Make_Name+"&ModelName_favourite="+Model_Name)
                                                                                .then((response) => {return response.json()})
                                                                                .then((object) => {
                                                                                    console.log(object);
                                                                                    if(object.error == 0){
                                                                                        heart.src = "./images/heart_filled.png"
                                                                                        heart.classList.replace('not_favourite', 'favourite');}}
                                                                                    );
                                                                            }else if(heart.classList.contains('favourite')){
                                                                                     fetch("./Configuratore/configuratore.php?remove=1&MakeName_favourite="+Make_Name+"&ModelName_favourite="+Model_Name)
                                                                                    .then((response) => {return response.json()})
                                                                                    .then((object) =>{
                                                                                    if(object.error == 0){
                                                                                        heart.src = "./images/heart_empty.png"
                                                                                        heart.classList.replace('favourite', 'not_favourite');}});
                                                                            }});
                            trash_can.src="./images/can_gray.png";
                            trash_can.id = "trash_can";
                            trash_can.addEventListener('mouseenter', function(){trash_can.src="./images/can_red.png"});
                            trash_can.addEventListener('mouseleave', function(){trash_can.src="./images/can_gray.png"});
                            trash_can.addEventListener('click', function(event){event.stopPropagation(); 
                                                                                fetch("recent_search.php?search_remove=1&Make_Name="+Make_Name+"&Model_Name="+Model_Name);
                                                                                const node = document.querySelector('#search_' + Model_Name);
                                                                                event.currentTarget.parentNode.parentNode.parentNode.removeChild(node)
                                                                            });
                            block_photo_container.classList.add('search_container_class');
                            block_container.classList.add('block_search_container_class');
                            block_container.id="search_" + Model_Name;
                            img.classList.add('search_photo');
                            
                            heart_name_container.appendChild(heart);
                            heart_name_container.appendChild(name);
                            
                            
                            img.src = "data:image/png;base64, " + object;
                            block_photo_container.appendChild(img);
                            block_photo_container.appendChild(trash_can);
                            block_container.appendChild(block_photo_container);
                            block_container.appendChild(heart_name_container);
                            block_container.addEventListener('click', function () {location.href="./Configuratore/configuratore.html?MakeName="+Make_Name+"&ModelName="+Model_Name;});
                            container.appendChild(block_container);
                        })
                    }
                }
            });
}


            
            
            
            
