const connected = document.querySelectorAll('.connected')
const disconnected = document.querySelectorAll('.disconnected')

// Vérification token connection
if (sessionStorage.getItem('token')) {
  disconnected.forEach((element) => {
    element.style.display = 'none'
  })
} else {
  connected.forEach((element) => {
    element.style.display = 'none'
  })
}

// Déconnexion
const logOutBtn = document.querySelector('.logOut')
logOutBtn.addEventListener('click', function () {
  sessionStorage.removeItem('token')
  window.location.reload()
})

// Sélection bouton .modif-btn
const modifBtn = document.querySelectorAll('.modif-btn');

// Sélection bouton .modal-content-btn-ajout-photo
const ajoutPhotoBtn = document.querySelector('.modal-content-btn-ajout-photo');

// Sélection modal
const modal = document.querySelector('.modal');

// Sélection modal 2
const modal2 = document.querySelector('.modal2');

// Affichage modal 1
modifBtn.forEach(function (modifBtn) {
  modifBtn.addEventListener('click', function () {
    modal.style.display = 'block';
  });
});

// Affichage modal 2
ajoutPhotoBtn.addEventListener('click', function () {
  modal2.style.display = 'block';
  fetchCategorie(urlCategorie, categoryData);
});

// Bouton fermerture
const closeBtn = document.querySelectorAll('.close');

// Fermeture au click sur la croix
closeBtn.forEach(function (close) {
  close.addEventListener('click', function () {
    const modalToClose = modal.style.display === 'block' ? modal : modal2;
    modalToClose.style.display = 'none';
    resetForm();
  });
});

//retour à la modal d'avant au click sur fléche
const returnArrow = document.querySelector('.fa-arrow-left');

returnArrow.addEventListener('click', function () {
  modal2.style.display = 'none';
  resetForm();
});

// Fermeture au click hors de la modal
window.addEventListener('click', function (event) {

  if (event.target === modal) {
    modal.style.display = 'none';
    resetForm();
  }
  if (event.target === modal2) {
    modal2.style.display = 'none';
    resetForm();
  }
});

// Requete API projets
const urlWorks = 'http://localhost:5678/api/works';

const fetchWork = async (url, callback) => {
  const dataFetch = await fetch(url)
  const data = await dataFetch.json()
  callback(data)
}

//Creation galerie page d'acceuil
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

// Creation galerie Modal1
const createModalGalery = (data) => {
  const modalGalery = document.querySelector('.modal-content-galery');
  modalGalery.innerHTML = ""
  for (let i = 0; i < data.length; i++) {
    const figure = document.createElement('figure');
    figure.innerHTML =
      `<img class = "modal_img" src = "${data[i].imageUrl}" alt = "${data[i].title}">
        <i id="${data[i].id}" class="fa-regular fa-trash-can"></i>`

    modalGalery.appendChild(figure);
    const trash = figure.querySelector('.fa-trash-can');
    trash.addEventListener('click', (e) => {
      deleteWork(e.target.id)
        .then(() => {
          fetchWork(urlWorks, createGallery);
          fetchWork(urlWorks, createModalGalery);
        })
    });
  };
}

// Affichage catégories modal2
const categorySelect = document.querySelector('#categorie');
const categoryData = (data) => {
  categorySelect.innerHTML = "";
  categorySelect.innerHTML = `<option value="" hidden></option>`
  for (const category of data) {
    const option = document.createElement('option');
    option.setAttribute("id", category.id);
    option.innerHTML = `${category.name}`;
    categorySelect.appendChild(option);
  }
};

// Messages d'erreurs
const badSize = document.querySelector('.msg-size-format');
function msgBadSizeF() {
  badSize.textContent = "L'image dépasse la limite de taille de 4 Mo !";
  badSize.style.display = "block";
  setTimeout(() => {
    badSize.textContent = "";
    badSize.style.display = "none";
  }, 4000);
}

const BadFormat = document.querySelector('.msg-size-format');
function msgBadFormatF() {
  BadFormat.textContent = "Format de fichier non supporté. Utilisez JPEG ou PNG";
  BadFormat.style.display = "block";
  setTimeout(() => {
    BadFormat.textContent = "";
    BadFormat.style.display = "none";
  }, 4000);
}

const msgError = document.querySelector('.msg-ok-error');
function messageErrorF() {
  msgError.textContent = "Un problème est survenu, veuillez recommencer.";
  msgError.style.display = "block";
  setTimeout(() => {
    msgError.textContent = "";
    msgError.style.display = "none";
  }, 3000);
}

const msgOk = document.querySelector('.msg-ok-error');
function messageAddSuccesF() {
  msgOk.textContent = "Projet ajouté avec succés !";
  msgOk.style.display = "block";
  setTimeout(() => {
    msgOk.textContent = "";
    msgOk.style.display = "none";
  }, 3000);
}

// Verification format et taille
const imageInput = document.querySelector('#image-work');
imageInput.addEventListener('change',
  function checkImg() {
    const selectImg = imageInput.files[0];

    if (selectImg.size > 4 * 1024 * 1024) {
      imageInput.value = "";
      msgBadSizeF();
      return;
    }
    const goodFormat = ["image/jpeg", "image/png"];
    if (!goodFormat.includes(selectImg.type)) {
      imageInput.value = "";
      msgBadFormatF();
      return;
    }

  });

// Vérification formulaire
const modalPhotoTitle = document.querySelector("#titre");
const btnFormValider = document.querySelector("#btn-valider");

function checkForm() {
  if (modalPhotoTitle.value !== "" && btnNewPhoto.files[0] !== undefined && categorySelect.value !== "") {
    btnFormValider.classList.add("btn-validation");
    const btnFormValiderCheck = document.querySelector(".btn-validation");
    btnFormValiderCheck.addEventListener("click", sendWork);
  }
}

modalPhotoTitle.addEventListener("change", () => {
  checkForm();
})

let categorySelectId = "";
categorySelect.addEventListener("change", () => {
  categorySelectId = categorySelect.selectedIndex;
  checkForm();
})

// Ajout de projet
const token = sessionStorage.getItem("token");
const sendWork = async (event) => {
  event.preventDefault();
  const imageInput = document.querySelector("#image-work");
  const titleInput = document.querySelector("#titre");
  const categorySelect = document.querySelector("#categorie");

  const image = imageInput.files[0];
  const title = titleInput.value;

  let formData = new FormData();
  formData.append("image", image);
  formData.append("title", title);
  formData.append("category", categorySelectId);
  const response = await fetch(urlWorks, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    body: formData
  });
  if (response.ok) {
    messageAddSuccesF();
    resetForm();
    fetchWork(urlWorks, createGallery);
    fetchWork(urlWorks, createModalGalery);
  } else {
    messageErrorF();
  }
}

// Reset de la modal
function resetForm() {
  document.querySelector("#titre").value = "";
  imageInput.value = "";
  allContentPhotoBox.forEach((content) => {
    content.style.display = "block";
  });
  document.querySelectorAll(".miniature, #image-work").forEach((element) => {
    element.style.display = "none";
  });
  btnFormValider.classList.remove("btn-validation");
}

// Affichage miniature
const btnNewPhoto = document.querySelector("#image-work");
const photoBox = document.querySelector(".modal-content-div-Ajout");
const allContentPhotoBox = photoBox.querySelectorAll(".display-none");

btnNewPhoto.addEventListener("change", (e) => {
  e.preventDefault();
  const objectURL = URL.createObjectURL(btnNewPhoto.files[0]);
  allContentPhotoBox.forEach((content) => {
    content.style.display = "none";
  })
  const ajoutImage = document.createElement("img");
  ajoutImage.setAttribute("class", "miniature")
  ajoutImage.setAttribute("src", objectURL);
  ajoutImage.setAttribute("alt", btnNewPhoto.files[0].name);
  photoBox.appendChild(ajoutImage);
  checkForm();
});

// Fonction Suppresion projets
const deleteWork = async (idProject) => {
  const token = sessionStorage.getItem('token');
  await fetch(`http://localhost:5678/api/works/${idProject}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${(token)}`
    }
  });
};

// Creation catégories (filtres)
const createCategorie = (data) => {
  const filtre = document.querySelector('.filtre');
  const tous = document.createElement('button');
  tous.innerHTML = 'Tous';
  tous.setAttribute("id", "filtre");
  tous.addEventListener('click', () => {
    document.getElementById('filtre').removeAttribute('id');
    tous.setAttribute('id', 'filtre');
    fetchWork(urlWorks, createGallery)
  })
  filtre.appendChild(tous)
  for (const categorie of data) {
    const bouton = document.createElement('button')
    bouton.innerHTML = categorie.name
    bouton.addEventListener('click', () => {
      document.getElementById('filtre').removeAttribute('id');
      bouton.setAttribute('id', 'filtre');
      fetchCategorieFilter(urlWorks, createGallery, categorie.id);
    });
    filtre.appendChild(bouton);
  }
  const boutons = document.querySelectorAll("button");

}

// Requetes API catégories
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