/**
 * Simple Node.js Express Application
 * ----------------------------------
 * This app connects to a MongoDB database, seeds it with sample employee data (if not already present),
 * and exposes REST endpoints to fetch the data.
 *
 * Endpoints:
 * - GET /employeesInfo  → returns list of employees
 * - GET /               → returns simple running message
 * - GET /health         → returns health status
 */

const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();

// Port for the API server (default: 3000)
const port = process.env.PORT || 3000;

// MongoDB configuration from environment variables
const dbName = process.env.DB_NAME || 'employeestats';
const maxPoolSize = parseInt(process.env.DB_MAX_POOL_SIZE || '10', 10); // Connection pool size
const uri = process.env.DB_URI; // MongoDB connection URI

let db; // Will hold the MongoDB database instance

/**
 * logDataInMongoDB
 * ----------------
 * Checks if the `employee` collection has any documents.
 * If empty, it inserts default employee records.
 * This ensures initial seed data for demonstration.
 */
async function logDataInMongoDB() {
  const count = await db.collection('employee').countDocuments();
  if (count === 0) {
    console.log("Adding records to database...");
    await db.collection('employee').insertMany([
      { name: 'Tom', email: 'tom@gmail.com', mobile: '123456789' },
      { name: 'Dick', email: 'dick@gmail.com', mobile: '234567891' },
      { name: 'Harry', email: 'harry@gmail.com', mobile: '345678912' },
      { name: 'Alisha', email: 'alisha@gmail.com', mobile: '456789123' },
      { name: 'Melina', email: 'melina@gmail.com', mobile: '567891234' }
    ]);
    console.log("Records added successfully");
  } else {
    console.log("Data is retained in database, no need to insert");
  }
}

// Log MongoDB URI for verification (not recommended in production)
console.log("Connecting to MongoDB using URI:", uri);

/**
 * MongoDB Connection Setup
 * ------------------------
 * Establishes a connection to MongoDB using a connection pool.
 * On success, it seeds data if needed.
 */
MongoClient.connect(uri, {
  useUnifiedTopology: true,
  maxPoolSize,
})
  .then(async (client) => {
    db = client.db(dbName);
    console.log("MongoDB connection successful");
    await logDataInMongoDB(); // Seed data
  })
  .catch(error => {
    console.error("Error connecting to MongoDB:", error);
  });

/**
 * GET /employeesInfo
 * ------------------
 * Returns the full list of employees from the MongoDB collection.
 */
app.get('/employeesInfo', async (req, res) => {
  try {
    const items = await db.collection('employee').find().toArray();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /
 * ------
 * Health check endpoint for base URL.
 */
app.get('/', (req, res) => {
  res.status(200).send('App is running');
});

/**
 * GET /health
 * -----------
 * Kubernetes/Cloud provider health check endpoint.
 */
app.get('/health', (req, res) => {
  res.status(200).send('App is Healthy');
});

// Start the Express server
app.listen(port, () => {
  console.log(`API server running on port ${port}`);
});
