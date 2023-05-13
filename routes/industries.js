const express = require('express');
const router = new express.Router();
const industriesMiddleware = require('../middleware/industriesMiddleware');
let db = require('../db');


router.get('/', industriesMiddleware.showIndustries);

router.get('/:ind_code', industriesMiddleware.showCompaniesFromIndustry);

router.post('/', industriesMiddleware.addIndustry);

router.put('/', industriesMiddleware.associateIndustryCompany);


module.exports = router;