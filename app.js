//require express, ejs layout , dan cors
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const cors = require("cors");

//konfigurasi express
const app = express();
const port = 3000;

//konfigurasi cors
app.use(cors());

//require & konfigurasi express-session
const session = require("express-session");
app.use(
  session({
    secret: "QAS-mongo-node",
    resave: false,
    saveUninitialized: true,
  })
);

//set folder assets menjadi static
app.use(express.static("assets"));


//require & konfigurasi flash massage/pesan singkat
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

//konfigurasi ejs template engine
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

//require & konfigurasi mongodb
require("./utils/db");
const Quiz = require("./model/quiz");
const User = require("./model/user");
const Nilai = require("./model/nilai");

//variabel global skor dengan nilai default 0
app.locals.skor = 0;

//main route
app.get("/", async (req, res) => {
  //apabila user belum login maka akan di redirect ke halaman login, apabila sudah login akan menuju ke home
  if (!req.session.loggedIn) {
    res.redirect("/login");
  } else if (req.session.loggedIn && req.session.user) {
    //mendapatkan username yang login dari session
    const username = req.session.user.username;

    //mendapatkan semua isi dari collection Quiz/soal_jawabs
    const quiz = await Quiz.find();

    //set variabel skor menjadi 0 lagi saat user sudah mengerjakan
    app.locals.skor = 0;

    res.render("index", {
      layout: "layouts/main-layout",
      quiz,
      username,
      msg: req.flash("msg"),
    });
  }
});

//signup route
app.get("/signup", async (req, res) => {
  //if condition apabila user belum logout dia tidak bisa pergi ke page signup
  if (req.session.loggedIn) {
    res.redirect("/");
  } else {
    res.render("signup", {
      layout: false,
      msg: req.flash("msg"),
    });
  }
});

//login route
app.get("/login", async (req, res) => {
  //if condition apabila user belum logout dia tidak bisa pergi ke page login
  if (req.session.loggedIn) {
    res.redirect("/");
  } else {
    res.render("login", {
      layout: false,
      msg: req.flash("msg"),
    });
  }
});

//route ketika user submit form login
app.post("/signup", (req, res) => {
  //mendaptkan username dan password yang diinputkan user dari form
  const username = req.body.username;
  const password = req.body.password;

  //variabel untuk dimasukkan ke database
  User.findOne({ username: username }, (err, user) => {
    // jika username sudah ada tampilkan pesan, jika tidak ada insert ke database
    if (user) {
      req.flash("msg", "username sudah ada, cari yang lain");
      res.redirect("/signup");
    } else {
      //variabel untuk dimasukkan ke database
      const user = new User({
        username: username,
        password: password,
      });

      //save variabel user ke database
      user.save((err, result) => {
        //jika ada error tampilkan pesan, jika berhasil insert redirect ke login page
        if (err) {
          req.flash("msg", "gagal signup");
          res.redirect("/signup");
        } else {
          res.redirect("/login");
        }
      });
    }
  });
});

//route ketika user submit form login
app.post("/login", (req, res) => {
  //mendaptkan username dan password yang diinputkan user dari form
  const username = req.body.username;
  const password = req.body.password;

  // Query ke database untuk menemukan username dan password yang telah diinputkan user
  User.findOne({ username: username }, (err, user) => {
    //jika ada error saat melakukan query ke database
    if (err) {
      //tampilkan alert Tidak bisa terhubung ke database di halaman login
      req.flash("msg", "Tidak bisa terhubung ke database");
      res.redirect("/login");
    } else if (!user) {
      //jika username tidak ditemukan
      //tampilkan alert username atau password salah di halaman login
      req.flash("msg", "Username atau password salah");
      res.redirect("/login");
    } else {
      //jika username ditemukan maka check password, apabila password benar maka diredirect ke halaman uatama/home, jika salah kirimkan pesan error
      if (password === user.password) {
        req.session.loggedIn = true;
        req.session.user = user;
        res.redirect("/");
      } else {
        //tampilkan alert username atau password salah di halaman login
        req.flash("msg", "Username atau password salah");
        res.redirect("/login");
      }
    }
  });
});

//route page mata pelajaran
app.get("/mapel", async (req, res) => {
  //mendapatkan id_user yang sedang login
  let id_user = "";
  if (req.session.user) {
    id_user = req.session.user._id;
  }

  //query mencari data user yang saat ini sedang login di collection nilais/Nilai dengan cara mencocokan id_mapel di collection nilais/Nilai dengan _id di collection soal_jawabs/Quiz. Apabila ada maka user sudah mengerjakan mapel itu, ini berguna untuk button validation
  const nilai = await Nilai.find({
    $and: [
      { id_mapel: { $in: await Quiz.find().distinct("_id") } },
      { id_user: id_user },
    ],
  }).populate("_id");

  //mendapatkan semua document di collection Quiz/soal_jawabs
  const quiz = await Quiz.find();

  //set variabel skor menjadi 0/default
  app.locals.skor = 0;

  res.render("mapel2", {
    layout: "layouts/main-layout",
    id_user,
    nilai,
    quiz,
  });
});

//route halaman rules kuis
app.get("/rule", (req, res) => {
  res.render("rule", {
    layout: "layouts/main-layout",
  });
});

//route ketika user klik jenis mata pelajaran, saat user klik start otomatis akan dibuatkan dat di collection nilai dengan nilai default 0, apabila user sudah selesai menjawab nilai tersebut akan diupdate
app.post("/quiz/start", async (req, res) => {
  //mendaptkan username & id_user yang saat ini sedang login
  let username = "";
  let id_user = "";
  if (req.session.user) {
    username = req.session.user.username;
    id_user = req.session.user._id;
  }

  //set variabel id_soal dengan nilai 0, yang artinya soal akan muncul dari soal dengan indeks 0
  let id_soal = "0";

  //mendapatkan id_mapel dari input hidden dari file index
  let id_mapel = req.body.id_mapel;

  //filter untuk menampilkan soal berdasarkan variabel id_mapel
  const filter = {
    id_mapel: id_mapel,
  };

  //menampilkan soal sesuai filter diatas
  const quiz = await Quiz.findOne(filter);

  //mendapatkan _id dari variabel quiz diatas digunakan di input hidden
  const _id = quiz._id.toHexString();

  //hitung jumlah soal berdasarkan id_mapel, yang dihitung adalah panjang/length dari array q_a
  let row = await Quiz.aggregate([
    { $match: { id_mapel: id_mapel } },
    { $project: { q_a_length: { $size: "$q_a" } } },
  ]);

  //cek, apabila jawaban bernilai true maka nilai variabel global ditambah 1, nilai diambil dari input value yang berisi value dari key isCorrect dari database
  if (req.body.answer === "true") {
    req.app.locals.skor++;
  }

  //query mendaptkan nama mapel yang akan dikirim ke database nilai berdasarkan _id dari input hidden
  const nama2 = await Quiz.findOne({ _id: _id });

  //variabel untuk disave di database
  let nilai = new Nilai({
    id_user: id_user,
    username: username,
    id_mapel: _id,
    nama_mapel: nama2.nama_mapel,
    nilai: app.locals.skor * 10,
    isCompleted: true,
  });

  //save ke database lalu render
  nilai.save().then((result) => {
    res.render("quiz", {
      layout: "layouts/main-layout",
      quiz,
      id_mapel,
      id_soal,
      row,
      _id,
      username,
      id_user,
    });
  });
});
// });

//route ketika user klik next
app.post("/quiz/next", async (req, res) => {
  //mendaptkan username & id_user yang saat ini sedang login
  let username = "";
  let id_user = "";
  if (req.session.user) {
    username = req.session.user.username;
    id_user = req.session.user._id;
  }

  //mendapatkan id_mapel dan id_soal dari input hidden dari file quiz/route /quiz/start
  let id_mapel = req.body.id_mapel;
  let id_soal = req.body.id_soal;

  // id+1 ketika user klik next
  id_soal++;

  //filter untuk menampilkan soal berdasarkan variabel id_mapel
  const filter = {
    id_mapel: id_mapel,
  };

  //menampilkan soal sesuai filter diatas
  const quiz = await Quiz.findOne(filter);

  //mendapatkan _id dari variabel quiz diatas digunakan di input hidden
  const _id = quiz._id.toHexString();

  //hitung jumlah soal berdasarkan id_mapel, yang dihitung adalah panjang/length dari array q_a
  let row = await Quiz.aggregate([
    { $match: { id_mapel: id_mapel } },
    { $project: { q_a_length: { $size: "$q_a" } } },
  ]);

  //cek, apabila jawaban bernilai true maka nilai variabel global ditambah 1, nilai diambil dari input value yang berisi value dari key isCorrect dari database
  if (req.body.answer === "true") {
    req.app.locals.skor++;
  }

  //apabila id_soal+1 (karena id soal dimulai dari 0 / sesuai indeks array) lebih besar dari jumlah soal yang artinya semua soal sudah ditampilkan maka akan di redirect ke /quiz/end jika belum maka akan lanjut ke soal selanjutnya
  if (id_soal + 1 > row[0].q_a_length) {
    res.redirect(307, "/quiz/end");
  } else {
    res.render("quiz", {
      layout: "layouts/main-layout",
      quiz,
      id_soal,
      id_mapel,
      row,
      _id,
      username,
      id_user,
    });
  }
});

//route   ketika user selesai menjawab semua soal
app.post("/quiz/end", async (req, res) => {
  //mendapatkan id_mapel dari input hidden
  const id_mapel = req.body.id_mapel;
  const _id = req.body._id;
  const id_user = req.body.id_user;

  //update nilai 
  Nilai.updateOne(
    { id_mapel: _id, id_user: id_user },
    { $set: { nilai: app.locals.skor * 10 } },
    function (error) {
      if (error) {
        console.log(error);
      } else {
        res.render("end", {
          layout: "layouts/main-layout",
          id_mapel,
        });
      }
    }
  );
});

//route menampilkan skor
app.post("/skor", async (req, res) => {
  //menyimpan nilai variabel global skor ke variabel nilai
  let nilai = req.app.locals.skor;

  //mendapatkan id_mapel dari input hidden
  let id_mapel = req.body.id_mapel;

  //filter untuk menampilkan soal berdasarkan variabel id_mapel
  const filter = {
    id_mapel: id_mapel,
  };

  //menampilkan soal sesuai filter diatas
  const quiz = await Quiz.findOne(filter);

  res.render("skor", {
    layout: "layouts/main-layout",
    nilai,
    quiz,
  });
});

app.get("/history", async (req, res) => {
  //mendapatkan id_user yang sedang login
  let id_user = "";
  if (req.session.user) {
    id_user = req.session.user._id;
  }

  // variabel filter
  const filter = {
    id_user: id_user,
  };

  //mendaptkan document yang sesuai dengan filter diatas
  const nilai = await Nilai.find(filter);

  res.render("history", {
    layout: "layouts/main-layout",
    nilai,
  });
});

//route ketika user logout
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    //jika logout gagal/terjadi error tampilkan pesan/alert, jika berhasil diredirect ke login page
    if (err) {
      req.flash("msg", "Tidak bisa logout");
      res.redirect("/");
    } else {
      res.redirect("/login");
    }
  });
});

app.listen(port, () => {
  console.log(`QUIZ App | listening at http://localhost:${port}`);
});
