const bcrypt = require('bcrypt');

async function comparePassword(plainPassword, hashedPassword) {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  console.log('Password match:', isMatch);
}

comparePassword('password123', '$2b$10$IV.sKBN6ggwjy/kEryHEKezyKfsRRCfUi3oH.Sc0c8upUxSZbdQ0.');