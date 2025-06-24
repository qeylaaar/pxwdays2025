document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_KEY_1 = 'dataPenilaianTingkat1';
    const STORAGE_KEY_2 = 'dataPenilaianTingkat2';
    const STORAGE_KEY_3 = 'dataWirusTingkat3'; // Assuming this is the key from wirus.js

    const container1 = document.getElementById('juara-tingkat-1');
    const container2 = document.getElementById('juara-tingkat-2');
    const container3 = document.getElementById('juara-wirus');

    const exportBtn1 = document.getElementById('export-excel-1');
    const exportBtn2 = document.getElementById('export-excel-2');
    const exportBtn3 = document.getElementById('export-excel-3');

    function ambilData(key) {
        const dataJSON = localStorage.getItem(key);
        return dataJSON ? JSON.parse(dataJSON) : [];
    }

    function renderTabel(container, data, jenis) {
        container.innerHTML = '';
        if (data.length === 0) {
            container.innerHTML = '<p>Belum ada data untuk ditampilkan.</p>';
            return;
        }

        const isWirus = jenis === 'wirus';
        if (isWirus) {
            data.sort((a, b) => b.pendapatan - a.pendapatan);
        } else {
            data.sort((a, b) => b.skor - a.skor);
        }
        
        const table = document.createElement('table');
        table.className = 'tabel-hasil';
        
        const header = `
            <thead>
                <tr>
                    <th>Peringkat</th>
                    <th>Nama Kelompok</th>
                    <th>Kelas</th>
                    <th>${isWirus ? 'Pendapatan' : 'Skor'}</th>
                </tr>
            </thead>
        `;
        
        const body = data.map((item, index) => {
            const skorOrPendapatan = isWirus ? `Rp ${item.pendapatan.toLocaleString('id-ID')}` : item.skor;
            return `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.nama}</td>
                    <td>${item.kelas}</td>
                    <td>${skorOrPendapatan}</td>
                </tr>
            `;
        }).join('');

        table.innerHTML = `${header}<tbody>${body}</tbody>`;
        container.appendChild(table);
    }

    function exportToExcel(data, jenis) {
        if (data.length === 0) {
            alert('Tidak ada data untuk diekspor.');
            return;
        }

        const isWirus = jenis === 'wirus';
        if (isWirus) {
            data.sort((a, b) => b.pendapatan - a.pendapatan);
        } else {
            data.sort((a, b) => b.skor - a.skor);
        }

        let csv = `Peringkat,Nama Kelompok,Kelas,${isWirus ? 'Pendapatan' : 'Skor'}\n`;
        data.forEach((item, index) => {
            const skorOrPendapatan = isWirus ? item.pendapatan : item.skor;
            csv += `${index + 1},"${item.nama}","${item.kelas}",${skorOrPendapatan}\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `peringkat_${jenis}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    const data1 = ambilData(STORAGE_KEY_1);
    const data2 = ambilData(STORAGE_KEY_2);
    const data3 = ambilData(STORAGE_KEY_3);

    renderTabel(container1, data1, 'tingkat1');
    renderTabel(container2, data2, 'tingkat2');
    renderTabel(container3, data3, 'wirus');

    exportBtn1.addEventListener('click', () => exportToExcel(data1, 'tingkat1'));
    exportBtn2.addEventListener('click', () => exportToExcel(data2, 'tingkat2'));
    exportBtn3.addEventListener('click', () => exportToExcel(data3, 'wirus'));
}); 