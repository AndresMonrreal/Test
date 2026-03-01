const express = require('express');
const router = express.Router();
const bookController = require('../controllers/books-controllers');

router.get('/', bookController.findAll);
router.get('/:id', bookController.getOne);
router.post('/', bookController.create);
router.patch('/:id', bookController.update);
router.delete('/:id', bookController.delete);

module.exports = router;