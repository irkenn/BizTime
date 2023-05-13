process.env.NODE_ENV = 'test';
// const { Pool } = require('pg');
const request = require('supertest');

const app = require('../app');
let db = require('../db');

afterAll( async function (){
    await db.end()
})

afterEach( async function () {
    await db.rollbackTransaction();
})

describe("test /companies routes", function(){
    test('Get companies from database', async function(){
        const resp = await request(app).get('/companies');
        expect(resp.statusCode).toBe(200);
        expect(resp.body.companies[0].code).toEqual('apple');
        expect(resp.body.companies[1].code).toEqual('ibm');
    })
    test('Get single company from the database', async function(){
        const resp = await request(app).get('/companies/ibm');
        expect(resp.statusCode).toBe(200);
        expect(resp.body.company.name).toEqual('IBM');
        expect(resp.body.company.description).toEqual('Big blue.');
    })

    // test('Adds a new company', async function(){
    //     const resp = await request(app).post('/companies').send({})
    // })

    // test('Modify an existing company using PUT method')
})