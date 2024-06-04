const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Load environment variables from .env file
require('dotenv').config();

const dbFile = process.env.NODE_ENV === 'test' ? 'test-database.sqlite3' : 'database.sqlite3';
const db = new sqlite3.Database(path.resolve(__dirname, '../', dbFile));

const getCompanyPrices = (companyId, startDate, endDate) => {
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM swsCompanyPriceClose WHERE company_id = ?`;
    const params = [companyId];

    if (startDate) {
        query += ' AND date >= ?';
        params.push(startDate);
    }
    if (endDate) {
        query += ' AND date <= ?';
        params.push(endDate);
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error(`Error fetching prices for company ID ${companyId}: ${err.message}`);
            reject(err);
        } else {
            resolve(rows);
        }
      });
  });
};

// Service function to get all companies
const getCompanies = (includePrices, startDate, endDate, symbol, minScore) => {
  return new Promise((resolve, reject) => {
    let query = `
        SELECT c.*, s.total as score, MAX(p.price) as lastKnownPrice
        FROM swsCompany c
        LEFT JOIN swsCompanyScore s ON c.id = s.company_id
        LEFT JOIN swsCompanyPriceClose p ON c.id = p.company_id
        WHERE 1=1
    `;
    const params = [];

    if (symbol) {
        query += ' AND c.unique_symbol = ?';
        params.push(symbol);
    }
    if (minScore) {
        query += ' AND s.total >= ?';
        params.push(minScore);
    }

    query += ' GROUP BY c.id';

    db.all(query, params, async (err, companies) => {
      if (err) {
        reject(err);
      } else {
        if (includePrices) {
            try {
                const companiesWithPrices = await Promise.all(companies.map(async (company) => {
                    const prices = await getCompanyPrices(company.id, startDate, endDate);
                    return { ...company, prices };
                }));
                resolve(companiesWithPrices);
            } catch (priceErr) {
                console.error(`Error fetching company prices: ${priceErr.message}`);
                reject(priceErr);
            }
        } else {
          resolve(companies);
        }
      }
    });
  });
};

module.exports = {
  getCompanies,
};
