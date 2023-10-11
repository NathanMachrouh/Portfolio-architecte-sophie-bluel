const form = document.querySelector('#loginForm');

form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Empêche l'envoi du formulaire par défaut

    // Récupération des valeurs de l'email et du mot de passe depuis le formulaire
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Fonction pour afficher un message d'erreur dans le formulaire
    const messageErrorLogin = (selector, message) => {
        document.querySelector(selector).innerHTML = message;
    };

    // Fonction pour afficher une erreur spécifique
    const showError = (selector, message) => {
        messageErrorLogin(selector, message);
    };

    // Fonction pour effacer un message d'erreur spécifique
    const clearError = (selector) => {
        document.querySelector(selector).innerHTML = '';
    };

    // Validation de l'email
    if (!email) {
        showError('#errorMail', 'Le champ E-Mail est vide');
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        showError('#errorMail', "L'e-mail est invalide");
    } else {
        clearError('#errorMail'); // Efface les erreurs précédentes
    }

    // Validation du mot de passe
    if (!password) {
        showError('#errorPassword', 'Le champ Mot de passe est vide');
    } else {
        clearError('#errorPassword'); // Efface les erreurs précédentes
    }

    try {
        // Envoi de la requête au serveur pour vérifier la combinaison login/mot de passe
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ email, password }), // Envoi des données JSON
        });

        // Traitement de la réponse du serveur
        if (response.status === 200) {
            const result = await response.json();
            localStorage.setItem('token', result.token); // Stockage du token dans le localStorage
            window.location.href = 'index.html'; // Redirection vers la page d'accueil
        } else if (response.status === 404 || response.status === 401) {
            showError('#errorPassword', 'Erreur dans l’identifiant ou le mot de passe');
        }
    } catch (error) {
        showError('#errorPassword', "Erreur dans l’identifiant / le mot de passe ou l'API est indisponible");
    }
});
