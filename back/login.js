const email = document.getElementById('email');
const password = document.getElementById('password');
const role = document.getElementById('role');
const loginButton = document.getElementById('login-button');
const errorMessage = document.getElementById('error-message');
const seatHint = document.getElementById('seat-hint');

const ADMIN_EMAIL = 'admin@espacevip.tn';
const ADMIN_PASSWORD = 'Admin123!';

const params = new URLSearchParams(window.location.search);
const selectedSeat = params.get('seat');

if (seatHint && selectedSeat) {
    seatHint.textContent = `Place choisie: ${selectedSeat}. Connectez-vous pour terminer la reservation.`;
}

async function verifierEmail() {
    errorMessage.textContent = "";

    if (!email.value || !password.value) {
        errorMessage.textContent += "Veuillez remplir tous les champs!\n";
        return false;
    }

    if (role.value === 'admin') {
        if (email.value === ADMIN_EMAIL && password.value === ADMIN_PASSWORD) {
            return true;
        }

        errorMessage.textContent += "Identifiants admin invalides!\n";
        return false;
    }

    const checkmail = async () => {
        return await db.from('Client').select('email').eq('email', email.value);
    };
    const result = await checkmail();
    if (result.error || result.data.length === 0) {
        errorMessage.textContent += "Adresse e-mail client non trouvée!\n";
    }

    if (errorMessage.textContent) {
        return false;
    }
    return true;
}
    
loginButton.addEventListener('click', async () => {
    if (await verifierEmail()) {
        if (role.value === 'admin') {
            localStorage.setItem('role', 'admin');
            localStorage.setItem('currentUserEmail', email.value);
            window.location.href = 'admin.html';
            return;
        }

        const { data, error } = await db.auth.signInWithPassword({
            email: email.value,
            password: password.value,
        });
        if (error) {
            alert("Erreur lors de la connexion: " + error.message);
        } else {
            localStorage.setItem('role', 'user');
            localStorage.setItem('currentUserEmail', email.value);
            alert("Connexion réussie!");
            const destination = selectedSeat
                ? `place.html?seat=${encodeURIComponent(selectedSeat)}`
                : 'index.html';
            window.location.href = destination;
        }
    }

});