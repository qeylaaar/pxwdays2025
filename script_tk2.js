document.addEventListener('DOMContentLoaded', () => {
    const formPenilaian2 = document.getElementById('form-penilaian-2');
    const hasilPenilaianContainer2 = document.getElementById('hasil-penilaian-2');
    const STORAGE_KEY_2 = 'dataPenilaianTingkat2';

    const SKOR = {
        MITRA: 5,
        PENGUNJUNG: 5,
        DOSEN: 20
    };

    function ambilDataDariStorage() {
        const dataJSON = localStorage.getItem(STORAGE_KEY_2);
        return dataJSON ? JSON.parse(dataJSON) : [];
    }

    function simpanDataKeStorage(data) {
        localStorage.setItem(STORAGE_KEY_2, JSON.stringify(data));
    }

    formPenilaian2.addEventListener('submit', function(event) {
        event.preventDefault();
        const namaKelompok = document.getElementById('nama-kelompok-2').value;
        const kelas = document.getElementById('kelas-2').value;
        const stikerMitra = parseInt(document.getElementById('stiker-mitra-2').value) || 0;
        const stikerPengunjung = parseInt(document.getElementById('stiker-pengunjung-2').value) || 0;
        const stikerDosen = parseInt(document.getElementById('stiker-dosen-2').value) || 0;
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
        formPenilaian2.reset();
        document.getElementById('nama-kelompok-2').focus();
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
        hasilPenilaianContainer2.innerHTML = html;
        const tbody = hasilPenilaianContainer2.querySelector('tbody');
        semuaData.forEach(data => {
            tbody.appendChild(buatBarisTabel(data));
        });
    }

    hasilPenilaianContainer2.addEventListener('click', function(event) {
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