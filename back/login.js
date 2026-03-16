const supabaseUrl = 'https://grelnipffaizijgpzhli.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyZWxuaXBmZmFpemlqZ3B6aGxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MDI0NjUsImV4cCI6MjA4OTE3ODQ2NX0.RthR5w5AFZctatnuHg_uj6Dl3vfuNf8ZsffvadQ-vz8';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

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
            return await supabaseClient.from('Client').select('email').eq('email', email.value);
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
        const { data, error } = await supabaseClient.auth.signInWithPassword({
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