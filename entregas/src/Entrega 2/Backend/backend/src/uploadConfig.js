import multer from 'multer';
import path from 'path';
import fs from 'fs';

console.log('🟡 [uploadConfig] Iniciando configuração do Multer...');

const uploadDir = 'uploads';

// Verifica se a pasta existe
if (!fs.existsSync(uploadDir)) {
  console.log('📁 [uploadConfig] Pasta "uploads" não existe. Criando...');
  fs.mkdirSync(uploadDir);
} else {
  console.log('📁 [uploadConfig] Pasta "uploads" já existe.');
}

// Define o armazenamento
console.log('⚙️ [uploadConfig] Configurando armazenamento...');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(`📦 [uploadConfig] Salvando arquivo em: ${uploadDir}`);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.floor(Math.random() * 1e9)}${ext}`;
    console.log(`🖼️ [uploadConfig] Nome gerado para o arquivo: ${name}`);
    cb(null, name);
  },
});

// Filtro de tipos de arquivo
const fileFilter = (req, file, cb) => {
  console.log(`🔍 [uploadConfig] Verificando tipo do arquivo: ${file.mimetype}`);
  const allowed = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowed.includes(file.mimetype)) {
    console.log('✅ [uploadConfig] Tipo de arquivo permitido.');
    cb(null, true);
  } else {
    console.warn('🚫 [uploadConfig] Tipo de arquivo inválido!');
    cb(new Error('Arquivo inválido'));
  }
};

// Instância do multer
console.log('🚀 [uploadConfig] Criando instância do Multer...');
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

console.log('✅ [uploadConfig] Multer configurado com sucesso!');

export default upload;
