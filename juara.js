document.addEventListener('DOMContentLoaded', () => {
    // Penilaian tingkat 1 & 2
    const containerJuara1 = document.getElementById('juara-tingkat-1');
    const containerJuara2 = document.getElementById('juara-tingkat-2');
    // Wirus tingkat 3
    const containerJuaraWirus = document.getElementById('juara-wirus');

    // Storage key
    const STORAGE_PENILAIAN = 'dataPenilaianBeyondTheBlueprint';
    const STORAGE_WIRUS = 'dataWirusTingkat3';

    // Ambil data penilaian
    function ambilDataPenilaian() {
        const dataJSON = localStorage.getItem(STORAGE_PENILAIAN);
        return dataJSON ? JSON.parse(dataJSON) : [];
    }
    // Ambil data wirus
    function ambilDataWirus() {
        const dataJSON = localStorage.getItem(STORAGE_WIRUS);
        return dataJSON ? JSON.parse(dataJSON) : [];
    }

    // Tampilkan juara penilaian (tingkat 1/2)
    function tampilkanJuaraPenilaian(container, dataTingkat) {
        container.innerHTML = '';
        if (dataTingkat.length === 0) {
            container.innerHTML = '<p>Belum ada data untuk ditampilkan.</p>';
            return;
        }
        dataTingkat.sort((a, b) => b.skor - a.skor);
        const skorTertinggi = dataTingkat[0].skor;
        const paraJuara = dataTingkat.filter(data => data.skor === skorTertinggi);
        paraJuara.forEach(juara => {
            const kartuJuara = document.createElement('div');
            kartuJuara.classList.add('kartu-hasil');
            kartuJuara.innerHTML = `
                <div class="info">
                    <h3>${juara.nama}</h3>
                    <p>Kelas: ${juara.kelas}</p>
                </div>
                <div class="skor">${juara.skor}</div>
            `;
            container.appendChild(kartuJuara);
        });
    }

    // Tampilkan juara wirus (tingkat 3)
    function tampilkanJuaraWirus(container, data) {
        container.innerHTML = '';
        if (data.length === 0) {
            container.innerHTML = '<p>Belum ada data untuk ditampilkan.</p>';
            return;
        }
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

    // Proses data
    const semuaDataPenilaian = ambilDataPenilaian();
    const dataTingkat1 = semuaDataPenilaian.filter(d => d.kelas.startsWith('1'));
    const dataTingkat2 = semuaDataPenilaian.filter(d => d.kelas.startsWith('2'));
    const semuaDataWirus = ambilDataWirus();

    tampilkanJuaraPenilaian(containerJuara1, dataTingkat1);
    tampilkanJuaraPenilaian(containerJuara2, dataTingkat2);
    tampilkanJuaraWirus(containerJuaraWirus, semuaDataWirus);
}); 