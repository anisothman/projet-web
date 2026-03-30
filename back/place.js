document.addEventListener('DOMContentLoaded', function () {

    async function chargerSiegesOccupes() {
        const now = new Date().toISOString();
        const { data, error } = await db
            .from('reservations')
            .select('seat')
            .gte('heure_fin', now); 


        document.querySelectorAll('.seat').forEach(s => {
            s.classList.remove('occupied', 'selected');
            s.classList.add('free');
        });


        data.forEach(r => {
            const seat = document.querySelector(`[data-seat="${r.seat}"]`);
            if (seat) {
                seat.classList.remove('free');
                seat.classList.add('occupied');
            }
        });

        attacherClics();
    }


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

    chargerSiegesOccupes();

}); 
