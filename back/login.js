const email = document.getElementById('email');
const password = document.getElementById('password');
const loginButton = document.getElementById('login-button');
const errorMessage = document.getElementById('error-message');

async function verifierEmail() {
    errorMessage.textContent = "";
    if (!email.value || !password.value) {
        errorMessage.textContent += "Veuillez remplir tous les champs!\n";
    }
    else{
        const checkmail = async () => {
            return await db.from('Client').select('email').eq('email', email.value);
        };
        const result = await checkmail();
        if (result.error || result.data.length === 0) {
            errorMessage.textContent += "Adresse e-mail non trouvée!\n";
        }
    }

    if (errorMessage.textContent) {
        return false;
    }
    return true;
}
    
loginButton.addEventListener('click', async () => {
    if(verifierEmail()){
        const { data, error } = await db.auth.signInWithPassword({
            email: email.value,
            password: password.value,
        });
        if (error) {
            alert("Erreur lors de la connexion: " + error.message);
        } else {
            alert("Connexion réussie!");
            window.location.href = "place.html";
        }
    }

});