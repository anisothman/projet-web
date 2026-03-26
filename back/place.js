document.addEventListener('DOMContentLoaded', function () {

    // ============ CHARGER SIÈGES OCCUPÉS ============
    async function chargerSiegesOccupes() {
        const maintenant = new Date();

        const { data, error } = await db
            .from('reservations')
            .select('seat')

        if (error) { console.error(error); return; }

        // Remettre tous libres
        document.querySelectorAll('.seat').forEach(s => {
            s.classList.remove('occupied', 'selected');
            s.classList.add('free');
        });

        // Marquer occupés
        data.forEach(r => {
            const seat = document.querySelector(`[data-seat="${r.seat}"]`);
            if (seat) {
                seat.classList.remove('free');
                seat.classList.add('occupied');
            }
        });

        attacherClics();
    }

    // ============ CLIC SUR SIÈGE ============
    function attacherClics() {
        document.querySelectorAll('.seat.free').forEach(seat => {
            seat.onclick = function () {
                document.querySelectorAll('.seat.selected').forEach(s => {
                    s.classList.remove('selected');
                    s.classList.add('free');
                });
                this.classList.remove('free');
                this.classList.add('selected');
            };
        });
    }

    // ============ CALCUL HEURE FIN ============
    function calculerFin() {
        const heure = document.getElementById('reservationTime').value;
        const duree = parseFloat(document.getElementById('reservationDuration').value);
        if (heure && duree) {
            const [h, m] = heure.split(':').map(Number);
            const fin = new Date();
            fin.setHours(h + Math.floor(duree), m + (duree % 1) * 60);
            document.getElementById('heureFin').textContent =
                `⏰ Fin : ${fin.getHours().toString().padStart(2, '0')}:${fin.getMinutes().toString().padStart(2, '0')}`;
        }
    }

    document.getElementById('reservationTime').addEventListener('change', calculerFin);
    document.getElementById('reservationDuration').addEventListener('input', calculerFin);

    // Vérifier expirations toutes les minutes
    setInterval(chargerSiegesOccupes, 60000);

    // Chargement initial
    chargerSiegesOccupes();

}); // fin DOMContentLoaded