// ==============================
// ÉTAPE 1 : Récupérer les données du formulaire
// ==============================

document.getElementById('reservationForm').addEventListener('submit', async function (e) {
    
    // Empêcher la page de se recharger
    e.preventDefault();

    // Récupérer le siège sélectionné
    const seat = document.querySelector('.seat.selected')?.dataset.seat;
    
    // Vérifier qu'une place est choisie
    if (!seat) {
        alert('⚠️ Choisissez une place !');
        return;
    }

    // Récupérer les valeurs du formulaire
    const nom        = document.getElementById('fullName').value;
    const email      = document.getElementById('email').value;
    const telephone  = document.getElementById('phone').value;
    const boisson    = document.querySelector('input[name="m"]:checked').value;
    const date       = document.getElementById('reservationDate').value;
    const heure      = document.getElementById('reservationTime').value;
    const duree      = parseFloat(document.getElementById('reservationDuration').value);

    // Vérifier que tout est rempli
    if (!date || !heure || !duree) {
        alert('⚠️ Remplissez date, heure et durée !');
        return;
    }

    // ==============================
    // ÉTAPE 2 : Calculer l'heure de fin
    // ==============================

    const heureFin = new Date(`${date}T${heure}:00Z`);
    heureFin.setHours(heureFin.getHours() + Math.floor(duree));
    heureFin.setMinutes(heureFin.getMinutes() + (duree % 1) * 60);

    // ==============================
    // ÉTAPE 3 : Envoyer dans Supabase
    // ==============================

    const { error } = await db.from('reservations').insert({
        full_name      : nom,
        email          : email,
        phone          : telephone,
        machroub       : boisson,
        seat           : seat,
        date_reservation: date,
        heure_debut    : heure,
        duree          : duree,
        heure_fin      : heureFin.toISOString()
    });

    // ==============================
    // ÉTAPE 4 : Résultat
    // ==============================

    if (error) {
        // Quelque chose a mal tourné
        alert('❌ Erreur : ' + error.message);
        console.error(error);
    } else {
        // Succès !
        const hF = heureFin.getHours().toString().padStart(2, '0');
        const mF = heureFin.getMinutes().toString().padStart(2, '0');
        alert(`✅ Place ${seat} réservée jusqu'à ${hF}:${mF} !`);
        
        // Réinitialiser le formulaire
        this.reset();
        document.getElementById('heureFin').textContent = '';
        
        // Rafraîchir les sièges
        chargerSiegesOccupes();
    }
});
