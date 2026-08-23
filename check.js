// Quick syntax check - requires all backend modules
process.env.MONGODB_URI = 'mongodb://localhost:27017/smart_hostel_test';
process.env.JWT_SECRET = 'test_secret';
process.env.PORT = '5001';

try {
  require('./backend/models/User');
  require('./backend/models/Student');
  require('./backend/models/Room');
  require('./backend/models/Hostel');
  require('./backend/models/Attendance');
  require('./backend/models/Complaint');
  require('./backend/models/LeaveRequest');
  require('./backend/models/Visitor');
  require('./backend/models/MessMenu');
  require('./backend/models/FoodFeedback');
  require('./backend/models/FoodWaste');
  require('./backend/models/Fee');
  require('./backend/models/Maintenance');
  require('./backend/models/Notice');
  require('./backend/models/Inventory');
  require('./backend/models/Staff');
  require('./backend/models/Emergency');
  require('./backend/models/Notification');
  require('./backend/models/AuditLog');
  console.log('[OK] All 19 Mongoose models loaded');

  require('./backend/middleware/authMiddleware');
  require('./backend/middleware/roleMiddleware');
  require('./backend/middleware/errorMiddleware');
  require('./backend/middleware/uploadMiddleware');
  console.log('[OK] All middleware loaded');

  require('./backend/routes/authRoutes');
  require('./backend/routes/studentRoutes');
  require('./backend/routes/roomRoutes');
  require('./backend/routes/attendanceRoutes');
  require('./backend/routes/complaintRoutes');
  require('./backend/routes/leaveRoutes');
  require('./backend/routes/visitorRoutes');
  require('./backend/routes/messRoutes');
  require('./backend/routes/feeRoutes');
  require('./backend/routes/maintenanceRoutes');
  require('./backend/routes/noticeRoutes');
  require('./backend/routes/inventoryRoutes');
  require('./backend/routes/staffRoutes');
  require('./backend/routes/emergencyRoutes');
  require('./backend/routes/notificationRoutes');
  require('./backend/routes/reportRoutes');
  require('./backend/routes/hostelRoutes');
  console.log('[OK] All 17 route files loaded');

  console.log('\n=== SYNTAX CHECK PASSED ===');
  console.log('All backend modules loaded without errors!');
  process.exit(0);
} catch (err) {
  console.error('[ERROR]', err.message);
  process.exit(1);
}
