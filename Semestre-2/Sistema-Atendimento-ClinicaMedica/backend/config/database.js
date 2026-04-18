const mongoose = require('mongoose');

const conectarDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('MongoDB conectado com sucesso!');
    return conn;
  } catch (erro) {
    console.error('Erro ao conectar MongoDB:', erro.message);
    process.exit(1);
  }
};

module.exports = conectarDB;
