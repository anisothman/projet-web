// ==================== UTILITAIRES ====================

function afficherErreur(champ, message) {
    const erreurExistante = champ.parentElement.querySelector('.message-erreur');
    if (erreurExistante) erreurExistante.remove();
    champ.style.outline = '2px solid #e74c3c';
    const span = document.createElement('span');
    span.className = 'message-erreur';
    span.textContent = message;
    span.style.cssText = 'color:#e74c3c;font-size:12px;margin-top:4px;display:block;';
    champ.parentElement.appendChild(span);
}

function effacerErreur(champ) {
    const erreurExistante = champ.parentElement.querySelector('.message-erreur');
    if (erreurExistante) erreurExistante.remove();
    champ.style.outline = '';
}

// ==================== PAGE CONNEXION ====================

const formulaireConnexion = document.getElementById('loginForm');
if (formulaireConnexion) {
    formulaireConnexion.addEventListener('submit', function (e) {
        e.preventDefault();
        let valide = true;

        const email = formulaireConnexion.querySelector('input[name="email"]');
        const motDePasse = formulaireConnexion.querySelector('input[name="password"]');

        effacerErreur(email);
        effacerErreur(motDePasse);

        if (!email.value.trim()) {
            afficherErreur(email, 'Veuillez saisir votre adresse email.');
            valide = false;
        }

        if (!motDePasse.value) {
            afficherErreur(motDePasse, 'Veuillez saisir votre mot de passe.');
            valide = false;
        } else if (motDePasse.value.length < 6) {
            afficherErreur(motDePasse, 'Le mot de passe doit contenir au moins 6 caractères.');
            valide = false;
        }

        if (valide) {
            window.location.href = 'place.html';
        }
    });
}

// ==================== PAGE INSCRIPTION ====================

const formulaireInscription = document.getElementById('signupForm');
if (formulaireInscription) {
    formulaireInscription.addEventListener('submit', function (e) {
        e.preventDefault();
        let valide = true;

        const nom = formulaireInscription.querySelector('input[name="nom"]');
        const email = formulaireInscription.querySelector('input[name="email"]');
        const motDePasse = formulaireInscription.querySelector('input[name="password"]');
        const confirmation = formulaireInscription.querySelector('input[name="confirm-password"]');

        [nom, email, motDePasse, confirmation].forEach(effacerErreur);

        if (!nom.value.trim()) {
            afficherErreur(nom, 'Veuillez saisir votre nom complet.');
            valide = false;
        }

        if (!email.value.trim()) {
            afficherErreur(email, 'Veuillez saisir votre adresse email.');
            valide = false;
        }

        if (!motDePasse.value) {
            afficherErreur(motDePasse, 'Veuillez saisir un mot de passe.');
            valide = false;
        } else if (motDePasse.value.length < 6) {
            afficherErreur(motDePasse, 'Le mot de passe doit contenir au moins 6 caractères.');
            valide = false;
        }

        if (!confirmation.value) {
            afficherErreur(confirmation, 'Veuillez confirmer votre mot de passe.');
            valide = false;
        } else if (motDePasse.value && motDePasse.value !== confirmation.value) {
            afficherErreur(confirmation, 'Les mots de passe ne correspondent pas.');
            valide = false;
        }

        if (valide) {
            window.location.href = 'login.html';
        }
    });
}

// ==================== PAGE RÉSERVATION ====================

let siegeSelectionne = null;

document.querySelectorAll('.seat:not(.occupied)').forEach(function (siege) {
    siege.addEventListener('click', function () {
        const precedent = document.querySelector('.seat.selected');
        if (precedent && precedent !== siege) {
            precedent.classList.remove('selected');
            precedent.classList.add('free');
        }

        if (siege.classList.contains('selected')) {
            siege.classList.remove('selected');
            siege.classList.add('free');
            siegeSelectionne = null;
        } else {
            siege.classList.remove('free');
            siege.classList.add('selected');
            siegeSelectionne = siege.dataset.seat;
        }

        const erreurSiege = document.getElementById('erreur-siege');
        if (erreurSiege) erreurSiege.remove();
    });
});

const formulaireReservation = document.getElementById('reservationForm');
if (formulaireReservation) {
    formulaireReservation.addEventListener('submit', function (e) {
        e.preventDefault();
        let valide = true;

        const nomComplet = document.getElementById('fullName');
        const email = document.getElementById('email');

        effacerErreur(nomComplet);
        effacerErreur(email);

        if (!nomComplet.value.trim()) {
            afficherErreur(nomComplet, 'Veuillez saisir votre nom complet.');
            valide = false;
        }

        if (!email.value.trim()) {
            afficherErreur(email, 'Veuillez saisir votre adresse email.');
            valide = false;
        }

        if (!siegeSelectionne) {
            const planLabel = document.querySelector('.map label');
            let erreur = document.getElementById('erreur-siege');
            if (!erreur) {
                erreur = document.createElement('span');
                erreur.id = 'erreur-siege';
                erreur.style.cssText = 'color:#e74c3c;font-size:12px;display:block;margin-top:5px;';
                planLabel.after(erreur);
            }
            erreur.textContent = 'Veuillez sélectionner une place.';
            valide = false;
        }

        if (valide) {
            const boite = document.querySelector('.boite-reservation');
            boite.innerHTML = `
                <div class="confirmation">
                    <div class="confirmation-icon">✅</div>
                    <h2>Réservation confirmée !</h2>
                    <p>Place <strong>${siegeSelectionne}</strong> réservée avec succès.</p>
                    <p>Un email de confirmation sera envoyé à <strong>${email.value}</strong>.</p>
                    <a href="login.html" class="confirmation-lien">Retour à l'accueil</a>
                </div>
            `;
        }
    });
}
