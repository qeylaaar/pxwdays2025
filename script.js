document.addEventListener('DOMContentLoaded', () => {
    const formPenilaian = document.getElementById('form-penilaian');
    const hasilPenilaianContainer = document.getElementById('hasil-penilaian');
    const STORAGE_KEY = 'dataPenilaianBeyondTheBlueprint';

    // Skor untuk setiap jenis stiker
    const SKOR = {
        MITRA: 5,
        PENGUNJUNG: 5,
        DOSEN: 20
    };

    function ambilDataDariStorage() {
        const dataJSON = localStorage.getItem(STORAGE_KEY);
        return dataJSON ? JSON.parse(dataJSON) : [];
    }

    function simpanDataKeStorage(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    formPenilaian.addEventListener('submit', function(event) {
        event.preventDefault(); // Mencegah form dari reload halaman

        // Mengambil nilai dari form
        const namaKelompok = document.getElementById('nama-kelompok').value;
        const kelas = document.getElementById('kelas').value;
        const stikerMitra = parseInt(document.getElementById('stiker-mitra').value) || 0;
        const stikerPengunjung = parseInt(document.getElementById('stiker-pengunjung').value) || 0;
        const stikerDosen = parseInt(document.getElementById('stiker-dosen').value) || 0;

        // Validasi input
        if (!namaKelompok || !kelas) {
            alert('Nama kelompok dan kelas harus diisi!');
            return;
        }

        // Menghitung total skor
        const totalSkor = (stikerMitra * SKOR.MITRA) +
                          (stikerPengunjung * SKOR.PENGUNJUNG) +
                          (stikerDosen * SKOR.DOSEN);

        const dataBaru = {
            id: Date.now(), // ID unik untuk setiap entri
            nama: namaKelompok,
            kelas: kelas,
            skor: totalSkor
        };

        const semuaData = ambilDataDariStorage();
        semuaData.push(dataBaru);
        simpanDataKeStorage(semuaData);

        tampilkanSatuHasil(dataBaru);
        formPenilaian.reset();
        document.getElementById('nama-kelompok').focus();
    });

    function tampilkanSatuHasil(data) {
        const kartuHasil = document.createElement('div');
        kartuHasil.classList.add('kartu-hasil');
        kartuHasil.dataset.id = data.id; // Tambahkan ID ke elemen

        const tingkat = data.kelas.startsWith('1') ? 'Tingkat 1' : 'Tingkat 2';

        kartuHasil.innerHTML = `
            <div class="info">
                <h3>${data.nama}</h3>
                <p>Kelas: ${data.kelas} (${tingkat})</p>
            </div>
            <div class="skor">${data.skor}</div>
            <button class="tombol-hapus">Hapus</button>
        `;

        hasilPenilaianContainer.appendChild(kartuHasil);
    }

    function muatSemuaData() {
        const semuaData = ambilDataDariStorage();
        hasilPenilaianContainer.innerHTML = ''; // Kosongkan dulu
        semuaData.forEach(data => tampilkanSatuHasil(data));
    }

    hasilPenilaianContainer.addEventListener('click', function(event) {
        if (event.target.classList.contains('tombol-hapus')) {
            const kartu = event.target.closest('.kartu-hasil');
            const idUntukHapus = parseInt(kartu.dataset.id);
            
            // Hapus dari DOM
            kartu.remove();

            // Hapus dari localStorage
            let semuaData = ambilDataDariStorage();
            semuaData = semuaData.filter(data => data.id !== idUntukHapus);
            simpanDataKeStorage(semuaData);
        }
    });

    // Muat data yang sudah ada saat halaman dibuka
    muatSemuaData();
}); 