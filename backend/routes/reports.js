
const express = require('express');
const Report = require('../models/Report');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const reports = await Report.find();
    
    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @desc    Get single report
// @route   GET /api/reports/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Report not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @desc    Create new report
// @route   POST /api/reports
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const report = await Report.create(req.body);
    
    res.status(201).json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// @desc    Update report
// @route   PUT /api/reports/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let report = await Report.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Report not found'
      });
    }
    
    // Check if user is admin or if report status allows editing by regular users
    if (req.user.role !== 'admin') {
      if (report.status !== 'Open' && report.status !== 'Ongoing') {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to update this report'
        });
      }
      
      // Regular users can only update specific fields
      const allowedUpdates = ['status', 'actionTakenBy', 'actionTaken', 'dateAction'];
      const updates = Object.keys(req.body);
      
      for (const update of updates) {
        if (!allowedUpdates.includes(update) && update !== 'remarks') {
          return res.status(403).json({
            success: false,
            error: `Regular users cannot update the ${update} field`
          });
        }
      }
    }
    
    // Handle adding new remarks
    if (req.body.newRemark) {
      const newRemark = {
        text: req.body.newRemark,
        addedBy: req.body.remarkAddedBy || req.user.userId,
        dateAdded: new Date()
      };
      
      if (!report.remarks) {
        report.remarks = [];
      }
      
      report.remarks.push(newRemark);
      delete req.body.newRemark;
      delete req.body.remarkAddedBy;
    }
    
    // Update other fields
    Object.keys(req.body).forEach(key => {
      if (key !== 'remarks') {
        report[key] = req.body[key];
      }
    });
    
    await report.save();
    
    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Report not found'
      });
    }
    
    await report.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

module.exports = router;
