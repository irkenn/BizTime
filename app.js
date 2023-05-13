/** BizTime express application. */
const express = require("express");
const app = express();
const routesCompanies = require('./routes/companies');
const routesInvoices = require('./routes/invoices');
const routesIndustries = require('./routes/industries');
const ExpressError = require('./expressError');

app.use(express.json());
app.use('/companies', routesCompanies);
app.use('/invoices', routesInvoices);
app.use('/industries', routesIndustries);

/** 404 handler */

app.use(function(req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

/** general error handler */

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err.message,
    status: err.status 
  });
});

module.exports = app;
