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

// Sélection bouton .modif-btn
const modifBtn = document.querySelector('.modif-btn');

// Sélection bouton .modal-content-btn-ajout-photo
const ajoutPhotoBtn = document.querySelector('.modal-content-btn-ajout-photo');

// Sélection modal
const modal = document.querySelector('.modal');

// Sélection modal 2
const modal2 = document.querySelector('.modal2');

// Affichage modal 1
modifBtn.addEventListener('click', function() {
  modal.style.display = 'block';
});

// Affichage modal 2
ajoutPhotoBtn.addEventListener('click', function() {
  modal2.style.display = 'block';
});

// Bouton fermerture
const closeBtn = document.querySelectorAll('.close');

// Fermeture au click sur la croix
closeBtn.forEach(function (close) {
  close.addEventListener('click', function () {
    const modalToClose = modal.style.display === 'block' ? modal : modal2;
    modalToClose.style.display = 'none';
  });
});

//retour à la modal d'avant au click sur fléche
const returnArrow = document.querySelector('.fa-arrow-left');

returnArrow.addEventListener('click', function() {
  modal2.style.display = 'none';
});

// Fermeture au click hors de la modal
window.addEventListener('click', function(event) {
  
  console.log(event.target);
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
  gallery.innerHTML = ""
  for (const work of data) {
    const figure = document.createElement('figure')
    figure.innerHTML =
            `<img src = "${work.imageUrl}" alt = "${work.title}">
        <figcaption>${work.title}</figcaption>`
    gallery.appendChild(figure)
  };
}


const createModalGalery = (data) =>{
  const modalGalery = document.querySelector('.modal-content-galery');
  modalGalery.innerHTML = ""
  for (const work of data) {
    const figure = document.createElement('figure')
    figure.innerHTML =
            `<img class = "modal_img" src = "${work.imageUrl}" alt = "${work.title}">
        <i class="fa-regular fa-trash-can"></i>`
    modalGalery.appendChild(figure)
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


fetchWork(urlWorks, createModalGalery)
fetchWork(urlWorks, createGallery)
fetchCategorie(urlCategorie, createCategorie)
