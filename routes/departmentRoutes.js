const express = require('express');
const { createDepartment, getDepartments, getDepartmentById, updateDepartment, deleteDepartment } = require('../controllers/departmentController');
const { protect } = require('../middlewares/authMiddleware');  // Optional, if you want to secure these routes

const router = express.Router();

// Public routes (can add protect middleware if needed)
router.post('/', protect, createDepartment);
router.get('/', getDepartments);
router.get('/:id', getDepartmentById);
router.put('/:id', protect, updateDepartment);
router.delete('/:id', protect, deleteDepartment);

module.exports = router;
    