const companyService = require('../services/companyService');
const companyController = require('./companyController');

jest.mock('../services/companyService');

describe('Company Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { query: {} };
    res = {
      json: jest.fn(),
      status: jest.fn(() => res)
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should get companies without prices', async () => {
    const mockCompanies = [
      { id: '1', name: 'Company A', score: 85, lastKnownPrice: 120.50 },
      { id: '2', name: 'Company B', score: 90, lastKnownPrice: 150.00 }
    ];

    companyService.getCompanies.mockResolvedValue(mockCompanies);

    await companyController.getCompanies(req, res);

    expect(res.json).toHaveBeenCalledWith({ companies: mockCompanies });
  });

  test('should handle service errors', async () => {
    const error = new Error('Something went wrong');
    companyService.getCompanies.mockRejectedValue(error);

    await companyController.getCompanies(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: error.message });
  });
});
