const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
async function initDatabase() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS properties (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        price DECIMAL(12,2) NOT NULL,
        type TEXT NOT NULL,
        status TEXT DEFAULT 'Active',
        location TEXT,
        beds INTEGER,
        baths DECIMAL(3,1),
        sqft INTEGER,
        image TEXT
      )
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        status TEXT DEFAULT 'Active',
        type TEXT,
        source TEXT
      )
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        dueDate DATE,
        priority TEXT DEFAULT 'Medium',
        status TEXT DEFAULT 'Pending',
        assignedTo TEXT,
        category TEXT
      )
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS campaigns (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT,
        status TEXT DEFAULT 'Active',
        budget DECIMAL(10,2),
        leads INTEGER DEFAULT 0,
        conversions INTEGER DEFAULT 0,
        startDate DATE,
        endDate DATE
      )
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        type TEXT NOT NULL,
        amount DECIMAL(12,2) NOT NULL,
        property TEXT,
        date DATE,
        status TEXT DEFAULT 'Pending'
      )
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS agents (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        properties INTEGER DEFAULT 0,
        sales INTEGER DEFAULT 0,
        rating DECIMAL(2,1) DEFAULT 4.0
      )
    `);
    
    console.log('Database tables created successfully');
  } catch (err) {
    console.error('Error creating tables:', err);
  } finally {
    client.release();
  }
}
// Properties API
app.get('/api/properties', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM properties ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.post('/api/properties', async (req, res) => {
  try {
    const { title, price, type, status, location, beds, baths, sqft, image } = req.body;
    const result = await pool.query(
      'INSERT INTO properties (title, price, type, status, location, beds, baths, sqft, image) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',
      [title, price, type, status || 'Active', location, beds, baths, sqft, image]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.put('/api/properties/:id', async (req, res) => {
  try {
    const { title, price, type, status, location, beds, baths, sqft } = req.body;
    const result = await pool.query(
      'UPDATE properties SET title=$1, price=$2, type=$3, status=$4, location=$5, beds=$6, baths=$7, sqft=$8 WHERE id=$9 RETURNING *',
      [title, price, type, status, location, beds, baths, sqft, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete('/api/properties/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM properties WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
// Clients API
app.get('/api/clients', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clients ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.post('/api/clients', async (req, res) => {
  try {
    const { name, email, phone, status, type, source } = req.body;
    const result = await pool.query(
      'INSERT INTO clients (name, email, phone, status, type, source) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [name, email, phone, status || 'Active', type, source]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.put('/api/clients/:id', async (req, res) => {
  try {
    const { name, email, phone, status, type, source } = req.body;
    const result = await pool.query(
      'UPDATE clients SET name=$1, email=$2, phone=$3, status=$4, type=$5, source=$6 WHERE id=$7 RETURNING *',
      [name, email, phone, status, type, source, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
// Tasks API
app.get('/api/tasks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, dueDate, priority, status, assignedTo, category } = req.body;
    const result = await pool.query(
      'INSERT INTO tasks (title, description, dueDate, priority, status, assignedTo, category) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [title, description, dueDate, priority || 'Medium', status || 'Pending', assignedTo, category]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { title, description, dueDate, priority, status, assignedTo, category } = req.body;
    const result = await pool.query(
      'UPDATE tasks SET title=$1, description=$2, dueDate=$3, priority=$4, status=$5, assignedTo=$6, category=$7 WHERE id=$8 RETURNING *',
      [title, description, dueDate, priority, status, assignedTo, category, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM tasks WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
// Marketing API
app.get('/api/marketing', async (req, res) => {
  try {
    const campaigns = await pool.query('SELECT * FROM campaigns ORDER BY id DESC');
    res.json({ campaigns: campaigns.rows, leads: [] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.post('/api/marketing/campaigns', async (req, res) => {
  try {
    const { name, type, status, budget, startDate, endDate } = req.body;
    const result = await pool.query(
      'INSERT INTO campaigns (name, type, status, budget, startDate, endDate) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [name, type, status || 'Active', budget, startDate, endDate]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
// Finance API
app.get('/api/finance', async (req, res) => {
  try {
    const transactions = await pool.query('SELECT * FROM transactions ORDER BY id DESC');
    const revenue = transactions.rows.filter(t => t.type === 'Commission' || t.type === 'Rent Payment').reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const expenses = transactions.rows.filter(t => t.type === 'Marketing Expense').reduce((sum, t) => sum + parseFloat(t.amount), 0);
    res.json({
      transactions: transactions.rows,
      summary: { totalRevenue: revenue, totalExpenses: expenses, netProfit: revenue - expenses, pendingPayments: transactions.rows.filter(t => t.status === 'Pending').reduce((sum, t) => sum + parseFloat(t.amount), 0) }
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.post('/api/finance/transactions', async (req, res) => {
  try {
    const { type, amount, property, date, status } = req.body;
    const result = await pool.query(
      'INSERT INTO transactions (type, amount, property, date, status) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [type, amount, property, date, status || 'Pending']
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
// Agents API
app.get('/api/agents', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM agents ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
// Dashboard API
app.get('/api/dashboard', async (req, res) => {
  try {
    const properties = await pool.query('SELECT * FROM properties');
    const clients = await pool.query('SELECT * FROM clients');
    const tasks = await pool.query('SELECT * FROM tasks');
    const finance = await pool.query('SELECT * FROM transactions');
    const revenue = finance.rows.filter(t => t.type === 'Commission' || t.type === 'Rent Payment').reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const expenses = finance.rows.filter(t => t.type === 'Marketing Expense').reduce((sum, t) => sum + parseFloat(t.amount), 0);
    res.json({
      properties: { total: properties.rows.length, active: properties.rows.filter(p => p.status === 'Active').length },
      clients: { total: clients.rows.length, active: clients.rows.filter(c => c.status === 'Active').length },
      tasks: { total: tasks.rows.length, pending: tasks.rows.filter(t => t.status === 'Pending').length },
      finance: { totalRevenue: revenue, totalExpenses: expenses, netProfit: revenue - expenses, pendingPayments: 0 }
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
// Serve HTML
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Real Estate Platform running on port ${PORT}`);
  });
});