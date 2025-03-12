
const mongoose = require('mongoose');

const RemarkSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  addedBy: {
    type: String,
    required: true
  },
  dateAdded: {
    type: Date,
    default: Date.now
  }
});

const ReportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  area: {
    type: String,
    required: [true, 'Please provide an area'],
    enum: [
      "Furnace", "Gear box", "Screwpost", "Spindle and Carrier",
      "C&C Shear", "C&D Shear", "Divide Shear", "Power Slitter",
      "Loopers", "Pinch Roll", "RES", "Cooling Bed", "Cold Shear",
      "Bundling Station", "Hydraulic System", "Lubrication System",
      "Water System", "Store and Spare"
    ]
  },
  loggedBy: {
    type: String,
    required: [true, 'Please provide the person who logged this report']
  },
  dateLogged: {
    type: Date,
    default: Date.now
  },
  actionTakenBy: {
    type: String
  },
  actionTaken: {
    type: String
  },
  dateAction: {
    type: Date
  },
  status: {
    type: String,
    required: [true, 'Please provide status'],
    enum: ['Open', 'Ongoing', 'Closed'],
    default: 'Open'
  },
  priority: {
    type: String,
    required: [true, 'Please provide priority'],
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  imageUrl: {
    type: String
  },
  remarks: [RemarkSchema]
});

module.exports = mongoose.model('Report', ReportSchema);
