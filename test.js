const bcrypt = require('bcrypt');
const password = "123"; // you will probably this from req.params
const hashed_password = bcrypt.hashSync(password, 10);


console.log(hashed_password);