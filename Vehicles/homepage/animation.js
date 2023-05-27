const larghezza = 300;
const altezza = larghezza/1.6;


function animation_set_start(box){
    box.addEventListener('click', handler_definitive_animation);
    
}

function handler_definitive_animation(event){
    const box = event.currentTarget;        /*.photo_container_class*/
    const boxes = document.querySelectorAll('.photo_container_class'); 
    
    
    for(let single_box of boxes){
        const fatherNode = single_box.parentNode;                   /*BLOCK_PHOTO_CONTAINER*/
        const child_img = single_box.querySelector('#bookid');
        const preview = fatherNode.querySelector('#preview_name');    /*LO CHIAMO DENTRO COSI' DATO IL PADRE, PRENDO LA SPECIFICA PREVIEW SELEZIONATA */
        if(fatherNode.classList.contains("clicked")){
            console.log("entro");
            definitive_animation_back_photo(single_box);
            preview.classList.remove('invisible');
            fatherNode.classList.replace("clicked","not_clicked");
            child_img.classList.remove("clicked");

            single_box.clientHeight = altezza;
            single_box.clientWidth = larghezza;
            const block_photo_container = single_box.parentNode;
            const description = block_photo_container.querySelector('.description');
            description.classList.add('invisible');            
        }
        else if(single_box == box){
            definitive_animation_photo(box);
            preview.classList.add("invisible");
            
            
            fatherNode.classList.replace("not_clicked","clicked");
            child_img.classList.add("clicked");
            const description = fatherNode.querySelector('.description');
            description.classList.remove('invisible');
            window.location.href = "#"+box.parentNode.id;                               /* SETTO LA VISUALE APPROSSIMATIVAMENTE AL CENTRO, COSI' L'AUTO CLICCATA VIENE CENTRATA */
        }
    }
           
}



function definitive_animation_photo(box){

    let height = box.clientHeight;
    let width = box.clientWidth;
    const screen_width = window.innerWidth;
    let id = setInterval(frame, 10);
    
    function frame(){
        if(window.innerWidth > 870){
            if(height > 2*altezza || width > 2*larghezza){
                clearInterval(id);
            }
            else{
                height+=12.5;
                width +=20;
                box.style.height = height + "px";
                box.style.width = width + "px";
                
            }
        }  
        else{
            if(height > 2*altezza || width > screen_width - 40){
                clearInterval(id);
            }
            else{
                console.log("dovrei essere qua");
                console.log(window.innerWidth);
                console.log(height);
                console.log(width);
                console.log(2*altezza);
                height+=9.5;
                width +=20;
                box.style.height = height + "px";
                box.style.width = width + "px";
                
            }
        }
    }
    
    
}

function definitive_animation_back_photo(box){
    let id = setInterval(frame, 10);
    
    let height = box.clientHeight;
    let width = box.clientWidth;
    function frame(){
        if(!window.innerWidth < 870){
            if(height <= altezza  || width <= larghezza){
                clearInterval(id);
            }
            else{
                height-=12.5;
                width -=20;
                box.style.height = height + "px";
                box.style.width = width + "px";
                
            }
        }
        else{
            clearInterval(id);
            if(height <= altezza  || width <= larghezza){
                clearInterval(id);
            }
            else{
                height-=9.5;
                width -=20;
                box.style.height = height + "px";
                box.style.width = width + "px";
                
            }
        }
          
    }
    
}


function setAppear_Disappear_Animation(){
    const all_results = document.querySelector('#All_results_bar');
    
    all_results.addEventListener('click', appear_event);
    
    function appear_event(event){
        const every_block_container = document.querySelector('#every_block_container');
        
        if(every_block_container.classList.contains('disappear')){
            every_block_container.classList.remove('disappear');
            
        }
        else{
            every_block_container.classList.add('disappear');
            
        }
    }
    
}

