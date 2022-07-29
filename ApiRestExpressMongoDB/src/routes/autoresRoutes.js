import express from 'express';
import AutorController from '../controllers/autoresController.js';
import AutoresController from '../controllers/autoresController.js';

const router = express.Router();

router
    .get('/autores', AutoresController.listarAutores)
    .get('/autores/:id', AutoresController.listarAutorPorId)
    .post('/autores', AutoresController.cadastrarAutor)
    .put('/autores/:id', AutoresController.atualizarAutor)
    .delete('/autores/:id', AutorController.excluirAutores)

export default router;