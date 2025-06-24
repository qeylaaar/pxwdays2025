document.addEventListener('DOMContentLoaded', () => {
    const formPenilaian1 = document.getElementById('form-penilaian-1');
    const hasilPenilaianContainer1 = document.getElementById('hasil-penilaian-1');
    const STORAGE_KEY_1 = 'dataPenilaianTingkat1';

    const SKOR = {
        MITRA: 5,
        PENGUNJUNG: 5,
        DOSEN: 20
    };

    function ambilDataDariStorage() {
        const dataJSON = localStorage.getItem(STORAGE_KEY_1);
        return dataJSON ? JSON.parse(dataJSON) : [];
    }

    function simpanDataKeStorage(data) {
        localStorage.setItem(STORAGE_KEY_1, JSON.stringify(data));
    }

    formPenilaian1.addEventListener('submit', function(event) {
        event.preventDefault();
        const namaKelompok = document.getElementById('nama-kelompok-1').value;
        const kelas = document.getElementById('kelas-1').value;
        const stikerMitra = parseInt(document.getElementById('stiker-mitra-1').value) || 0;
        const stikerPengunjung = parseInt(document.getElementById('stiker-pengunjung-1').value) || 0;
        const stikerDosen = parseInt(document.getElementById('stiker-dosen-1').value) || 0;
        if (!namaKelompok || !kelas) {
            alert('Nama kelompok dan kelas harus diisi!');
            return;
        }
        const totalSkor = (stikerMitra * SKOR.MITRA) + (stikerPengunjung * SKOR.PENGUNJUNG) + (stikerDosen * SKOR.DOSEN);
        const dataBaru = {
            id: Date.now(),
            nama: namaKelompok,
            kelas: kelas,
            skor: totalSkor
        };
        const semuaData = ambilDataDariStorage();
        semuaData.push(dataBaru);
        simpanDataKeStorage(semuaData);
        muatSemuaData();
        formPenilaian1.reset();
        document.getElementById('nama-kelompok-1').focus();
    });

    function buatBarisTabel(data) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${data.nama}</td>
            <td>${data.kelas}</td>
            <td>${data.skor}</td>
            <td><button class="tombol-hapus" data-id="${data.id}">Hapus</button></td>
        `;
        return tr;
    }

    function muatSemuaData() {
        let semuaData = ambilDataDariStorage();
        semuaData.sort((a, b) => b.skor - a.skor);
        let html = '<table class="tabel-hasil"><thead><tr><th>Nama Kelompok</th><th>Kelas</th><th>Skor</th><th>Aksi</th></tr></thead><tbody></tbody></table>';
        hasilPenilaianContainer1.innerHTML = html;
        const tbody = hasilPenilaianContainer1.querySelector('tbody');
        semuaData.forEach(data => {
            tbody.appendChild(buatBarisTabel(data));
        });
    }

    hasilPenilaianContainer1.addEventListener('click', function(event) {
        if (event.target.classList.contains('tombol-hapus')) {
            const id = parseInt(event.target.getAttribute('data-id'));
            let semuaData = ambilDataDariStorage();
            semuaData = semuaData.filter(data => data.id !== id);
            simpanDataKeStorage(semuaData);
            muatSemuaData();
        }
    });

    muatSemuaData();
}); 