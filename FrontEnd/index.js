const urlWorks = 'http://localhost:5678/api/works';
const fetchWork = async (url, callback) =>
{
    const dataFetch = await fetch(url);
    const data = await dataFetch.json();
    callback(data);
};

const createGallery = (data) => {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = null;
    for (const work of data) {
        const img = document.createElement("img");
        const figure = document.createElement("figure");
        const figcaption = document.createElement("figcaption");
        img.setAttribute('src', `${work.imageUrl}`);
        figcaption.innerHTML = work.title;
        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    };
};

const createCategorie = (data) => {
    const filtre = document.querySelector (".filtre");
    const tous = document.createElement ("button");
    tous.innerHTML = "Tous";
    tous.addEventListener ("click", () => 
    fetchWork(urlWorks, createGallery));
    filtre.appendChild(tous);
    for(const categorie of data){
        const bouton = document.createElement("button");
        bouton.innerHTML = categorie.name;
        bouton.addEventListener ("click", () => 
        fetchCategorieFilter(urlWorks, createGallery, categorie.id));
        filtre.appendChild(bouton);
    }

};

const urlCategorie = "http://localhost:5678/api/categories" ;
const fetchCategorie = async (url, callback) =>
{
    const dataFetch = await fetch(url);
    const data = await dataFetch.json();
    callback(data);
};

const fetchCategorieFilter = async (url, callback, btnId) =>
{
    const dataFetch = await fetch(url);
    let data = await dataFetch.json();
    data = await data.filter((categorie) => categorie.categoryId === btnId);
    callback(data);
};

fetchWork(urlWorks, createGallery);
fetchCategorie(urlCategorie, createCategorie);
