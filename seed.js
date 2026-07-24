const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Replace with your actual MongoDB URI if different
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/leaddesk';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
});

const leadSchema = new mongoose.Schema({
  name: String,
  email: String,
  budget_range: String,
  message: String,
  status: { type: String, default: 'New' },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Lead = mongoose.models.Lead || mongoose.model('Lead', leadSchema);

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB...');

    // Clear existing data
    await User.deleteMany({});
    await Lead.deleteMany({});

    // Create Admin User (Username: admin, Password: adminpassword)
    const hashedPassword = await bcrypt.hash('adminpassword', 10);
    await User.create({
      username: 'admin',
      password_hash: hashedPassword,
    });
    console.log('✅ Admin user created: admin / adminpassword');

    // Create Sample Leads
    await Lead.insertMany([
      {
        name: 'Kenji Sato',
        email: 'kenji@example.com',
        budget_range: '$5k - $10k',
        message: 'Looking for a full-stack web application rebuild.',
        status: 'New',
      },
      {
        name: 'Sarah Jenkins',
        email: 'sarah@techcorp.com',
        budget_range: '$10k - $25k',
        message: 'Need a custom portal with real-time analytics.',
        status: 'Contacted',
      },
      {
        name: 'Alex Rivera',
        email: 'alex.r@startup.io',
        budget_range: '$25k+',
        message: 'Full Cloud/DevOps infrastructure migration on AWS.',
        status: 'Closed',
      },
    ]);
    console.log('✅ Sample leads seeded successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();