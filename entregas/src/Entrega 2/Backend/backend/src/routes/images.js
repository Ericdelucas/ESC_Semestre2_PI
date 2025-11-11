import express from 'express'
import db from '../db.js'
import upload from '../uploadConfig.js'
import fs from 'fs'

const r = express.Router()

//POST - http://localhost:3000/LideEMP/images
//Body - form-data - key: image (File)
//Inserir Imagem
r.post('/images', upload.single('image'), async (req, res) => {
    console.log('🟢 [POST /images] Requisição recebida.');
  
    try {
      // Verifica se o arquivo chegou
      if (!req.file) {
        console.warn('⚠️ [POST /images] Nenhum arquivo enviado!');
        return res.status(400).json({ error: 'Nenhum arquivo enviado!' });
      }
  
      const filepath = req.file.path;
      console.log(`📂 [POST /images] Arquivo recebido: ${req.file.originalname}`);
      console.log(`🧭 [POST /images] Caminho salvo: ${filepath}`);
      console.log(`📏 [POST /images] Tamanho: ${req.file.size} bytes`);
      console.log(`📸 [POST /images] Tipo: ${req.file.mimetype}`);
  
      // Insere no banco
      console.log('🗄️ [POST /images] Inserindo no banco de dados...');
      await db.execute('INSERT INTO images (img) VALUES (?)', [filepath]);
  
      console.log('✅ [POST /images] Imagem inserida com sucesso no banco!');
  
      res.status(201).json({
        message: 'Imagem enviada com sucesso!',
        img: filepath,
      });
    } catch (error) {
      console.error('❌ [POST /images] Erro ao processar upload:', error.message);
      res.status(500).json({ error: error.message });
    }
  });
  
//GET - http://localhost:3000/api/images
//Retornar a lista com o ID e o caminho da imagem
//Listar Imagem
r.get('/images', async(req, res)=>{
    try{
        const [rows] = await db.execute("SELECT * FROM images")
        res.status(200).json(rows)
    } catch (error){
        res.status(500).json({error: error.message})
    }
})
//PUT - http://localhost:3000/api/images/1
//Body - form-data - key: image (File)
//Atualizar Imagem
r.put('/images/:id', upload.single('image'), async(req, res)=>{
    try{
        const{id} = req.params
        const newPath = req.file.path
        const [old] = await db.execute("SELECT * FROM images WHERE id =?", [id])
        if (old.length === 0) return res.status(404).json({error:"Imagem não encontrada!"})
        const oldPath = old[0].img
        await db.execute("UPDATE images SET img = ? WHERE id =?", [newPath, id])
        fs.unlink(oldPath, (err) =>{
            if(err) console.warn("Erro ao Remover:", err)
        })
        res.json({message: "Imagem Atualizada com sucesso!", img:newPath})
    } catch (error){
        res.status(500).json({error: error.message})
    }
})
//DELETE - http://localhost:3000/api/images/1
//Remove a imagem com o Id selecionado e do disco
//Deletar Imagem
r.delete('/images/:id', async(req, res)=>{
    try{
        const {id} = req.params
        const [rows] = await db.execute("SELECT * FROM images WHERE id = ?", [id])
        if (rows.length === 0) return res.status(404).json({error:"Imagem não encontrada!"})
        const filePath = rows[0].img
        await db.execute("DELETE FROM images WHERE id =?", [id])
        fs.unlink(filePath, (err) =>{
            if(err) console.warn("Erro ao Remover:", err)
        })
        res.json({message: "Imagem excluída com sucesso!"})
    } catch (error){
        res.status(500).json({error: error.message})
    }
})

export default r