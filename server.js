const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory database
const db = {
  properties: [
    { id: 1, title: 'Modern Downtown Apartment', price: 450000, type: 'Sale', status: 'Active', location: '123 Main St, New York', beds: 2, baths: 2, sqft: 1200, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400' },
    { id: 2, title: 'Luxury Beachfront Villa', price: 1250000, type: 'Sale', status: 'Active', location: '456 Ocean Dr, Miami', beds: 4, baths: 3, sqft: 3500, image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400' },
    { id: 3, title: 'Cozy Suburban House', price: 3200, type: 'Rent', status: 'Active', location: '789 Elm Ave, Chicago', beds: 3, baths: 2, sqft: 1800, image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400' },
    { id: 4, title: 'Penthouse Suite', price: 5500, type: 'Rent', status: 'Active', location: '101 Tower Ln, Los Angeles', beds: 3, baths: 3, sqft: 2200, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400' },
    { id: 5, title: 'Family Home with Garden', price: 625000, type: 'Sale', status: 'Pending', location: '222 Maple Dr, Seattle', beds: 4, baths: 2.5, sqft: 2400, image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400' }
  ],
  clients: [
    { id: 1, name: 'John Smith', email: 'john.smith@email.com', phone: '(555) 123-4567', status: 'Active', type: 'Buyer', source: 'Website' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '(555) 234-5678', status: 'Active', type: 'Seller', source: 'Referral' },
    { id: 3, name: 'Michael Brown', email: 'm.brown@email.com', phone: '(555) 345-6789', status: 'Inactive', type: 'Tenant', source: 'Social Media' },
    { id: 4, name: 'Emily Davis', email: 'emily.d@email.com', phone: '(555) 456-7890', status: 'Active', type: 'Buyer', source: 'Google Ads' }
  ],
  tasks: [
    { id: 1, title: 'Follow up with John Smith', description: 'Discuss property options', dueDate: '2026-05-15', priority: 'High', status: 'Pending', assignedTo: 'Agent 1', category: 'Client' },
    { id: 2, title: 'Property inspection', description: 'Inspect 123 Main St', dueDate: '2026-05-13', priority: 'Medium', status: 'In Progress', assignedTo: 'Agent 2', category: 'Property' },
    { id: 3, title: 'Prepare marketing materials', description: 'Create flyer for new listing', dueDate: '2026-05-14', priority: 'Low', status: 'Pending', assignedTo: 'Agent 1', category: 'Marketing' },
    { id: 4, title: 'Contract review', description: 'Review purchase agreement', dueDate: '2026-05-12', priority: 'High', status: 'Completed', assignedTo: 'Agent 3', category: 'Finance' }
  ],
  marketing: {
    campaigns: [
      { id: 1, name: 'Summer Promo 2026', type: 'Email', status: 'Active', budget: 5000, leads: 245, conversions: 18, startDate: '2026-05-01', endDate: '2026-06-30' },
      { id: 2, name: 'Social Media Blitz', type: 'Social', status: 'Active', budget: 3000, leads: 520, conversions: 42, startDate: '2026-05-10', endDate: '2026-05-31' },
      { id: 3, name: 'Google Ads - Buyers', type: 'PPC', status: 'Paused', budget: 2000, leads: 89, conversions: 5, startDate: '2026-04-01', endDate: '2026-04-30' }
    ],
    leads: [
      { id: 1, name: 'David Wilson', source: 'Website', date: '2026-05-10', status: 'New', property: 'Downtown Apartment' },
      { id: 2, name: 'Lisa Anderson', source: 'Google', date: '2026-05-11', status: 'Contacted', property: 'Beachfront Villa' },
      { id: 3, name: 'Robert Taylor', source: 'Facebook', date: '2026-05-12', status: 'New', property: 'Family Home' }
    ]
  },
  finance: {
    transactions: [
      { id: 1, type: 'Commission', amount: 15000, property: '456 Ocean Dr', date: '2026-05-01', status: 'Completed' },
      { id: 2, type: 'Rent Payment', amount: 3200, property: '789 Elm Ave', date: '2026-05-05', status: 'Completed' },
      { id: 3, type: 'Marketing Expense', amount: 850, property: 'Summer Promo', date: '2026-05-08', status: 'Pending' },
      { id: 4, type: 'Commission', amount: 8500, property: '222 Maple Dr', date: '2026-05-10', status: 'Pending' },
      { id: 5, type: 'Rent Payment', amount: 5500, property: '101 Tower Ln', date: '2026-05-12', status: 'Completed' }
    ],
    summary: {
      totalRevenue: 28500,
      totalExpenses: 4850,
      netProfit: 23650,
      pendingPayments: 9350
    }
  },
  agents: [
    { id: 1, name: 'Alex Thompson', email: 'alex@company.com', phone: '(555) 111-1111', properties: 12, sales: 8, rating: 4.8 },
    { id: 2, name: 'Maria Garcia', email: 'maria@company.com', phone: '(555) 222-2222', properties: 15, sales: 11, rating: 4.9 },
    { id: 3, name: 'James Wilson', email: 'james@company.com', phone: '(555) 333-3333', properties: 9, sales: 6, rating: 4.7 }
  ]
};

// API Routes - Properties
app.get('/api/properties', (req, res) => {
  res.json(db.properties);
});

app.post('/api/properties', (req, res) => {
  const newProperty = { id: db.properties.length + 1, ...req.body };
  db.properties.push(newProperty);
  res.json(newProperty);
});

app.put('/api/properties/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = db.properties.findIndex(p => p.id === id);
  if (index !== -1) {
    db.properties[index] = { ...db.properties[index], ...req.body };
    res.json(db.properties[index]);
  } else {
    res.status(404).json({ error: 'Property not found' });
  }
});

app.delete('/api/properties/:id', (req, res) => {
  const id = parseInt(req.params.id);
  db.properties = db.properties.filter(p => p.id !== id);
  res.json({ success: true });
});

// API Routes - Clients
app.get('/api/clients', (req, res) => {
  res.json(db.clients);
});

app.post('/api/clients', (req, res) => {
  const newClient = { id: db.clients.length + 1, ...req.body };
  db.clients.push(newClient);
  res.json(newClient);
});

app.put('/api/clients/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = db.clients.findIndex(c => c.id === id);
  if (index !== -1) {
    db.clients[index] = { ...db.clients[index], ...req.body };
    res.json(db.clients[index]);
  } else {
    res.status(404).json({ error: 'Client not found' });
  }
});

// API Routes - Tasks
app.get('/api/tasks', (req, res) => {
  res.json(db.tasks);
});

app.post('/api/tasks', (req, res) => {
  const newTask = { id: db.tasks.length + 1, ...req.body };
  db.tasks.push(newTask);
  res.json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = db.tasks.findIndex(t => t.id === id);
  if (index !== -1) {
    db.tasks[index] = { ...db.tasks[index], ...req.body };
    res.json(db.tasks[index]);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

app.delete('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  db.tasks = db.tasks.filter(t => t.id !== id);
  res.json({ success: true });
});

// API Routes - Marketing
app.get('/api/marketing', (req, res) => {
  res.json(db.marketing);
});

app.post('/api/marketing/campaigns', (req, res) => {
  const newCampaign = { id: db.marketing.campaigns.length + 1, ...req.body };
  db.marketing.campaigns.push(newCampaign);
  res.json(newCampaign);
});

// API Routes - Finance
app.get('/api/finance', (req, res) => {
  res.json(db.finance);
});

app.post('/api/finance/transactions', (req, res) => {
  const newTransaction = { id: db.finance.transactions.length + 1, ...req.body };
  db.finance.transactions.push(newTransaction);
  // Update summary
  if (newTransaction.type === 'Commission' || newTransaction.type === 'Rent Payment') {
    db.finance.summary.totalRevenue += newTransaction.amount;
  } else {
    db.finance.summary.totalExpenses += newTransaction.amount;
  }
  db.finance.summary.netProfit = db.finance.summary.totalRevenue - db.finance.summary.totalExpenses;
  res.json(newTransaction);
});

// API Routes - Agents
app.get('/api/agents', (req, res) => {
  res.json(db.agents);
});

// Dashboard Stats
app.get('/api/dashboard', (req, res) => {
  res.json({
    properties: { total: db.properties.length, active: db.properties.filter(p => p.status === 'Active').length },
    clients: { total: db.clients.length, active: db.clients.filter(c => c.status === 'Active').length },
    tasks: { total: db.tasks.length, pending: db.tasks.filter(t => t.status === 'Pending').length },
    finance: db.finance.summary
  });
});

// Serve HTML files
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Real Estate Platform running at http://localhost:${PORT}`);
  console.log(`Admin Dashboard at http://localhost:${PORT}/admin`);
});