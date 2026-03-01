const express = require('express'); // 
const router = express.Router();
const authorController = require('../controllers/authors-controllers');

router.get('/', authorController.findAll);
router.get('/:id', authorController.getOne);
router.post('/', authorController.create);
router.patch('/:id', authorController.update);
router.delete('/:id', authorController.delete);

module.exports = router;