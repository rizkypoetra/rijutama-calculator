// Untuk Navbar dark-mode
document
  .getElementById("dark-mode-toggle")
  .addEventListener("click", function () {
    var element = document.body;
    element.classList.toggle("dark-mode");

    // Ganti ikon berdasarkan mode (dark/light)
    var icon = this.querySelector("i");
    if (element.classList.contains("dark-mode")) {
      icon.classList.remove("fas", "fa-moon");
      icon.classList.add("fas", "fa-sun");
    } else {
      icon.classList.remove("fas", "fa-sun");
      icon.classList.add("fas", "fa-moon");
    }
  });

// Ikon scroll to top
window.addEventListener("scroll", () => {
  const scrollToTop = document.getElementById("scroll-to-top");
  if (window.scrollY > 200) {
    scrollToTop.style.opacity = 1;
    scrollToTop.style.pointerEvents = "auto";
  } else {
    scrollToTop.style.opacity = 0;
    scrollToTop.style.pointerEvents = "none";
  }
});

// Fungsi untuk menggulir kembali ke bagian atas halaman
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Sembunyikan ikon setelah di klik
  const scrollToTop = document.getElementById("scroll-to-top");
  scrollToTop.style.opacity = 0;
  scrollToTop.style.pointerEvents = "none";
}

// METODE BAGI DUA
// Fungsi untuk menghitung nilai persamaan
function calculateEquation(x, equation) {
  const parsedEquation = equation.replace(/x/g, `(${x})`).replace(/\^/g, "**"); // Ganti '^' dengan '**' untuk eksponensiasi

  return Function('"use strict";return (' + parsedEquation + ")")();
}

// Fungsi untuk memperbarui tabel hasil
function updateResultTable(iteration, a, b, c, fa, fb, fc, absoluteError) {
  var resultBody = document.getElementById("result-body");

  var row = resultBody.insertRow();
  row.insertCell(0).innerHTML = iteration;
  row.insertCell(1).innerHTML = a.toFixed(5);
  row.insertCell(2).innerHTML = b.toFixed(5);
  row.insertCell(3).innerHTML = c.toFixed(5);
  row.insertCell(4).innerHTML = fa.toFixed(5);
  row.insertCell(5).innerHTML = fb.toFixed(5);
  row.insertCell(6).innerHTML = fc.toFixed(5);
  row.insertCell(7).innerHTML = absoluteError.toFixed(5);
}

// Fungsi untuk melakukan perhitungan
function calculate() {
  // Ambil nilai dari formulir
  var initialGuessA = parseFloat(
    document.getElementById("initialGuessA").value
  );
  var initialGuessB = parseFloat(
    document.getElementById("initialGuessB").value
  );
  var errorCondition = parseFloat(
    document.getElementById("errorCondition").value
  );

  // Ambil persamaan dari formulir
  var equation = document.getElementById("equation").value;

  // Validasi kolom formulir
  var errorMessage = document.getElementById("error-message");
  errorMessage.innerHTML = "";

  if (isNaN(initialGuessA) || isNaN(initialGuessB) || isNaN(errorCondition)) {
    errorMessage.innerHTML = "Harap isi semua kolom dengan benar.";
    return;
  }

  if (!isValidEquation(equation)) {
    errorMessage.innerHTML = "Persamaan tidak valid.";
    return;
  }

  // Format koma pada kondisi berhenti
  if (document.getElementById("errorCondition").value.includes(",")) {
    errorMessage.innerHTML =
      "Gunakan tanda titik sebagai pemisah desimal untuk kondisi berhenti.";
    return;
  }

  // Inisialisasi nilai
  var a = initialGuessA;
  var b = initialGuessB;
  var iteration = 1;
  var c, fa, fb, fc, absoluteError;

  // Hapus hasil sebelumnya jika ada
  document.getElementById("result-body").innerHTML = "";

  do {
    // Hitung nilai tengah
    c = (a + b) / 2;

    // Hitung nilai fungsi pada titik a, b, dan c
    fa = calculateEquation(a, equation);
    fb = calculateEquation(b, equation);
    fc = calculateEquation(c, equation);

    // Hitung nilai |b-a|
    absoluteError = Math.abs(b - a);

    // Tambahkan hasil iterasi ke dalam tabel
    updateResultTable(iteration, a, b, c, fa, fb, fc, absoluteError);

    // Perbarui nilai a atau b sesuai dengan kondisi
    if (fc * fb < 0) {
      a = c;
    } else {
      b = c;
    }

    // Perbarui iterasi
    iteration++;
  } while (absoluteError > errorCondition);

  // Ambil informasi dari iterasi terakhir
  var lastIteration = iteration - 1;
  var lastAbsoluteError = absoluteError.toFixed(5);
  var lastRoot = c.toFixed(5);

  // Tambahkan informasi di bawah tabel
var infoDiv = document.getElementById("calculation-info");
infoDiv.innerHTML = `
  <p>Kondisi berhenti yang digunakan: <span style="color: blue;">${errorCondition}</span></p>
  <p>Tebakan awal (a): <span style="color: blue;">${initialGuessA}</span></p>
  <p>Tebakan awal (b): <span style="color: blue;">${initialGuessB}</span></p>
  <p>Akar (hasil yang diperoleh): <span style="color: blue;">${lastRoot}</span></p>
  <p>Jumlah iterasi: <span style="color: blue;">${lastIteration}</span></p>
  <p>Nilai kondisi berhenti: <span style="color: blue;">${lastAbsoluteError}</span></p>
`;

}

// Fungsi untuk mereset form dan tabel hasil
function reset() {
  // Reset formulir
  document.getElementById("equation").value = "5*(x^3)-2*(x^2)+8*x-4";
  document.getElementById("initialGuessA").value = "-1";
  document.getElementById("initialGuessB").value = "1";
  document.getElementById("errorCondition").value = "0.001";

  // Hapus hasil iterasi sebelumnya
  document.getElementById("result-body").innerHTML = "";
  // Hapus informasi di bawah tabel
  document.getElementById("calculation-info").innerHTML = "";
  // Hapus pesan kesalahan
  document.getElementById("error-message").innerHTML = "";
}

// Fungsi untuk memvalidasi persamaan
function isValidEquation(equation) {
  // Anda dapat menambahkan logika validasi persamaan disini
  // Contoh sederhana: Pastikan persamaan mengandung karakter 'x' dan tidak mengandung karakter yang tidak valid
  return equation.includes("x") && /^[0-9\+\-\*\/\(\)\^x]+$/.test(equation);
}
