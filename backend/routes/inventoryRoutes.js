const express = require('express');
const inventoryController = require('../controllers/inventoryController');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/', inventoryController.createItem);
router.get('/', inventoryController.getAllItems);
router.put('/:id', inventoryController.updateItem);
router.delete('/:id', inventoryController.deleteItem);
router.post('/import', upload.single('file'), inventoryController.bulkImport);
router.get('/export', inventoryController.bulkExport);

module.exports = router;
