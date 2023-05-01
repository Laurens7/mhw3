function onJsonData(json){
    const dati=json.data;
    // svuota risultati precedenti
    const Info=document.querySelector('.informazioni');
    Info.innerHTML='';
    
    // salva tutti i dati interessati 
    const nome=dati.name;
    const abreviazione=dati.shortName;
    const numero=dati.jerseyNumber;
    const altezza=dati.height;
    const piedePrefe=dati.preferredFoot;
    const valore=dati.proposedMarketValue;
    const team=dati.team.name;
    const nazionale=dati.country.name;
    const campionato=dati.team.tournament.name;
    //  crea tutti i div dove vi saranno i dati 
    const infoNom = document.createElement('div');
    infoNom.textContent='Nome: '+nome;
    const infoAbrev = document.createElement('div');
    infoAbrev.textContent='Shortname: ' +abreviazione;
    const InfoAlto = document.createElement('div');
    InfoAlto.textContent='Altezza: ' + altezza + 'cm';
    const infoPiede = document.createElement('div');
    infoPiede.textContent='Piede preferito: ' + piedePrefe;
    const InfoNazio = document.createElement('div');
    InfoNazio.textContent='Nazionale: ' + nazionale;
    const InfoTeam = document.createElement('div');
    InfoTeam.textContent='Team: ' + team;
    const infoCampi = document.createElement('div');
    infoCampi.textContent='Campionato: ' + campionato;
    const infoNum = document.createElement('div');
    infoNum.textContent='Numero maglia: ' +numero;
    const infoValore = document.createElement('div');
    infoValore.textContent='Valore mercato: ' + valore;

    // appendi tutti i div contenenti i dati nella section
    Info.appendChild(infoNom);
    Info.appendChild(infoAbrev);
    Info.appendChild(InfoAlto);
    Info.appendChild(infoPiede);
    Info.appendChild(InfoNazio);
    Info.appendChild(InfoTeam);
    Info.appendChild(infoCampi);
    Info.appendChild(infoNum);
    Info.appendChild(infoValore);
    // rendere visibile la section
    const section=document.querySelector('#ricerca');
    section.classList.remove('hidden');
}



function onJson_Img(blob){
    // elimina la precendente immagine ricercata
    const images=document.querySelector('.images');
    images.innerHTML='';
    // crea un elemento immagine e copia url del blob 
    let image=document.createElement('img');
    image.src=URL.createObjectURL(blob);
    const div=document.querySelector('.images');
    // appende l'immagine nel suo div
    div.appendChild(image);
    
    console.log('Immagine appesa');
}

function onJson(json){
    console.log('JSON ricevuto');

    const datiRicerca=json.data;
    let i=0;
    // controlla che sia un giocatore di calcio
    if(datiRicerca[i].team.sport.name!=='Football'){
        i++;
    }
    // ottengo l'id del giocatore cercato 
    const idGiocatore=datiRicerca[i].id;

    console.log('Eseguo ricerca: '+ datiRicerca[i].name +'  '+ idGiocatore);
    // esegue le richieste all'API per i dati del giocatore e una sua foto
    fetch('https://sofascores.p.rapidapi.com/v1/players/data?player_id=' + idGiocatore ,options
    ).then(onResponse).then(onJsonData);
    
    fetch('https://sofascores.p.rapidapi.com/v1/players/photo?player_id=' + idGiocatore ,options
    ).then(onResponse_Img).then(onJson_Img);
}

function onResponse_Img(response){
    console.log('Risposta immagine ricevuta');
    
    return response.blob()
}

function OnTwitchStreamerImg(response){
    dati=response.data;
    // controllo che il canale cercato corrisponda ad un canale che trasmette Sport(id=518203)
    let m=0;
    if(dati[m].game_id!=="518203"){
        m++;
    }
    // ottengo url dell'immagine del profilo e lainserisco nel suo div 
    const profiloUrl=dati[0].thumbnail_url;
    const image=document.createElement('img');
    image.src=profiloUrl;
    const Images=document.querySelectorAll('.streamerImg');
    const User=document.querySelectorAll('.infoStreamer');
    // data la correllazione di più fetch asincrone la richiesta di immagini profili veniva risposta in ordine casuale e non di 
    // di chiamata ,quindi ho creato un ciclo per far in modo che nonostante il disordinato response ogni immagine profilo finisse nel suo div dedicato
    for(let l=0;l<5;l++){
        const divImage=Images[l];
        if(dati[m].display_name===User[l].innerText)
            divImage.appendChild(image);
    }

}

function OnTwitchStreamer(response){
    // Categoria diventa un Array formato da vari oggetti 
    const categoria=response.data
    // contatore che servirà ad ordinare i vari streamer nei rispettivi div
    let k=0;

    for(let cate of categoria){
        
        // faccio delle assegnazioni dei dati che voglio far visualizzare in output
        const userName=encodeURIComponent(cate.user_name);
        const titoloStream=cate.title;
        const spettatori=cate.viewer_count;
        // creo dei link dinamici che m permettono di entrare nella stream del div cliccato
        const listaLink=document.querySelectorAll('.link');
        const link=listaLink[k];
        const linkclic='https://www.twitch.tv/'+userName;
        link.setAttribute("href",linkclic);
        // faccio una nuova richiesta all'api per ottenere un json avente l'immagine profilo dei vari streamer visualizzati in output
        fetch('https://api.twitch.tv/helix/search/channels?query='+ userName + '&live_only=true',{
            method: 'GET',
		    headers: {
			    'Authorization': 'Bearer ' + token_data.access_token,
			    'Client-Id': apiTwitchIDclient,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(onResponse).then(OnTwitchStreamerImg);
        
        // richiedo elementi Html alla quale aggiungerò vari dati (span)
        const User=document.querySelectorAll('.infoStreamer');
        const Titolo=document.querySelectorAll('.titoloStreamer');
        const Spet=document.querySelectorAll('.spettatori');
        const divUser=User[k];
        const divTitolo=Titolo[k];
        const divSpet=Spet[k];

        const InfoUser=document.createElement('span'); 
        InfoUser.textContent=userName;
        const InfoTitolo=document.createElement('span');
        InfoTitolo.textContent=titoloStream;
        const InfoSpet=document.createElement('span');
        InfoSpet.textContent= 'spettatori: ' + spettatori;
        
        divUser.appendChild(InfoUser);
        divTitolo.appendChild(InfoTitolo);
        divSpet.appendChild(InfoSpet);
        k++;

    }
}



function onTwitch(){
    // controllo se il token sia giusto
    console.log(token_data.access_token)
    // Ricerca i primi 5 streamer live che trattano lo sport(id=518203) e sono italiani
    fetch('https://api.twitch.tv/helix/streams?game_id=518203&language=it&first=5',{
        method: 'GET',
		headers: {
			'Authorization': 'Bearer ' + token_data.access_token,
			'Client-Id': apiTwitchIDclient,
            'Content-Type': 'application/x-www-form-urlencoded'
            }
    }).then(onResponse).then(OnTwitchStreamer);

}


// ricevo token e lo inizializzo 
function getToken(json){
	token_data = json;
	console.log(json);
}

function onTokenResponse(response) {
    return response.json();
}


function onResponse(response){
    
    return response.json()
}


function search(event){
    // Impedisci il submit del form
    event.preventDefault(); 
    // Leggi valore del campo di testo
    const giocatoreInput=document.querySelector('#content');
    const giocatore=encodeURIComponent(giocatoreInput.value);
    console.log('Eseguo ricerca: ' + giocatore);
    // ricerca l'id del giocatore tramite un search per poi usarlo in altre chiamate
    fetch('https://sofascores.p.rapidapi.com/v1/search/multi?query=' + giocatore + '&group=players',options
   ).then(onResponse).then(onJson);
}
// api key di sofascores 
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '0249c7e3b4mshccc678384f83c1cp110c9fjsn69027a750164',
		'X-RapidAPI-Host': 'sofascores.p.rapidapi.com'
	}
};

// id client e secret key di twitch con Oauth2.0
const apiTwitchSecret='mh21diu8h3p3tl3hxjm2vlbw5o2g9x';
const apiTwitchIDclient='s6vimhfq38mcmrk5qeht4jgplulwca';

let token_data;
// richiesta token 
fetch('https://id.twitch.tv/oauth2/token',{
    method: 'POST',
	body: 'grant_type=client_credentials&client_id=' + apiTwitchIDclient + '&client_secret=' + apiTwitchSecret,
	headers:
	{
		'Content-Type': 'application/x-www-form-urlencoded'
	}
}
).then(onTokenResponse).then(getToken).then(onTwitch);

const form = document.querySelector('form');
form.addEventListener('submit', search)




