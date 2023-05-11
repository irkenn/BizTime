const express = require('express');
const router = new express.Router();
const invoiceMiddleware = require('../middleware/invoiceMiddleware');
let db = require('../db');

router.get('/', invoiceMiddleware.showInvoices); 

router.get('/:id', invoiceMiddleware.getByID);

router.post('/', invoiceMiddleware.addInvoice);

router.put('/:id', invoiceMiddleware.changeInvoice);

router.delete('/:id', invoiceMiddleware.deleteInvoice);

module.exports = router;