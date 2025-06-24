document.addEventListener('DOMContentLoaded', () => {
    const containerJuara = document.getElementById('juara-wirus');
    const STORAGE_KEY = 'dataWirusTingkat3';

    function ambilDataDariStorage() {
        const dataJSON = localStorage.getItem(STORAGE_KEY);
        return dataJSON ? JSON.parse(dataJSON) : [];
    }

    function tampilkanJuara(container, data) {
        container.innerHTML = '';
        if (data.length === 0) {
            container.innerHTML = '<p>Belum ada data untuk ditampilkan.</p>';
            return;
        }
        // Urutkan berdasarkan pendapatan tertinggi
        data.sort((a, b) => b.pendapatan - a.pendapatan);
        const pendapatanTertinggi = data[0].pendapatan;
        const paraJuara = data.filter(d => d.pendapatan === pendapatanTertinggi);
        paraJuara.forEach(juara => {
            const kartu = document.createElement('div');
            kartu.classList.add('kartu-hasil');
            kartu.innerHTML = `
                <div class="info">
                    <h3>${juara.nama}</h3>
                    <p>Kelas: ${juara.kelas}</p>
                </div>
                <div class="skor">Rp ${juara.pendapatan.toLocaleString('id-ID')}</div>
            `;
            container.appendChild(kartu);
        });
    }

    const semuaData = ambilDataDariStorage();
    tampilkanJuara(containerJuara, semuaData);
}); 