const mongoose = require("mongoose");
const Quiz = mongoose.model("soal_jawab", {
  id_mapel: {
    type: String,
    required: true,
  },
  nama_mapel: {
    type: String,
    required: true,
  },
  q_a: [
    {
      id_soal: {
        type: String,
        required: true,
      },
      q: {
        type: String,
        required: true,
      },
      a: [
        {
          text: {
            type: String,
            required: true,
          },
          isCorrect: {
            type: Boolean,
            required: true,
          },
        },
      ],
    },
  ],
});


// const contact1 = new Quiz(
// {
//   id_mapel:"2",
//   nama_mapel:"HTML&CSS",
//   q_a:[{
//     id_soal:"1",
//     q: "HTML merupkan singkatan dari...",
//     a: [{ text: "Hyper Link Markup Leaguage", isCorrect: false },
//         { text: "Hyper Team Markup Laguage", isCorrect: false },
//         { text: "Hyper Tool Markup Laguage", isCorrect: false },
//         { text: "Hyper Test Markup Laguage", isCorrect: false },
//         { text: "Hyper Text Markup Laguage", isCorrect: true }
//     ]
//   },{
//     id_soal:"2",
//     q:" Berikut ini yang menjadi standarisasi Web adalah...",
//     a: [{ text: "ECMAN (eropean Computer Manufacturers Association)", isCorrect: false },
//         { text: "Google", isCorrect: false },
//         { text: "W3C (Word Wide Web Consortium)", isCorrect: true },
//         { text: "Linux", isCorrect: false },
//         { text: "Https", isCorrect: false }]
//   },{
//     id_soal:"3",
//     q:"Berikut ini perintah untuk mengganti baris pada HTML adalah...",
//     a: [{ text: "br", isCorrect: true },
//         { text: "tr", isCorrect: false },
//         { text: "td", isCorrect: false },
//         { text: "p", isCorrect: false },
//         { text: "insert", isCorrect: false }]
//   },{
//     id_soal:"4",
//     q:"Berikut ini yang bukan termasuk tag untuk membuat heading adalah... ",
//     a: [{ text: "<h4>>", isCorrect: false },
//         { text: "<h5>", isCorrect: false },
//         { text: "<h6>", isCorrect: false },
//         { text: "<h7>", isCorrect: true },
//         { text: "Semua Benar", isCorrect: false }]
//   },{
//     id_soal:"5",
//     q:"Perintah apakah yang berfungsi untuk menggabungkan beberapa kolom menjadi satu....",
//     a: [{ text: "BR", isCorrect: false },
//         { text: "Textarea", isCorrect: false },
//         { text: "Colspan", isCorrect: true },
//         { text: "Checkbox", isCorrect: false },
//         { text: "Tidak ada jawaban yang benar", isCorrect: false }]
//   },{
//     id_soal:"6",
//     q:"Sintak yang benar untuk menambahkan warna background atau latar belakang dibawah ini adalah...",
//     a: [{ text: "<body style=’background-color:green’>", isCorrect: true },
//         { text: "<body style=’background-green’>", isCorrect: false },
//         { text: "<body style=’background-:color:green’>", isCorrect: false },
//         { text: "<background>green</background>", isCorrect: false },
//         { text: "<latarbelakang>hijau<green>", isCorrect: false }]
//   },{
//     id_soal:"7",
//     q:"Dalam atribut style properti yang digunakan untuk menentukan jenis huruf yaitu...",
//     a: [{ text: "font-size", isCorrect: false },
//         { text: "font-color", isCorrect: false },
//         { text: "text-font", isCorrect: false },
//         { text: "font-family", isCorrect: true },
//         { text: "background-color", isCorrect: false }]
//   },{
//     id_soal:"8",
//     q:"Berikut ini atribut yang digunakan untuk mengatur panjang dan lebar suatu elemen adalah...",
//     a: [{ text: "width dan value", isCorrect: false },
//         { text: "pixel dan cm", isCorrect: false },
//         { text: "width dan height", isCorrect: true },
//         { text: "value and height", isCorrect: false },
//         { text: "body dan value", isCorrect: false }]
//   },{
//     id_soal:"9",
//     q:"Dalam tag <from> dalam HTML, tedapat dua jenis method yaitu...",
//     a: [{ text: "GET & POST", isCorrect: true },
//         { text: "HTTPS & POST", isCorrect: false },
//         { text: "HTTP & HTTPS", isCorrect: false },
//         { text: "POST & SELF", isCorrect: false },
//         { text: "HTTP & SELF", isCorrect: false }]
//   },{
//     id_soal:"10",
//     q:"Untuk membuat komentar di HTML adalah",
//     a: [{ text: "Dimulai dengan <!&diakhiri dengan?", isCorrect: false },
//         { text: "Dimulai dengan <!– diakhiri dengan –>", isCorrect: true },
//         { text: "Dimulai dengan //diakhiri dengan //", isCorrect: false },
//         { text: "Dimulai dengan // diakhiri dengan *//", isCorrect: false },
//         { text: "Tidak ada jawaban yang benar", isCorrect: false }]
//   }
//   ]
// });

// //simpan ke collection
// contact1.save().then((result) => {
// console.log(result);
// });

// const user1=new User ({
//   username:"reyhan",
//   password:"123"
// })

// user1.save().then((result) => {
// console.log(result);
// });

module.exports = Quiz;