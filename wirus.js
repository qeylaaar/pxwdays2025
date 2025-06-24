document.addEventListener('DOMContentLoaded', () => {
    const formWirus = document.getElementById('form-wirus');
    const hasilWirusContainer = document.getElementById('hasil-wirus');
    const STORAGE_KEY = 'dataWirusTingkat3';

    function ambilDataDariStorage() {
        const dataJSON = localStorage.getItem(STORAGE_KEY);
        return dataJSON ? JSON.parse(dataJSON) : [];
    }

    function simpanDataKeStorage(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    formWirus.addEventListener('submit', function(event) {
        event.preventDefault();

        const namaTim = document.getElementById('nama-tim').value;
        const kelas = document.getElementById('kelas-wirus').value;
        const pendapatan = parseInt(document.getElementById('pendapatan').value) || 0;

        if (!namaTim || !kelas) {
            alert('Nama tim dan kelas harus diisi!');
            return;
        }

        const dataBaru = {
            id: Date.now(),
            nama: namaTim,
            kelas: kelas,
            pendapatan: pendapatan
        };

        const semuaData = ambilDataDariStorage();
        semuaData.push(dataBaru);
        simpanDataKeStorage(semuaData);

        tampilkanSatuHasil(dataBaru);
        formWirus.reset();
        document.getElementById('nama-tim').focus();
    });

    function tampilkanSatuHasil(data) {
        const kartu = document.createElement('div');
        kartu.classList.add('kartu-hasil');
        kartu.dataset.id = data.id;

        kartu.innerHTML = `
            <div class="info">
                <h3>${data.nama}</h3>
                <p>Kelas: ${data.kelas}</p>
            </div>
            <div class="skor">Rp ${data.pendapatan.toLocaleString('id-ID')}</div>
            <button class="tombol-hapus">Hapus</button>
        `;

        hasilWirusContainer.appendChild(kartu);
    }

    function muatSemuaData() {
        const semuaData = ambilDataDariStorage();
        hasilWirusContainer.innerHTML = '';
        semuaData.forEach(data => tampilkanSatuHasil(data));
    }

    hasilWirusContainer.addEventListener('click', function(event) {
        if (event.target.classList.contains('tombol-hapus')) {
            const kartu = event.target.closest('.kartu-hasil');
            const idUntukHapus = parseInt(kartu.dataset.id);
            kartu.remove();
            let semuaData = ambilDataDariStorage();
            semuaData = semuaData.filter(data => data.id !== idUntukHapus);
            simpanDataKeStorage(semuaData);
        }
    });

    muatSemuaData();
}); 