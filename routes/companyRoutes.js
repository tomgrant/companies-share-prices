const express = require('express');
const router = express.Router();
const { getCompanies } = require('../controllers/companyController');

router.get('/companies', getCompanies);

module.exports = router;
