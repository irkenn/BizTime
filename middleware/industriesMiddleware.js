const ExpressError = require('../expressError');
let db = require('../db');
const { json } = require('express');


async function showIndustries(req, res, next){
    try{
        const result = await db.query(`SELECT ind.code, industry, jsonb_agg(DISTINCT c.name) AS companies 
                                        FROM industries AS ind
                                        LEFT JOIN companies_industries AS c_ind ON ind.code = c_ind.ind_code
                                        LEFT JOIN companies AS c ON c_ind.comp_code = c.code
                                        GROUP BY ind.code`);
        if (result.rows.length == 0){
            throw new ExpressError(`The company code you provided: '${req.params.code}' didn't match any result`, 404);
        }
        return res.status(200).json({ industries : result.rows});
    } catch(error){
        return next(error);
    }
}

async function showCompaniesFromIndustry(req, res, next){
    try{
        const { code } = req.params;
        const result = await db.query('SELECT ')
    }catch(error){
        return next(error);
    }
}

async function addIndustry(req, res, next){
    try{
        const { code, industry } = req.body;
        const result = await db.query('INSERT INTO industries VALUES ($1, $2) RETURNING code, industry', [code, industry])
        return res.status(200).json({industry: result.rows[0]})
    }catch(error){
        return next(error)
    }
}

async function associateIndustryCompany(req, res, next){
    try{
        const { comp_code, ind_code } = req.body;
        const result = await db.query('INSERT INTO companies_industries VALUES ($1, $2)', [comp_code, ind_code]);
        const result2 = await db.query(`SELECT  
                                        c.code, 
                                        name, 
                                        description, 
                                        jsonb_agg(DISTINCT ind.industry) AS industries
                                        FROM companies AS c 
                                        LEFT JOIN companies_industries AS c_ind ON c.code = c_ind.comp_code
                                        LEFT JOIN industries AS ind ON c_ind.ind_code = ind.code
                                        WHERE c.code = $1 GROUP BY c.code;`, [comp_code]);
        if (result2.rows.lenth === 0){
            throw new ExpressError(`There was an error retrieving the company you provided with the code: '${comp_code}'`, 404);
            }
        return res.status(200).json( {company: result2.rows[0]})
    }catch(error){
        return next(error);
    }
}


module.exports = { addIndustry, showIndustries, associateIndustryCompany, showCompaniesFromIndustry }