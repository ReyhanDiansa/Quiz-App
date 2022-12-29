const mongoose = require("mongoose");

const Nilai = mongoose.model("Nilai", {
  id_user: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  id_mapel:{
    type: String,
    required: true,
  },
  nama_mapel: {
    type: String,
    required: true,
  },
  nilai: {
    type: String,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    required: true,
  },
});

// const nilai1=new Nilai ({
//   id_user:"63a99184e3ade434a5a75727",
//   username:"reyhan",
//   id_mapel:"63a43fd2b24df2f18944a72f",
//   nama_mapel:"basis data",
//   nilai:"90",
//   isCompleted:true
// })

// nilai1.save().then((result) => {
// console.log(result);
// });

module.exports = Nilai;
