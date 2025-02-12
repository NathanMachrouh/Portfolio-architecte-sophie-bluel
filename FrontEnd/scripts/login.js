const form = document.querySelector('#loginForm')

form.addEventListener('submit', async (event) => {
  event.preventDefault() // Empêche l'envoi du formulaire par défaut

  // Récupération des valeurs de l'email et du mot de passe depuis le formulaire
  const email = document.getElementById('email').value.trim()
  const password = document.getElementById('password').value.trim()

  // Fonction pour afficher un message d'erreur dans le formulaire
  const messageErrorLogin = (selector, message) => {
    document.querySelector(selector).innerHTML = message
  }

  // Fonction pour afficher une erreur spécifique
  const showError = (selector, message) => {
    messageErrorLogin(selector, message);

    setTimeout(() => {
      const errorElement = document.querySelector(selector);
      if (errorElement) {
        errorElement.textContent = '';
      }
    }, 3000);
  }

  try {
    // Envoi de la requête au serveur pour vérifier la combinaison login/mot de passe
    const response = await fetch('http://localhost:5678/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({ email, password }) // Envoi des données JSON
    })

    if (response.status === 200) {
      const result = await response.json()
      sessionStorage.setItem('token', result.token) // Stockage du token dans le sessionStorage
      document.location.href = 'index.html' // Redirection vers la page d'accueil
    } else if (response.status === 404 || response.status === 401) {
      setTimeout( showError('#errorPassword', 'Erreur dans l’identifiant ou le mot de passe'), 3000);
    } else {
      throw new Error('Erreur de requête au serveur')
    }
  } catch (error) {
    showError('#errorPassword', "Erreur dans l’identifiant / le mot de passe ou l'API est indisponible")
  }
})
