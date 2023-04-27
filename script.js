/* TODO: inserite il codice JavaScript necessario a completare il MHW! */
const key_spot='2e7abc37ac914523aba9d0e04e4ab9d4';
const secret_spot='9e02a1c9d544429fb1a930a7dba6e2df';

const C_IMAGE_URL ='./images/checked.png';
const U_IMAGE_URL ='./images/UNchecked.png';

function changeimg(event){

   const container = event;
   const check=container.querySelector('.checkbox');
  
    for(const box of container.parentNode.querySelectorAll('.checkbox')){
        box.src=  U_IMAGE_URL;  
    }

    check.src = C_IMAGE_URL;
    changebckg(container);
}

function changebckg(event){

    const container= event;
    
    for(const box of boxes1){
        if(box.dataset.questionId===container.dataset.questionId){
        box.classList.add("sfondogrigio");
        box.classList.remove("sfondoazzurro");
        }
    }
   
    container.classList.add("sfondoazzurro");
    container.classList.remove("sfondogrigio");
   
}

function addtext(json){

    const informazioni=json
    const new_section = document.createElement('section');
    const new_div = document.createElement('div');
    const new_img = document.createElement('img');
    const new_h1 = document.createElement('h1');
    const new_p = document.createElement('p');
    const new1_p = document.createElement('p');
    
    new_section.classList.add("risposta");


    const art=document.querySelector('section.se');
    art.appendChild(new_section);

    new_img.src=informazioni.player.photo;
    new_h1.textContent=informazioni.player.firstname+' ' +informazioni.player.lastname ;
    new_p.textContent='Anni: '+informazioni.player.age;
    new1_p.textContent= 'Birth: '+informazioni.player.birth.date +', Città: '+informazioni.player.birth.place+', Paese: ' + informazioni.player.birth.country ;
    
    new_section.appendChild(new_img);
    new_section.appendChild(new_div);
    new_div.appendChild(new_h1);
    new_div.appendChild(new_p);
    new_div.appendChild(new1_p);
    
}

function avviomeccanismo(event){

    //rimuovo gli elementi precedenti
    const og= document.querySelector('section.se')
    console.log(og);
    if(og!==null){
       
        og.remove();
    }
    
    const variabile = event.currentTarget;
    
    changeimg(variabile);
    
    if("one"===variabile.dataset.questionId){
        vet[0]=variabile.dataset.choiceId;
    }
    else if ("two"===variabile.dataset.questionId){
        vet[1]=variabile.dataset.choiceId;
    }
    else{
        vet[2]=variabile.dataset.choiceId;
    }
    
    if(vet[0]!==undefined && vet[1]!==undefined && vet[2]!==undefined){ 
       search1();
    }
}


const vet=[];
const boxes1 = document.querySelectorAll('.choice-grid div ');
for(const box of boxes1){
    box.addEventListener('click',avviomeccanismo);  
}


function onJson1(json){
    console.log(json);
    console.log(vet[1]);

    //CREO UN INTERA SEZIONE CHE MI CONTERRA' I RISULTATI E LA APPENDO AL RESTO DELLA PAGINA
    const sec=document.createElement('section');
    sec.classList.add('se');

    const art=document.querySelector('article');
    art.appendChild(sec);

    //SELEZIONO I GIOCATORI CHE HANNO LA POSIZIONE UGUALE A QUELLA SCELTA NEL TEST E INFINE LI AGGIUNGO
    for(let i=0;i<json.response.length;i++){   
        if(json.response[i].statistics[0].games.position===vet[1]){
            console.log(json.response[i]);
            addtext(json.response[i]); 
        }
    }
}

//SECONDA FETCH PER DETERMINARE I GIOCATORI DI UNA DETERMINATA SQUADRA E IN QUALE ANNO
function onJson(json) {
    console.log(json);

    teamid=json.response[0].team.id;

    console.log(teamid);
    fetch( '  https://v3.football.api-sports.io/players?season='+vet[2]+'&team='+teamid,
    {
     
      headers:
      {
        'x-apisports-key':'535e2223280f9e560c7bd28a06fb4f42',
      }
    }
    ).then(onResponse).then(onJson1);

  }



  function onResponse(response) {
    console.log('Risposta ricevuta');
    return response.json();
  }


//effettua una prima fetch per scoprire l'id della squadra scelta
function search1(){

    var value = encodeURIComponent(vet[0]);
    console.log(value);
    
    fetch( ' https://v3.football.api-sports.io/teams?name='+value,
    {
     
      headers:
      {
        'x-apisports-key':'535e2223280f9e560c7bd28a06fb4f42',
      }
    }
    ).then(onResponse).then(onJson);
}


//INIZIA PARTE DI CODICE INERENTE A SPOTIFY

function onJson2(json) {
    console.log('JSON ricevuto');
    console.log(json);

    //CREO UNA NUOVA SEZIONE NELLA QUALE INSERIRò LE INFORMAZIONI
    const sec=document.createElement('section');
    const art=document.querySelector('#inno');
    art.appendChild(sec);

    addtext2(json.tracks.items[0]);
}

function addtext2(json ){

    const informazioni=json;
    
    
    const new_div = document.createElement('div');
    const new_img = document.createElement('img');
    const new_h1 = document.createElement('h1');
    const new_audio=document.createElement('audio');

    const art=document.querySelector('#inno section');
    art.classList.add('brano');

    new_audio.controls=true;
    new_img.src=informazioni.album.images[0].url;
    new_audio.src=informazioni.preview_url;
    new_h1.textContent=informazioni.name;

    art.appendChild(new_img);
    art.appendChild(new_div);
    new_div.appendChild(new_h1);
    new_div.appendChild(new_audio);
     
}

function search(event){

    const og= document.querySelector('section.brano')
    console.log(og);
    if(og!==null){
        console.log("sono entrato dentro l'if");
        og.remove();
    }

    event.preventDefault();
    
    const input = document.querySelector('#content');
    const vvalue = encodeURIComponent(input.value);
    fetch("https://api.spotify.com/v1/search?q=Inno " + vvalue+"&type=track",
      {
        headers:
        {
          'Authorization': 'Bearer ' + token
        }
      }
    ).then(onResponse).then(onJson2);
}

function onTokenJson(json)
{
  console.log(json)
  token = json.access_token;
}


let token;

fetch("https://accounts.spotify.com/api/token",
	{
   method: "post",
   body: 'grant_type=client_credentials',
   headers:
   {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + btoa(key_spot + ':' + secret_spot)
   }
  }
).then(onResponse).then(onTokenJson);

const formm = document.querySelector('form');
formm.addEventListener('submit', search)


//API IMGUR

function onJson3(json){
  console.log(json);
  
  const sec=document.querySelectorAll('#imgur div img.team')
  
  for(let c=0;c<sec.length;c++ ){
    for(let j=0;j<sec.length;j++){
        if(sec[c].parentNode.dataset.choiceId===json.data[j].title){
          sec[c].src= json.data[j].link;
        }
    }
  }
}

function addimgfromimgur(){

  fetch('https://api.imgur.com/3/account/Gabrieeeleee/images',
  {
    headers:
    {
      'Authorization': 'Bearer ' + token1
    }
  }
  ).then(onResponse).then(onJson3);
}

let token1;
function onTokenJson1(json)
{
  console.log(json)
  token1 = json.access_token;
  console.log(token1);

  addimgfromimgur();

}

const form = new FormData();
form.append('refresh_token', 'f051ca491f92b2d3a9b687cc7e60f1042a630350');
form.append('client_id', 'e42ec2fc6a9230c');
form.append('client_secret', 'd8ad23c1d2ccc4667a50bdc929606b8a31ab584c');
form.append('grant_type', 'refresh_token');

fetch('https://api.imgur.com/oauth2/token', {
  method: 'POST',
  body: form
}).then(onResponse).then(onTokenJson1);

const refresh_token='f051ca491f92b2d3a9b687cc7e60f1042a630350';


