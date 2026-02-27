// =============================================
//  Supabase Init
// =============================================
const supabaseUrl = 'https://zfnhtobgkkdmscnscpwh.supabase.co';
const supabaseKey = 'sb_publishable_3ogDZw3U19agKboWnQCSeg_B9WV9Xn_';
const client = supabase.createClient(supabaseUrl, supabaseKey);

// =============================================
//  Helpers
// =============================================
function showError(msg) {
    let box = document.getElementById('error-msg');
    if (!box) {
        box = document.createElement('p');
        box.id = 'error-msg';
        box.style.cssText = 'color:red; font-size:13px; margin-top:10px;';
        document.querySelector('form').appendChild(box);
    }
    box.textContent = msg;
}

function showSuccess(msg) {
    let box = document.getElementById('success-msg');
    if (!box) {
        box = document.createElement('p');
        box.id = 'success-msg';
        box.style.cssText = 'color:green; font-size:13px; margin-top:10px;';
        document.querySelector('form').appendChild(box);
    }
    box.textContent = msg;
}

// =============================================
//  AUTH GUARD — protect place.html
//  Redirects to login if user is not logged in
// =============================================
async function requireAuth() {
    const { data: { session } } = await client.auth.getSession();
    if (!session) {
        window.location.href = 'login.html';
    }
    return session;
}

// =============================================
//  LOGIN
// =============================================
async function handleLogin(e) {
    e.preventDefault();

    const email    = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    const { data, error } = await client.auth.signInWithPassword({ email, password });

    if (error) {
        showError(error.message);
        return;
    }

    // Redirect to reservation page on success
    window.location.href = 'place.html';
}

// =============================================
//  SIGNUP
// =============================================
async function handleSignup(e) {
    e.preventDefault();

    const nom             = document.getElementById('nom').value.trim();
    const email           = document.getElementById('email').value.trim();
    const password        = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        showError('Les mots de passe ne correspondent pas.');
        return;
    }

    if (password.length < 6) {
        showError('Le mot de passe doit contenir au moins 6 caractères.');
        return;
    }

    // Create auth user
    const { data, error } = await client.auth.signUp({
        email,
        password,
        options: {
            data: { full_name: nom }   // stored in auth.users metadata
        }
    });

    if (error) {
        showError(error.message);
        return;
    }

    // Also save the profile in your public `profiles` table (optional but recommended)
    // Make sure you have a `profiles` table with columns: id, full_name, email
    if (data.user) {
        await client.from('profiles').insert({
            id:        data.user.id,
            full_name: nom,
            email:     email
        });
    }

    showSuccess('Compte créé ! Vérifiez votre email pour confirmer.');
    setTimeout(() => window.location.href = 'login.html', 3000);
}

// =============================================
//  RESERVATION (place.html)
// =============================================
let selectedSeat = null;

function initSeats() {
    document.querySelectorAll('.seat.free').forEach(seat => {
        seat.addEventListener('click', () => {
            // Deselect previous
            document.querySelectorAll('.seat.selected').forEach(s => {
                s.classList.remove('selected');
                s.classList.add('free');
            });
            // Select clicked
            seat.classList.remove('free');
            seat.classList.add('selected');
            selectedSeat = seat.dataset.seat;
        });
    });
}

async function loadOccupiedSeats() {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const { data, error } = await client
        .from('reservations')
        .select('seat')
        .eq('date', today);

    if (error) { console.error(error); return; }

    data.forEach(row => {
        const seatEl = document.querySelector(`.seat[data-seat="${row.seat}"]`);
        if (seatEl) {
            seatEl.classList.remove('free', 'selected');
            seatEl.classList.add('occupied');
            seatEl.title = `Place ${row.seat} - Occupée`;
        }
    });
}

async function handleReservation(e) {
    e.preventDefault();

    const session = await requireAuth();

    if (!selectedSeat) {
        showError('Veuillez sélectionner une place.');
        return;
    }

    const fullName = document.getElementById('fullName').value.trim();
    const email    = document.getElementById('email').value.trim();
    const phone    = document.getElementById('phone').value.trim();
    const drink    = document.querySelector('input[name="m"]:checked')?.parentElement.querySelector('span')?.textContent || 'Café';
    const today    = new Date().toISOString().split('T')[0];

    // Check seat not already taken (race condition safety)
    const { data: existing } = await client
        .from('reservations')
        .select('id')
        .eq('seat', selectedSeat)
        .eq('date', today)
        .single();

    if (existing) {
        showError('Cette place vient d\'être prise. Veuillez en choisir une autre.');
        await loadOccupiedSeats();
        return;
    }

    const { error } = await client.from('reservations').insert({
        user_id:   session.user.id,
        full_name: fullName,
        email:     email,
        phone:     phone,
        drink:     drink,
        seat:      selectedSeat,
        date:      today
    });

    if (error) {
        showError(error.message);
        return;
    }

    showSuccess(`✅ Réservation confirmée ! Place ${selectedSeat} - ${today}`);

    // Mark seat as occupied in the UI
    const seatEl = document.querySelector(`.seat[data-seat="${selectedSeat}"]`);
    if (seatEl) {
        seatEl.classList.remove('selected');
        seatEl.classList.add('occupied');
    }
    selectedSeat = null;
}

// =============================================
//  LOGOUT
// =============================================
async function handleLogout() {
    await client.auth.signOut();
    window.location.href = 'login.html';
}

// =============================================
//  Page Router — attach listeners based on page
// =============================================
document.addEventListener('DOMContentLoaded', async () => {

    const path = window.location.pathname;

    // LOGIN PAGE
    if (document.getElementById('loginForm')) {
        document.getElementById('loginForm').addEventListener('submit', handleLogin);
    }

    // SIGNUP PAGE
    if (document.getElementById('signupForm')) {
        document.getElementById('signupForm').addEventListener('submit', handleSignup);
    }

    // RESERVATION PAGE
    if (document.getElementById('confirmBtn')) {
        await requireAuth();       // redirect if not logged in
        await loadOccupiedSeats(); // fetch today's taken seats from DB
        initSeats();               // attach click listeners to free seats
        document.querySelector('form').addEventListener('submit', handleReservation);
    }

    // LOGOUT BUTTON (add <button id="logoutBtn"> anywhere)
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});