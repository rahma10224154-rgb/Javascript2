

// =============================================================
// nilai.js (STARTER) - LOGIKA hitung nilai, berjalan di BROWSER
//
// LANGKAH 2:
//   Ganti setiap function di bawah dengan versi Anda dari LAB 1 (soal.js).
//   Function di bawah sengaja hanya "stub" agar halaman tetap bisa berjalan.
//
// File ini hanya berisi LOGIKA (hitung nilai). Urusan DOM ada di app.js.
// Uji di Console browser, mis.: tentukanGrade(84.9)  -> 'B'
// =============================================================

function hitungNilaiAkhir(tugas, uts, uas) {
  // TODO: salin dari Lab 1
  return tugas * 0.3 + uts * 0.3 + uas * 0.4;
}

function tentukanGrade(nilai) {
  // TODO: salin dari Lab 1
  if (nilai >= 90) return 'A';
  if (nilai >= 70) return 'B';
  if (nilai >= 65) return 'C';
  if (nilai >= 50) return 'D';
  return 'E';
}

function buatRekap(daftar) {
  // TODO: salin dari Lab 1 (map + spread, tambah nilaiAkhir, grade, lulus)
  return daftar.map((m) => {
    const nilaiAkhir = Number(
      hitungNilaiAkhir(m.tugas, m.uts, m.uas).toFixed(1)
    );

    const grade = tentukanGrade(nilaiAkhir);

    return {
      ...m,
      nilaiAkhir,
      grade,
      lulus: grade !== 'D' && grade !== 'E'
    };
  });
}

function hitungRataRata(rekap) {
  // TODO: salin dari Lab 1
  if (rekap.length === 0) return 0;

  const total = rekap.reduce(
    (jumlah, m) => jumlah + m.nilaiAkhir,
    0
  );

  return Number((total / rekap.length).toFixed(1));
}

function cariTertinggi(rekap) {
  // TODO: salin dari Lab 1. Tambahkan: jika rekap kosong -> return null
  if (rekap.length === 0) return null;

  return rekap.reduce((tertinggi, m) => {
    return m.nilaiAkhir > tertinggi.nilaiAkhir
      ? m
      : tertinggi;
  });
}

function hitungDistribusiGrade(rekap) {
  // TODO: salin dari Lab 1
  const distribusi = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0
  };

  for (const m of rekap) {
    distribusi[m.grade]++;
  }

  return distribusi;
}

function cariMahasiswa(rekap, kataKunci) {
  // TODO: salin dari Lab 1
  const kata = kataKunci.trim().toLowerCase();

  return rekap.filter((m) => {
    return (
      m.nama.toLowerCase().includes(kata) ||
      m.nim.includes(kata)
    );
  });
}

// ---- Sudah jadi: validasi input mahasiswa baru (dipakai sebelum memanggil api.js) ----
// Mengembalikan array pesan error; array kosong = valid.
function validasiMahasiswa(input) {
  const errors = [];
  if (typeof input.nim !== 'string' || !/^\d{7}$/.test(input.nim)) {
    errors.push('NIM harus 7 digit angka');
  }
  if (typeof input.nama !== 'string' || input.nama.trim().length < 3) {
    errors.push('Nama minimal 3 karakter');
  }
  for (const kolom of ['tugas', 'uts', 'uas']) {
    const n = input[kolom];
    if (typeof n !== 'number' || !Number.isFinite(n) || n < 0 || n > 100) {
      errors.push(`Nilai ${kolom} harus angka 0-100`);
    }
  }
  return errors;
}
