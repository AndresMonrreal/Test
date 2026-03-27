const express = require('express');
const router = express.Router();
const bookController = require('../controllers/books-controllers');
const {validateBook, validatePartialBook} = require('../schemas/book')
const validate = require('../middlewares/validate'); // El archivo que me acabas de mostrar
router.get('/', bookController.findAll);
router.get('/search',bookController.search)
router.get('/:id', bookController.getOne);
router.post('/',validate(validateBook), bookController.create);
router.patch('/:id', validate(validatePartialBook),bookController.update);
router.delete('/:id', bookController.delete);

module.exports = router;