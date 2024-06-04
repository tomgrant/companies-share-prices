const companyService = require('../services/companyService');

const getCompanies = async (req, res) => {
    const includePrices = req.query.includePrices === 'true';
    const { startDate, endDate, symbol, minScore } = req.query;

    try {
        const companies = await companyService.getCompanies(includePrices, startDate, endDate, symbol, minScore);
        res.json({ companies });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
  getCompanies,
};
