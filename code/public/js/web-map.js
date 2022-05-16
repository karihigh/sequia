// Atlas of the forgotten Chile - All maps lie Final – Spring 2020
// This program sets a map and loads the images on the webpage. 

// initialize map
let map = L.map('map').setView([-19.319975, -69.534918], 8);

const mapboxUrl = 'https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/{z}/{x}/{y}?access_token='
const accesToken = 'pk.eyJ1IjoiZ3VpbGxlbW9udGVjaW5vcyIsImEiOiJjanhqOXk1ajUyNG9tM3Rwa2k1NTA5Y3czIn0.empBgsAjclwQah1q9dLjiA'

L.tileLayer(mapboxUrl + accesToken, {
    attribution : '',
    tileSize: 512,
    zoomOffset: -1
}).addTo(map)

let geojsonMarkerOptions = {
    radius: 4,
    fillColor: "#515651",
    color: "#515651",
    weight: 1,
    opacity: 0,
    fillOpacity: 1
}

let geojsonMarkerOptionsHover = {
    radius: 8,
    fillColor: "#e02f49",
    color: "#e02f49",
    weight: 1,
    opacity: .9,
    fillOpacity: 0.9
}

// let json

// Dictionary that converts ids from the PobladosChile database into map object ids
let dict = {}

$.getJSON('./public/json/pobladoschile-aricaiqq-500.geojson', function(data){
    // json = data
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            // creates the markers for each settlement and adds an onClick event that fires scroll animation in jquery
            let marker = L.circleMarker(latlng, geojsonMarkerOptions)
            marker.on('mouseover', (e) => markerMouseOver(e))
            marker.on('mouseout', (e) => markerMouseOut(e))
            return marker
        }
    }).addTo(map)

    // populates dict with leaflet ids
    for(let key in map._layers){
        if(map._layers[key].feature != undefined){
            let id = map._layers[key].feature.properties.id
            dict[id] = key
        }
    }

    // Create the gallery grid from north to south
    data.features.sort(function(a,b){
        return b.geometry.coordinates[1] - a.geometry.coordinates[1]
    })
    for(let i = 0; i < data.features.length; i++){
        loadImage(data.features[i])
    }
    
    $('div').hover(
        function(){
            let hoverId = $(this).attr('id')
            if(hoverId != undefined && hoverId != 'map') {
                // modifies dot's style in the map on hover in
                map._layers[dict[hoverId]].bringToFront()
                map._layers[dict[hoverId]].setStyle(geojsonMarkerOptionsHover)
            }            
        }, 
        function(){
            let hoverId = $(this).attr('id')
            if(hoverId != undefined && hoverId != 'map') {
                // restitutes dot's style in the map on hover out
                map._layers[dict[hoverId]].setStyle(geojsonMarkerOptions)
            }            
        }, 
    )
})

function loadImage(obj){
    let galleryCont = document.createElement('div')
    galleryCont.className = 'gallery-container'
    let galleryItem = document.createElement('div')
    galleryItem.className = 'gallery-item'
    let image = document.createElement('div')
    image.className = 'image'
    let imageContent = document.createElement('img')
    imageContent.src = './public/images/' + obj.properties.id + '_' + obj.properties.name + '.png.jpg'

    let text = document.createElement('div')
    text.className = 'text'
    let textContent = document.createElement('p')
    textContent.className = 'text-content'
    let townName = document.createElement('span')
    townName.className = 'town-name'
    let townLocation = document.createElement('span')
    townLocation.className = 'town-location'

    townName.innerText= obj.properties.name + '\n'
    townLocation.innerText = obj.geometry.coordinates[1] + ', ' + obj.geometry.coordinates[0]

    image.appendChild(imageContent)
    galleryItem.appendChild(image)

    textContent.appendChild(townName)
    textContent.appendChild(townLocation)
    text.appendChild(textContent)

    galleryItem.appendChild(text)
    galleryItem.id = Number(obj.properties.id)
    galleryCont.appendChild(galleryItem)

    $('.grid-container').append(galleryCont)
}

function markerMouseOver(e){
    let idstr = e.sourceTarget.feature.properties.id
    // Adds class active to img and text html objects, so it gets animated
    document.getElementById(idstr).getElementsByTagName('img')[0].classList.add('active')
    document.getElementById(idstr).getElementsByClassName('text')[0].classList.add('active')
    idstr = '#' + idstr
    // Scroll to set image on top of the page container 
    if(!($(idstr).offset().top >= 80 && $(idstr).offset().top + $(idstr).height() * .8 <= $(window).height())){
        let scrollVal = $(idstr).offset().top - 80
        $('.page-container').animate({
            scrollTop: '+=' + scrollVal
        }, 1000)
    }
    // Modifies leaflet dot style
    let id = e.sourceTarget._leaflet_id
    map._layers[id].bringToFront()
    map._layers[id].setStyle(geojsonMarkerOptionsHover)
}

function markerMouseOut(e){
    let idstr = e.sourceTarget.feature.properties.id
    document.getElementById(idstr).getElementsByTagName('img')[0].classList.remove('active')
    document.getElementById(idstr).getElementsByClassName('text')[0].classList.remove('active')
    map._layers[e.sourceTarget._leaflet_id].setStyle(geojsonMarkerOptions)
}

// 'About' Popup layout and interaction
const openModalButtons = document.querySelectorAll('[data-modal-target]')
const closeModalButtons = document.querySelectorAll('[data-close-button]')
const overlay = document.getElementById('overlay')

openModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = document.querySelector(button.dataset.modalTarget)
        openModal(modal)
    })
})

closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal')
        closeModal(modal)
    })
})

function openModal(modal){
    if (modal == null) return
    modal.classList.add('active')
    overlay.classList.add('active')
}

function closeModal(modal){
    if (modal == null) return
    modal.classList.remove('active')
    overlay.classList.remove('active')
}

console.clear()