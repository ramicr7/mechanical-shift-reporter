
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGODB_URI);

// Users to seed
const users = [
  {
    userId: 'User@nbm',
    name: 'User',
    password: 'User@1234',
    role: 'user'
  },
  {
    userId: 'administrator',
    name: 'Administrator',
    password: 'mastermind',
    role: 'admin'
  }
];

// Import users into DB
const importData = async () => {
  try {
    await User.deleteMany();
    await User.create(users);
    
    console.log('Data Imported...');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Delete data from DB
const deleteData = async () => {
  try {
    await User.deleteMany();
    
    console.log('Data Destroyed...');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Check command line args to determine action
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please add proper flag: -i to import, -d to delete');
  process.exit();
}
