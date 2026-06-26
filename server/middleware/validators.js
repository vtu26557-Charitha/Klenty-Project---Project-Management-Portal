const { body, validationResult } = require('express-validator');

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),
  body('phone').optional().trim(),
  body('profession').optional().trim(),
  body('organization').optional().trim(),
  body('skills').optional().trim(),
  body('experience').optional().trim(),
  body('role').optional().isIn(['Student','Working Professional','Freelancer','Team Leader','Faculty','Startup Founder','Admin']).withMessage('Invalid role')
];

const loginValidation = [
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};

module.exports = { registerValidation, loginValidation, validateRequest };
