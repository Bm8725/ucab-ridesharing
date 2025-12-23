const express = require('express');
const router = express.Router();

const {
  testAuth,
  register
} = require('../controllers/authController');

// GET /api/auth
router.get('/', testAuth);

// POST /api/auth/register
router.post('/register', register);

module.exports = router;
