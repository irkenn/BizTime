const express = require('express');
const router = new express.Router();
const companiesMiddleware = require('../middleware/companiesMiddleware');
let db = require('../db');

router.get('/', companiesMiddleware.showCompanies); 

router.get('/:code', companiesMiddleware.getByCode);

router.post('/', companiesMiddleware.addCompany);

router.put('/:code', companiesMiddleware.editCompany);

router.delete('/:code', companiesMiddleware.deleteCompany);


module.exports = router;



/** I found out that I can use the route functions this way: 
 * router.get('/:code', companiesMiddleware.getByCode); 
 * everything seems to work and I'm handling the errors in the middleware
 * functions, so there's no need to use a nested block of try/catch between 
 * the route handler and the middelware functions. 

router.get('/', async (req, res, next) => {
    try{
        await companiesMiddleware.showCompanies(req, res, next);
    } catch(error) {
        return next(error);
    }  
});

router.get('/:code', async (req, res, next) => {
    try{
        await companiesMiddleware.getByCode(req, res, next);
    } catch(error){
        return next(error);
    }
});

*/