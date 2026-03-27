const express = require('express'); // 
const router = express.Router();
const authorController = require('../controllers/authors-controllers');
const {validateAuthor, validateAuthorPartial} = require('../schemas/authors')
const validate = require('../middlewares/validate'); // El archivo que me acabas de mostrar
router.get('/', authorController.findAll);
router.get('/test-error', authorController.error);
router.get('/search',authorController.search)
router.get('/:id', authorController.getOne);
router.post('/',validate(validateAuthor), authorController.create);
router.patch('/:id', validate(validateAuthorPartial),authorController.update);
router.delete('/:id', authorController.delete);
module.exports = router;