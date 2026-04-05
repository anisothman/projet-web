const nameInput = document.getElementById("nom");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");
const signupBtn = document.getElementById("signup-btn");

const errorMessage = document.getElementById("error-message");

function verifierChamps() {
    errorMessage.textContent = ""; 
    if (!nameInput.value || !email.value || !password.value || !confirmPassword.value) {
        errorMessage.textContent += "Veuillez remplir tous les champs!\n";
    }
    if(nameInput.value.length < 3 || nameInput.value.length > 20 || nameInput.value.match(/\d/)){
        errorMessage.textContent += "Le nom doit comporter entre 3 et 20 caractères et ne doit pas contenir de chiffres!\n";
    }
    if (!email.value.includes("@") || !email.value.includes(".")) {
        errorMessage.textContent += "Veuillez entrer une adresse e-mail valide!\n";
    }
    if (password.value.length < 8) {
        errorMessage.textContent += "Le mot de passe doit comporter au moins 8 caractères!\n";
    }
    if (password.value !== confirmPassword.value) {
        errorMessage.textContent += "Les mots de passe ne correspondent pas!\n";
    }
    if (errorMessage.textContent) {
        return false;
    }
    return true;
}

signupBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    if (verifierChamps()) {
        const { data, error } = await db.auth.signUp({
            email: email.value,
            password: password.value,
        });
        if (error) {
            alert("Erreur lors de l'inscription: " + error.message);
        } else {
            alert("Inscription réussie!");
            const addUser = await db.from('Client').insert({ name: nameInput.value, email: email.value });
            if (addUser.error) {
                alert("Erreur lors de l'ajout de l'utilisateur: " + addUser.error.message);
            }
            else {
                console.log("Utilisateur ajouté avec succès!");
                window.location.href = "login.html";
            }
            
        }

    }
});