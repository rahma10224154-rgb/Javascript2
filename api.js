// =============================================================
// LAB 2 - api.js  (SUDAH JADI, TIDAK PERLU DIUBAH)
//
// "API pura-pura": meniru cara kerja backend/web service.
//  - Setiap function mengembalikan PROMISE dan sengaja diberi jeda,
//    seperti menunggu jawaban server sungguhan  ->  pakai await.
//  - Jika data ditolak, Promise di-reject (Error)  ->  tangkap dengan try/catch.
//  - Data disimpan di localStorage dalam format JSON,
//    jadi tidak hilang saat halaman di-refresh.
//
// Di final project (Laravel), isi function ini diganti fetch() ke server.
// Kode di app.js tetap sama polanya: await -> data -> DOM.
//
//   ambilMahasiswa()        -> Promise berisi array mahasiswa (data mentah)
//   tambahMahasiswa(baru)   -> Promise berisi data tersimpan | Error: tidak valid / NIM sudah ada
//   hapusMahasiswa(nim)     -> Promise berisi pesan          | Error: NIM tidak ditemukan
//   resetData()             -> kembalikan data awal (ketik di Console, lalu refresh)
// =============================================================

const KUNCI_STORAGE = 'lab2-mahasiswa';
const JEDA_MS = 500;   // pura-pura menunggu jaringan

function tunggu(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function bacaStorage() {
  const isi = localStorage.getItem(KUNCI_STORAGE);   // string JSON, atau null jika belum ada
  return isi ? JSON.parse(isi) : JSON.parse(JSON.stringify(DATA_AWAL));
}

function simpanStorage(daftar) {
  localStorage.setItem(KUNCI_STORAGE, JSON.stringify(daftar));
}

// Validasi di sisi "server": jangan percaya data yang datang dari form.
function validasiDiAPI(m) {
  const errors = [];
  if (typeof m.nim !== 'string' || !/^\d{7}$/.test(m.nim)) errors.push('NIM harus 7 digit angka');
  if (typeof m.nama !== 'string' || m.nama.trim().length < 3) errors.push('Nama minimal 3 karakter');
  for (const kolom of ['tugas', 'uts', 'uas']) {
    const n = m[kolom];
    if (typeof n !== 'number' || !Number.isFinite(n) || n < 0 || n > 100) {
      errors.push(`Nilai ${kolom} harus angka 0-100`);
    }
  }
  return errors;
}

async function ambilMahasiswa() {
  await tunggu(JEDA_MS);
  return bacaStorage();
}

async function tambahMahasiswa(baru) {
  await tunggu(JEDA_MS);
  const errors = validasiDiAPI(baru ?? {});
  if (errors.length > 0) throw new Error(errors.join(', '));

  const daftar = bacaStorage();
  if (daftar.some((m) => m.nim === baru.nim)) {
    throw new Error(`NIM ${baru.nim} sudah terdaftar`);
  }
  const data = { nim: baru.nim, nama: baru.nama.trim(), tugas: baru.tugas, uts: baru.uts, uas: baru.uas };
  daftar.push(data);
  simpanStorage(daftar);
  return data;
}

async function hapusMahasiswa(nim) {
  await tunggu(JEDA_MS);
  const daftar = bacaStorage();
  const sisa = daftar.filter((m) => m.nim !== nim);
  if (sisa.length === daftar.length) {
    throw new Error(`NIM ${nim} tidak ditemukan`);
  }
  simpanStorage(sisa);
  return `NIM ${nim} dihapus`;
}

function resetData() {
  localStorage.removeItem(KUNCI_STORAGE);
  return 'Data dikembalikan ke awal. Refresh halaman (F5).';
}
