const connected = document.querySelectorAll('.connected')
const disconnected = document.querySelectorAll('.disconnected')

if (localStorage.getItem('token')) {
  console.log(localStorage.getItem('token'))
  disconnected.forEach((element) => {
    element.style.display = 'none'
  })
} else {
  connected.forEach((element) => {
    element.style.display = 'none'
  })
}

const logOutBtn = document.querySelector('.logOut')
logOutBtn.addEventListener('click', function () {
  localStorage.removeItem('token')
  window.location.reload()
})

// Sélectionnez le bouton .modif-btn
const modifBtn = document.querySelector('.modif-btn');

// Sélectionnez le bouton .modal-content-btn-ajout-photo
const ajoutPhotoBtn = document.querySelector('.modal-content-btn-ajout-photo');

// Sélectionnez la modal
const modal = document.querySelector('.modal');

// Sélectionnez la modal 2
const modal2 = document.querySelector('.modal2');

// Associez un gestionnaire d'événements au bouton pour afficher la modal
modifBtn.addEventListener('click', function() {
  modal.style.display = 'block';
});

// Associez un gestionnaire d'événements au bouton .modal-content-btn-ajout-photo pour afficher la modal 2
ajoutPhotoBtn.addEventListener('click', function() {
  modal2.style.display = 'block';
});

// Sélectionnez le bouton de fermeture (croix) de la modal
const closeBtn = document.querySelector('.close');

// Associez un gestionnaire d'événements pour fermer la modal en cliquant sur la croix
closeBtn.addEventListener('click', function() {
  modal.style.display = 'none';
  modal2.style.display = 'none';
});

// Vous pouvez également ajouter un gestionnaire d'événements pour fermer la modal et la modal 2
// en cliquant en dehors de celles-ci
window.addEventListener('click', function(event) {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
  if (event.target === modal2) {
    modal2.style.display = 'none';
  }
});


const urlWorks = 'http://localhost:5678/api/works'
const fetchWork = async (url, callback) => {
  const dataFetch = await fetch(url)
  const data = await dataFetch.json()
  callback(data)
}

const createGallery = (data) => {
  const gallery = document.querySelector('.gallery')
  gallery.innerHTML = null
  for (const work of data) {
    const figure = document.createElement('figure')
    figure.innerHTML =
            `<img src = "${work.imageUrl}" alt = "${work.title}">
        <figcaption>${work.title}</figcaption>`
    gallery.appendChild(figure)
  };
}

const createCategorie = (data) => {
  const filtre = document.querySelector('.filtre')
  const tous = document.createElement('button')
  tous.innerHTML = 'Tous'
  tous.addEventListener('click', () =>
    fetchWork(urlWorks, createGallery))
  filtre.appendChild(tous)
  for (const categorie of data) {
    const bouton = document.createElement('button')
    bouton.innerHTML = categorie.name
    bouton.addEventListener('click', () =>
      fetchCategorieFilter(urlWorks, createGallery, categorie.id))
    filtre.appendChild(bouton)
  }
}

const urlCategorie = 'http://localhost:5678/api/categories'
const fetchCategorie = async (url, callback) => {
  const dataFetch = await fetch(url)
  const data = await dataFetch.json()
  callback(data)
}

const fetchCategorieFilter = async (url, callback, btnId) => {
  const dataFetch = await fetch(url)
  let data = await dataFetch.json()
  data = await data.filter((categorie) => categorie.categoryId === btnId)
  callback(data)
}



fetchWork(urlWorks, createGallery)
fetchCategorie(urlCategorie, createCategorie)
