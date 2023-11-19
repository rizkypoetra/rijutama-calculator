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

// METODE NEWTON RAPHSON
// Fungsi untuk menghitung nilai persamaan
function calculateEquation(x, equation) {
  const parsedEquation = equation.replace(/x/g, `(${x})`).replace(/\^/g, "**"); // Ganti '^' dengan '**' untuk eksponensiasi

  return Function('"use strict";return (' + parsedEquation + ")")();
}

// Fungsi untuk menghitung turunan persamaan
function calculateDerivative(x, equation1) {
  const parsedEquation1 = equation1
    .replace(/x/g, `(${x})`)
    .replace(/\^/g, "**"); // Ganti '^' dengan '**' untuk eksponensiasi

  return Function('"use strict";return (' + parsedEquation1 + ")")();
}

// Fungsi untuk memperbarui tabel hasil
function updateResultTable(iteration, xr, fxr, fPrimeXr, absoluteError) {
  var resultBody = document.getElementById("result-body");

  var row = resultBody.insertRow();
  row.insertCell(0).innerHTML = iteration -1;
  row.insertCell(1).innerHTML = xr.toFixed(5);
  row.insertCell(2).innerHTML = fxr.toFixed(5);
  row.insertCell(3).innerHTML = fPrimeXr.toFixed(5);

  if (iteration > 1) {
    var prevAbsoluteError = Math.abs(
      resultBody.rows[iteration - 2].cells[1].innerHTML - xr
    );
    row.insertCell(4).innerHTML = prevAbsoluteError.toFixed(5);
  } else {
    row.insertCell(4).innerHTML = ""; // Kosongkan kolom pada iterasi pertama
  }
}

// Fungsi untuk melakukan perhitungan
function calculate() {
  // Ambil nilai dari formulir
  var initialGuessXr = parseFloat(
    document.getElementById("initialGuessA").value
  );
  var errorCondition = parseFloat(
    document.getElementById("errorCondition").value
  );

  // Ambil persamaan dan turunan persamaan dari formulir
  var equation = document.getElementById("equation").value;
  var equation1 = document.getElementById("equation1").value;

  // Validasi kolom formulir
  var errorMessage = document.getElementById("error-message");
  errorMessage.innerHTML = "";

  if (isNaN(initialGuessXr) || isNaN(errorCondition)) {
    errorMessage.innerHTML = "Harap isi semua kolom dengan benar.";
    return;
  }

  if (!isValidEquation(equation)) {
    errorMessage.innerHTML = "Persamaan tidak valid.";
    return;
  }

  if (!isValidEquation(equation1)) {
    errorMessage.innerHTML = "Turunan persamaan tidak valid.";
    return;
  }

  // Format koma pada kondisi berhenti
  if (document.getElementById("errorCondition").value.includes(",")) {
    errorMessage.innerHTML =
      "Gunakan tanda titik sebagai pemisah desimal untuk kondisi berhenti.";
    return;
  }

  // Inisialisasi nilai
  var xr = initialGuessXr;
  var iteration = 1;
  var fxr, fPrimeXr, xr1, absoluteError;

  // Hapus hasil sebelumnya jika ada
  document.getElementById("result-body").innerHTML = "";

  do {
    // Hitung nilai fungsi pada titik xr dan turunan fungsi pada titik xr
    fxr = calculateEquation(xr, equation);
    fPrimeXr = calculateDerivative(xr, equation1);

    // Hitung nilai xr+1
    xr1 = xr - fxr / fPrimeXr;

    // Hitung nilai |Xr+1 - Xr|
    absoluteError = Math.abs(xr1 - xr);

    // Tambahkan hasil iterasi ke dalam tabel
    updateResultTable(iteration, xr, fxr, fPrimeXr, absoluteError);

    // Perbarui nilai xr
    xr = xr1;

    // Perbarui iterasi
    iteration++;
  } while (absoluteError > errorCondition);

  // Ambil informasi dari iterasi terakhir
  var lastIteration = iteration - 1;
  var lastAbsoluteError = absoluteError.toFixed(5);
  var lastRoot = xr.toFixed(5);

  // Tambahkan informasi di bawah tabel
  var infoDiv = document.getElementById("calculation-info");
  infoDiv.innerHTML = `
  <p>Kondisi berhenti yang digunakan: <span style="color: blue;">${errorCondition}</span></p>
  <p>Tebakan awal (Xr): <span style="color: blue;">${initialGuessXr}</span></p>
  <p>Akar (Hasil yang diperoleh): <span style="color: blue;">${lastRoot}</span></p>
  <p>Jumlah iterasi: <span style="color: blue;">${lastIteration}</span></p>
  <p>Nilai kondisi berhenti: <span style="color: blue;">${lastAbsoluteError}</span></p>
  `;

  // Tambahkan satu iterasi lagi setelah iterasi berhenti
  fxr = calculateEquation(xr, equation);
  fPrimeXr = calculateDerivative(xr, equation1);
  xr1 = xr - fxr / fPrimeXr;
  absoluteError = Math.abs(xr1 - xr);
  updateResultTable(iteration, xr, fxr, fPrimeXr, absoluteError);
}

// Fungsi untuk mereset form dan tabel hasil
function reset() {
  // Reset formulir
  document.getElementById("equation").value = "5*(x^3)-2*(x^2)+8*x-4";
  document.getElementById("equation1").value = "15*(x^2)-4*x+8";
  document.getElementById("initialGuessA").value = "4";
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
