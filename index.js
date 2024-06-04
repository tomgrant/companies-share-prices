const express = require('express');
const cors = require('cors');
const companyRoutes = require('./routes/companyRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', companyRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

module.exports = app;
