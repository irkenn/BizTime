const ExpressError = require('../expressError');
let db = require('../db');
const { json } = require('express');

async function showInvoices(req, res, next){
    try{
        const result = await db.query(`SELECT id, comp_code FROM invoices`);
        return res.status(200).json({ invoices : result.rows});
    } catch(error){
        return next(error);
    }
}

async function getByID(req, res, next){
    try{
        const { id } = req.params;
        const result = await db.query('SELECT id, amt, paid, add_date, paid_date, code, name, description FROM invoices JOIN companies ON (code=invoices.comp_code) WHERE invoices.id =$1', [id]);
        if (result.rows.length == 0){
            throw new ExpressError(`The invoice id: ${id} didn't match any result`, 404);
        }
        
        const { amt, paid, add_date, paid_date, code, name, description } = result.rows[0];
        return res.status(200).json({invoice: { 
            id: id, 
            amt:amt, 
            paid:paid, 
            add_date:add_date, 
            paid_date:paid_date, 
            company: {code:code, name:name, description:description} }});
        } catch(error){
            return next(error);
        }
    }
    
async function addInvoice(req, res, next){
    try{
        const { comp_code, amt } = req.body;
        const result = await db.query('INSERT INTO invoices (comp_Code, amt) VALUES ($1, $2) RETURNING id, comp_code, amt, paid, add_date, paid_date', [comp_code, amt]);
        return res.status(201).json({invoice: result.rows[0]})

    }catch(error){
        return next(error);
    }

}

async function changeInvoice(req, res, next){
    try{
        const { id } = req.params;
        const { amt, paid } = req.body;
        let result;

        /////CURRENTLY HERE!!!!!
        if(paid == true){
            result = await db.query('UPDATE invoices SET  amt=$1, paid=$2, paid_date=CURRENT_DATE WHERE id=$3 RETURNING id, comp_code, amt, paid, add_date, paid_date', [amt, paid, id ]);
        }
        else if(paid == false){
            console.log('checkpoint')
            result = await db.query('UPDATE invoices SET  amt=$1, paid=$2, paid_date=$4 WHERE id=$3 RETURNING id, comp_code, amt, paid, add_date, paid_date', [amt, paid, id, null ]);
        }
        console.log('This is result', result.rows)
        if (result.rows.length == 0){
            throw new ExpressError(`The invoice id: ${id} didn't match any result`, 404);
        }
        return res.status(200).json({ invoice : result.rows })
    } catch(error){
        return next(error);
    }
}


async function deleteInvoice(req, res, next){
    try{
        const { id } = req.params;
        const result = await db.query('DELETE FROM invoices WHERE id=$1 RETURNING id', [ id ]);
        if (result.rows.length == 0){
            throw new ExpressError(`The invoice id: '${id}' didn't match any result`, 404);
        }
        return res.status(200).json({status:"deleted"})
    } catch(error){
        return next(error);
    }
}

module.exports = { showInvoices, getByID, addInvoice, changeInvoice, deleteInvoice };