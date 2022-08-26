const { Router } = require('express');
const PessoasController = require('../controllers/PessoaController');

const router = Router();

router.get('/pessoas/', PessoasController.pegaTodaAsPessoas);
router.get('/pessoas/:id', PessoasController.pegaUmaPessoa);
router.post('/pessoas/', PessoasController.criaPessoa);
router.put('/pessoas/:id', PessoasController.atualizaPessoa);
router.delete('/pessoas/:id', PessoasController.apagaPessoa);

module.exports = router;
