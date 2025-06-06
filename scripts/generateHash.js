const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'password123'; // Change this to your desired password
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  console.log('Password Hash:', hash);
}

generateHash(); 