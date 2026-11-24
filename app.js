
// =============================================================
// LAB 2 - app.js (STARTER) - berjalan di BROWSER
// DOM + event + async/await.
// Memakai function dari nilai.js (hitung nilai) dan api.js (data),
// yang sudah dimuat lebih dulu oleh index.html.
//
// Kerjakan TODO sesuai urutan LANGKAH di "Sesi 2" (Langkah 3 - 7).
// Simpan file -> refresh browser (Cmd+R / Ctrl+R) -> cek Console (F12).
// =============================================================
// ---------- Sudah jadi: pilih elemen ----------
const tbody = document.querySelector('#tabel-body');
const form = document.querySelector('#form-mahasiswa');
const inputCari = document.querySelector('#cari');
const pesan = document.querySelector('#pesan');

let semuaData = [];   // hasil rekap (sudah ada nilaiAkhir, grade, lulus)

// =============================================================
// LANGKAH 3a: ambil data dari API (api.js)
// =============================================================
async function muatData() {
  // TODO:
  //  1. const daftar = await ambilMahasiswa()  <- data mentah: nim, nama, tugas, uts, uas
  //  2. semuaData = buatRekap(daftar)          <- hitung nilai (fungsi Lab 1)
  //  3. panggil tampilkan()
  //  Bungkus dengan try/catch; di catch panggil
  //  tampilkanPesan(`Gagal memuat data: ${err.message}`, 'error')

  try {
    const daftar = await ambilMahasiswa();
    semuaData = buatRekap(daftar);
    tampilkan();
  } catch (err) {
    tampilkanPesan(`Gagal memuat data: ${err.message}`, 'error');
  }
}

// Sudah jadi: menampilkan tabel (hasil pencarian) + statistik (seluruh data)
function tampilkan() {
  const hasilCari = cariMahasiswa(semuaData, inputCari.value);
  renderTabel(hasilCari);
  renderStatistik(semuaData);
}

// =============================================================
// LANGKAH 3b: tampilkan data ke tabel
// =============================================================
function renderTabel(data) {
  tbody.replaceChildren();   // kosongkan isi tabel

  // TODO:
  //  Untuk setiap mahasiswa m di data (for...of):
  //   1. buat <tr>, beri class 'lulus' atau 'tidak-lulus' (classList.add)
  //   2. untuk setiap nilai di [m.nim, m.nama, m.tugas, m.uts, m.uas, m.nilaiAkhir, m.grade]
  //      buat <td>, isi dengan textContent (BUKAN innerHTML), append ke <tr>
  //   3. append <tr> ke tbody
  //
  //  BONUS (Langkah 7): tambahkan <td> berisi <button class="btn-hapus" data-nim="...">Hapus</button>
  //
  //  Jika data kosong: tampilkan satu baris "Tidak ada data" (td.colSpan = 8)

  if (data.length === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');

    td.colSpan = 8;
    td.classList.add('kosong');
    td.textContent = 'Tidak ada data';

    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  for (const m of data) {
    const tr = document.createElement('tr');

    tr.classList.add(m.lulus ? 'lulus' : 'tidak-lulus');

    for (const nilai of [
      m.nim,
      m.nama,
      m.tugas,
      m.uts,
      m.uas,
      m.nilaiAkhir,
      m.grade
    ]) {
      const td = document.createElement('td');
      td.textContent = nilai;
      tr.appendChild(td);
    }

    const tdAksi = document.createElement('td');
    const tombol = document.createElement('button');

    tombol.classList.add('btn-hapus');
    tombol.dataset.nim = m.nim;
    tombol.textContent = 'Hapus';

    tdAksi.appendChild(tombol);
    tr.appendChild(tdAksi);

    tbody.appendChild(tr);
  }
}

// =============================================================
// LANGKAH 4: statistik
// =============================================================
function renderStatistik(data) {
  // TODO: isi textContent dari elemen berikut memakai function dari nilai.js
  //  #stat-jumlah      -> jumlah mahasiswa
  //  #stat-lulus       -> contoh "6/8"        (filter m.lulus)
  //  #stat-rata        -> hitungRataRata(data)
  //  #stat-tertinggi   -> contoh "Siti Nurhaliza (92)"  (cariTertinggi, hati-hati jika null)
  //  #stat-distribusi  -> contoh "A: 1 · B: 3 · C: 2 · D: 1 · E: 1"
  //                       Petunjuk: Object.entries(hitungDistribusiGrade(data)).map(...).join(' · ')

  document.querySelector('#stat-jumlah').textContent = data.length;

  const jumlahLulus = data.filter(m => m.lulus).length;

  document.querySelector('#stat-lulus').textContent =
    `${jumlahLulus}/${data.length}`;

  document.querySelector('#stat-rata').textContent =
    hitungRataRata(data);

  const tertinggi = cariTertinggi(data);

  document.querySelector('#stat-tertinggi').textContent =
    tertinggi
      ? `${tertinggi.nama} (${tertinggi.nilaiAkhir})`
      : '-';

  document.querySelector('#stat-distribusi').textContent =
    Object.entries(hitungDistribusiGrade(data))
      .map(([grade, jumlah]) => `${grade}: ${jumlah}`)
      .join(' · ');
}

// Sudah jadi
function tampilkanPesan(teks, jenis) {
  pesan.textContent = teks;
  pesan.className = jenis;   // 'sukses' atau 'error' (lihat style.css)
}

// =============================================================
// LANGKAH 5: pencarian
// =============================================================
// TODO: saat user mengetik di inputCari (event 'input'), panggil tampilkan()

inputCari.addEventListener('input', () => {
  tampilkan();
});

// =============================================================
// LANGKAH 6: tambah mahasiswa
// =============================================================
form.addEventListener('submit', async (event) => {
  event.preventDefault();   // cegah reload halaman

  const f = new FormData(form);
  const baru = {
    nim: f.get('nim').trim(),
    nama: f.get('nama').trim(),
    tugas: f.get('tugas') === '' ? NaN : Number(f.get('tugas')),
    uts: f.get('uts') === '' ? NaN : Number(f.get('uts')),
    uas: f.get('uas') === '' ? NaN : Number(f.get('uas')),
  };

  // TODO:
  //  1. const errors = validasiMahasiswa(baru); jika ada error -> tampilkanPesan(..., 'error') lalu return
  //  2. simpan lewat API:  const hasil = await tambahMahasiswa(baru);
  //     (jika ditolak, api.js melempar Error -> otomatis masuk ke catch)
  //  3. const [r] = buatRekap([hasil]);
  //     tampilkanPesan(`${r.nama} tersimpan: nilai ${r.nilaiAkhir} (${r.grade})`, 'sukses')
  //  4. form.reset(), lalu await muatData()
  //  Bungkus langkah 2-4 dengan try/catch;
  //  di catch: tampilkanPesan(`Gagal menyimpan: ${err.message}`, 'error')

  const errors = validasiMahasiswa(baru);

  if (errors.length > 0) {
    tampilkanPesan(errors.join(', '), 'error');
    return;
  }

  try {
    const hasil = await tambahMahasiswa(baru);

    const [r] = buatRekap([hasil]);

    tampilkanPesan(
      `${r.nama} tersimpan: nilai ${r.nilaiAkhir} (${r.grade})`,
      'sukses'
    );

    form.reset();
    await muatData();
  } catch (err) {
    tampilkanPesan(`Gagal menyimpan: ${err.message}`, 'error');
  }
});

// =============================================================
// LANGKAH 7 (BONUS): hapus dengan event delegation
// =============================================================
// TODO: satu listener 'click' di tbody.
//  const tombol = event.target.closest('.btn-hapus'); if (!tombol) return;
//  ambil nim dari tombol.dataset.nim, konfirmasi dengan confirm(...),
//  const teks = await hapusMahasiswa(nim); tampilkanPesan(teks, 'sukses'); lalu muatData()
//  (bungkus dengan try/catch)

tbody.addEventListener('click', async (event) => {
  const tombol = event.target.closest('.btn-hapus');

  if (!tombol) return;

  const nim = tombol.dataset.nim;

  if (!confirm(`Yakin ingin menghapus mahasiswa NIM ${nim}?`)) {
    return;
  }

  try {
    const teks = await hapusMahasiswa(nim);
    tampilkanPesan(teks, 'sukses');
    await muatData();
  } catch (err) {
    tampilkanPesan(`Gagal menghapus: ${err.message}`, 'error');
  }
});

// ---------- Mulai ----------
muatData();
