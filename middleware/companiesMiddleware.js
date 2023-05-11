const ExpressError = require('../expressError');
let db = require('../db');
const { json } = require('express');

async function showCompanies(req, res, next){
    /** Select code and neme from companies, there's little posibility for errors */
    try{
        const result = await db.query(`SELECT code, name FROM companies`);
        return res.status(200).json({ companies : result.rows});
    } catch(error){
        return next(error);
    }
}

async function getByCode(req, res, next){
    /** Retrieves id, name and description from the database, throws an error if there're no results*/
    try{
        const result = await db.query(`SELECT code, name, description, jsonb_agg(invoices) as invoices FROM companies JOIN invoices ON (code=invoices.comp_code) WHERE companies.code=$1 GROUP BY companies.code`, [req.params.code]);
        
        if (result.rows.length == 0){
            throw new ExpressError(`The company code you provided: '${req.params.code}' didn't match any result`, 404);
        }
        /** The first index is selected to prevent sending back an array */
        return res.status(200).json({ company : result.rows[0] });
    } catch(error){
        return next(error);
    }
}


async function addCompany(req, res, next){
    try{
        const { code, name, description } = req.body;
        const result = await db.query('INSERT INTO companies VALUES ($1, $2, $3) RETURNING code, name, description', [code, name, description]);
        return res.status(201).json({company: result.rows[0]})
    } catch(error){
        return next(error);
    }
}

async function editCompany(req, res, next){
    try{
        const { name, description } = req.body;
        const { code } = req.params;
        const result = await db.query('UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING code, name, description', [name, description, code])
        if (result.rows.length == 0){
            throw new ExpressError(`The company code you provided: '${req.params.code}' didn't match any result`, 404);
        }
        return res.status(200).json({company: result.rows[0]})
    }catch(error){
        return next(error);
    }
}

async function deleteCompany(req, res, next){
    try{
        const { code } = req.params;
        const result = await db.query('DELETE FROM companies WHERE code=$1 RETURNING code', [code])
        if (result.rows.length == 0){
            throw new ExpressError(`The company code you provided: '${req.params.code}' didn't match any result`, 404);
        }
        return res.status(200).json({status: "deleted"})
    }catch(error){
        return next(error);
    }
}

module.exports = { showCompanies, getByCode, addCompany, editCompany, deleteCompany };




