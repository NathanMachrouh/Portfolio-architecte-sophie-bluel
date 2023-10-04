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

fetchWork(urlWorks, createGallery);
