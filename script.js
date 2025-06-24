document.addEventListener('DOMContentLoaded', () => {
    // Form dan container untuk Tingkat 1
    const formPenilaian1 = document.getElementById('form-penilaian-1');
    const hasilPenilaianContainer1 = document.getElementById('hasil-penilaian-1');
    const exportExcel1 = document.getElementById('export-excel-1');
    const STORAGE_KEY_1 = 'dataPenilaianTingkat1';

    // Form dan container untuk Tingkat 2
    const formPenilaian2 = document.getElementById('form-penilaian-2');
    const hasilPenilaianContainer2 = document.getElementById('hasil-penilaian-2');
    const exportExcel2 = document.getElementById('export-excel-2');
    const STORAGE_KEY_2 = 'dataPenilaianTingkat2';

    // Skor untuk setiap jenis stiker
    const SKOR = {
        MITRA: 5,
        PENGUNJUNG: 5,
        DOSEN: 20
    };

    function ambilDataDariStorage(key) {
        const dataJSON = localStorage.getItem(key);
        return dataJSON ? JSON.parse(dataJSON) : [];
    }

    function simpanDataKeStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    // Handler submit Tingkat 1
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
        const semuaData = ambilDataDariStorage(STORAGE_KEY_1);
        semuaData.push(dataBaru);
        simpanDataKeStorage(STORAGE_KEY_1, semuaData);
        muatSemuaData(1);
        formPenilaian1.reset();
        document.getElementById('nama-kelompok-1').focus();
    });

    // Handler submit Tingkat 2
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
        const semuaData = ambilDataDariStorage(STORAGE_KEY_2);
        semuaData.push(dataBaru);
        simpanDataKeStorage(STORAGE_KEY_2, semuaData);
        muatSemuaData(2);
        formPenilaian2.reset();
        document.getElementById('nama-kelompok-2').focus();
    });

    // Tampilkan satu baris hasil dalam bentuk tabel
    function buatBarisTabel(data, tingkat) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${data.nama}</td>
            <td>${data.kelas}</td>
            <td>${data.skor}</td>
            <td><button class="tombol-hapus" data-id="${data.id}" data-tingkat="${tingkat}">Hapus</button></td>
        `;
        return tr;
    }

    // Render tabel hasil
    function muatSemuaData(tingkat) {
        const key = tingkat === 1 ? STORAGE_KEY_1 : STORAGE_KEY_2;
        const container = tingkat === 1 ? hasilPenilaianContainer1 : hasilPenilaianContainer2;
        let semuaData = ambilDataDariStorage(key);
        // Sorting descending
        semuaData.sort((a, b) => b.skor - a.skor);
        // Buat tabel
        let html = '<table class="tabel-hasil"><thead><tr><th>Nama Kelompok</th><th>Kelas</th><th>Skor</th><th>Aksi</th></tr></thead><tbody></tbody></table>';
        container.innerHTML = html;
        const tbody = container.querySelector('tbody');
        semuaData.forEach(data => {
            tbody.appendChild(buatBarisTabel(data, tingkat));
        });
    }

    // Hapus data
    function hapusData(id, tingkat) {
        const key = tingkat === 1 ? STORAGE_KEY_1 : STORAGE_KEY_2;
        let semuaData = ambilDataDariStorage(key);
        semuaData = semuaData.filter(data => data.id !== id);
        simpanDataKeStorage(key, semuaData);
        muatSemuaData(tingkat);
    }

    // Event hapus untuk kedua tabel
    [hasilPenilaianContainer1, hasilPenilaianContainer2].forEach((container, idx) => {
        container.addEventListener('click', function(event) {
            if (event.target.classList.contains('tombol-hapus')) {
                const id = parseInt(event.target.getAttribute('data-id'));
                const tingkat = parseInt(event.target.getAttribute('data-tingkat'));
                hapusData(id, tingkat);
            }
        });
    });

    // Ekspor ke Excel (CSV sederhana)
    function exportToExcel(tingkat) {
        const key = tingkat === 1 ? STORAGE_KEY_1 : STORAGE_KEY_2;
        let semuaData = ambilDataDariStorage(key);
        semuaData.sort((a, b) => b.skor - a.skor);
        let csv = 'Nama Kelompok,Kelas,Skor\n';
        semuaData.forEach(data => {
            csv += `"${data.nama}","${data.kelas}","${data.skor}"\n`;
        });
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `penilaian_tingkat${tingkat}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    exportExcel1.addEventListener('click', () => exportToExcel(1));
    exportExcel2.addEventListener('click', () => exportToExcel(2));

    // Inisialisasi
    muatSemuaData(1);
    muatSemuaData(2);
}); 