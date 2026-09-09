/***************
  MAP LEAFLET
***************/

//========Initialisation de la carte leaflet :

//Latitude 0 – Longitude 0, et avec un niveau de zoom : 5
const MAP = L.map('map').setView([0, 0], 5);

//Ajout des tuiles OpenStreetMap
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(MAP);

//Création d’une icône
const ISS_ICON = L.icon({
  iconUrl: './assets/img/international-space-station-icon.png',
  iconSize: [50, 50],
  iconAnchor: [22, 94],
})

//Ajout du marker à la map avec l'icône créée
const MARKER = L.marker([0, 0], {icon: ISS_ICON}).addTo(MAP);

/*******************
  SUIVI ISS
*******************/

//Création fonction récupération de l'API & mis à jour de la carte et du marqueur
async function issAPI(map,marker) {
  try {
    //Contact API ISS
    const response = await fetch("http://api.open-notify.org/iss-now.json");

    //Si un problème survient on s'assure d'en récupérer le code d'erreur HTTP
    if (!response.ok) {
      throw new Error(`Erreur de communication HTTP : ${response.status}`);
    }

    const donnees = await response.json();

    //========Récupération des données souhaitées
    let latISS = donnees.iss_position.latitude;
    let longISS = donnees.iss_position.longitude;

    //========Mise à jour de la carte avec les données
    map.flyTo([latISS, longISS], 5);
    marker.setLatLng([latISS,longISS]);

    //Si on a un problème avec le traitement des données API on s'assure d'avoir le message d'erreur
  } catch (erreur) {
    console.error("Impossible de charger les données de l'API:", erreur.message);
  }
}

//Appel de la fonction toutes les 1s les secondes
setInterval(()=>issAPI(MAP,MARKER),1000);
//Attention on ne met pas la fonction issApi() directement en paramètre mais une fonction anonyme qui appelle celle-ci. Sinon la valeur lue par la fonction setInterval() serait l'objet "promise" de la fonction asynchrone issAPI(MAP,MARKER) appelé la première fois.

/***************
  METEO LOCALE
***************/

//Création du paragraphe avec ajout des attributs css
let paragraphe = document.createElement('p');
paragraphe.setAttribute("style","height: 300px; width: 200px; margin-top: 16px; margin-bottom: 16px; border: solid 3px grey; padding-top: 16px; padding-right: 12px; padding-left: 12px; padding-bottom: 24px");

//Placement du paragraphe dans le document HTML au chargement de la page

//Indentification du noeud parent .cardMeteo
let cardMeteo = document.querySelector('.cardMeteo');

//Identification du noeud référence button
let button =  document.querySelector('button');

//Insertion dans le document à l'endroit souhaité
cardMeteo.insertBefore(paragraphe,button);

//Création de la fonction addInfo()
function addInfo(e,text) {
  e.innerText=text;
}

//addEventListener au click sur button que l'on a déjà identifier dans la partie précédente
button.addEventListener("click", async function(){
  try {
    const reponse = await fetch("https://prevision-meteo.ch/services/json/toulouse");

    if (!reponse.ok) {
      throw new Error(`Erreur HTTP : ${reponse.status}`);
    }

    const data = await reponse.json();

    //===========Appel de la fonction addInfo créer précédemment
    addInfo(paragraphe,
      `Aujourd'hui le temps est : ${data.current_condition.condition}\n
      La température actuelle est de ${data.current_condition.tmp}°C\n
      Température max.: ${data.fcst_day_0.tmax}°C\n
      Température min.: : ${data.fcst_day_0.tmin}°C
    `)

  } catch (erreur) {
    console.error("Impossible de charger les données de l'API:", erreur.message);
  }
})