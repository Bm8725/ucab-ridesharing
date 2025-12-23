// controllers/authController.js

exports.testAuth = (req, res) => {
  res.json({ message: 'Auth controller works' });
};

exports.register = (req, res) => {
  const { email, password } = req.body;

  // validare minimă
  if (!email || !password) {
    return res.status(400).json({
      error: 'Email and password are required'
    });
  }

  // momentan doar simulăm
  res.status(201).json({
    message: 'User registered (mock)',
    user: {
      email
    }
  });
};
