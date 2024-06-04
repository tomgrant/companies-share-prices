# Share Price API

This project consists of a backend API built with Node.js and Express along with a frontend application developed using Vue.js. The purpose is to display a list of companies, their latest share prices, and historic price data.

## Table of Contents

- [Features](#Features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)

## Installation

To set up the project locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/tomgrant/companies-share-prices.git
   cd share-price-api
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the application:**

   ```bash
   npm start
   ```

3. **Run the Front end:**

   ```bash
   cd .\frontend\
   npm install
   npm run build
   npm run serve
   ```

## Usage

After starting the server, it will be running at `http://localhost:8080`. You can access the API endpoints using a web browser or Postman.

The front end will be available at `http://localhost:8081`

## API Endpoints

Currently, the API provides the following endpoints:

- `GET /api/companies`: Returns a list of all the companies with data such as id, name, symbols score and more.
- `GET /api/companies?includePrices=true`: Returns the same as above with the addition of all the historic prices of each company
- `GET /api/companies?includePrices=true&startDate=2020-04-01&endDate=2023-04-30` Returns the same as within a set date range, both start and end are optional.
