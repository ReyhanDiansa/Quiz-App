const mongoose = require("mongoose");

const User = mongoose.model("User", {
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// const user1=new User ({
//   username:"reyhan",
//   password:"123"
// })

// user1.save().then((result) => {
// console.log(result);
// });

module.exports=User;