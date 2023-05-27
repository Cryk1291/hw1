let counter = 3;
const div = document.createElement('div');
const body = document.querySelector('body');
body.appendChild(div);


delay();
function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function delay(){
    
    while(counter > 0){
        div.textContent = "Reindirizzamento in... " + counter;
        counter--;
        await sleep(1000);
    }
    location.href = "../login/login.html";
}


