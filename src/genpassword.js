import bcrypt from "bcryptjs";

console.log(`BCRYPT 'userpass': ${bcrypt.hashSync("userpass", 10)}`);
console.log(`BCRYPT 'adminpass': ${bcrypt.hashSync("adminpass", 10)}`);
