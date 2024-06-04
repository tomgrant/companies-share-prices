const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const companyService = require('./companyService');

// Mock path module to always resolve to the test database
jest.mock('path', () => {
  const originalPath = jest.requireActual('path');
  return {
    ...originalPath,
    resolve: jest.fn(() => originalPath.join(__dirname, '../test-database.sqlite3'))
  };
});

// Setup environment variables
process.env.NODE_ENV = 'test';

describe('Company Service', () => {
  let db;

  beforeEach((done) => {
    // Reset the modules to use the new mock
    jest.resetModules();

    db = new sqlite3.Database(':memory:', (err) => {
      if (err) {
        console.error(err.message);
      } else {
        // Create tables and insert data here if needed
        db.serialize(() => {
          db.run(`CREATE TABLE swsCompany (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            ticker_symbol TEXT,
            exchange_symbol TEXT,
            unique_symbol TEXT,
            date_generated TEXT,
            security_name TEXT,
            exchange_country_iso TEXT,
            listing_currency_iso TEXT,
            canonical_url TEXT,
            unique_symbol_slug TEXT,
            score_id INTEGER
          )`);
          
          db.run(`CREATE TABLE swsCompanyScore (
            id INTEGER PRIMARY KEY,
            company_id TEXT NOT NULL,
            date_generated TEXT NOT NULL,
            dividend INTEGER NOT NULL,
            future INTEGER NOT NULL,
            health INTEGER NOT NULL,
            management INTEGER NOT NULL,
            past INTEGER NOT NULL,
            value INTEGER NOT NULL,
            misc INTEGER NOT NULL,
            total INTEGER NOT NULL,
            sentence TEXT,
            FOREIGN KEY (company_id) REFERENCES swsCompany(id)
          )`);
          
          db.run(`CREATE TABLE swsCompanyPriceClose (
            date TEXT NOT NULL,
            company_id TEXT NOT NULL,
            price REAL NOT NULL,
            date_created TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (date, company_id),
            FOREIGN KEY (company_id) REFERENCES swsCompany(id)
          )`);

          // Insert mock data
          db.run(`INSERT INTO swsCompany (id, name, ticker_symbol, exchange_symbol, unique_symbol, date_generated, security_name, exchange_country_iso, listing_currency_iso, canonical_url, unique_symbol_slug, score_id) VALUES ('1', 'Company A', 'COMA', 'EXA', 'COMA_EXA', '2023-01-01', 'Security A', 'USA', 'USD', 'http://companya.com', 'companya', 1)`);
          db.run(`INSERT INTO swsCompany (id, name, ticker_symbol, exchange_symbol, unique_symbol, date_generated, security_name, exchange_country_iso, listing_currency_iso, canonical_url, unique_symbol_slug, score_id) VALUES ('2', 'Company B', 'COMB', 'EXB', 'COMB_EXB', '2023-01-01', 'Security B', 'USA', 'USD', 'http://companyb.com', 'companyb', 2)`);
          
          db.run(`INSERT INTO swsCompanyScore (id, company_id, date_generated, dividend, future, health, management, past, value, misc, total, sentence) VALUES (1, '1', '2023-01-01', 10, 20, 30, 40, 50, 60, 70, 85, 'Company A Score')`);
          db.run(`INSERT INTO swsCompanyScore (id, company_id, date_generated, dividend, future, health, management, past, value, misc, total, sentence) VALUES (2, '2', '2023-01-01', 15, 25, 35, 45, 55, 65, 75, 90, 'Company B Score')`);

          db.run(`INSERT INTO swsCompanyPriceClose (date, company_id, price) VALUES ('2023-01-01', '1', 120.50)`);
          db.run(`INSERT INTO swsCompanyPriceClose (date, company_id, price) VALUES ('2023-01-01', '2', 150.00)`);

          done();
        });
      }
    });
  });

  afterEach(() => {
    db.close();
    jest.restoreAllMocks();
  });

  test('should get companies without prices', async () => {
    const companies = await companyService.getCompanies(false);
    expect(companies.length).toBeGreaterThan(0);
    companies.forEach(company => {
      expect(company).toHaveProperty('id');
      expect(company).toHaveProperty('name');
      expect(company).toHaveProperty('score');
      expect(company).toHaveProperty('lastKnownPrice');
    });
  });

  test('should get companies with prices', async () => {
    const companies = await companyService.getCompanies(true);
    expect(companies.length).toBeGreaterThan(0);
    companies.forEach(company => {
      expect(company).toHaveProperty('id');
      expect(company).toHaveProperty('name');
      expect(company).toHaveProperty('score');
      expect(company).toHaveProperty('lastKnownPrice');
      expect(company).toHaveProperty('prices');
      expect(Array.isArray(company.prices)).toBe(true);
    });
  });

  // test('should filter companies by symbol', async () => {
  //   const companies = await companyService.getCompanies(false, null, null, 'COMA_EXA');
  //   expect(companies.length).toBe(1);
  //   expect(companies[0].unique_symbol).toBe('COMA_EXA');
  // });

  // test('should filter companies by minimum score', async () => {
  //   const companies = await companyService.getCompanies(false, null, null, null, 90);
  //   expect(companies.length).toBe(1);
  //   expect(companies[0].score).toBeGreaterThanOrEqual(90);
  // });
});
