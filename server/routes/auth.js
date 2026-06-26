const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { useJson, models, jsonStore, saveJson } = require('../config/db');
const { registerValidation, loginValidation, validateRequest } = require('../middleware/validators');

const router = express.Router();

const signToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role || 'Student', name: user.name },
    process.env.JWT_SECRET || 'projectnest_secret',
    { expiresIn: '7d' }
  );
};

router.post('/register', registerValidation, validateRequest, async (req, res) => {
  const { name, email, password, phone, profession, organization, skills, experience, picture, bio, role } = req.body;
  const normalizedEmail = email.toLowerCase();
  if (useJson) {
    if (jsonStore.users.some((user) => user.email === normalizedEmail)) {
      return res.status(409).json({ message: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: jsonStore.users.length + 1,
      name,
      email: normalizedEmail,
      password: hashedPassword,
      phone,
      profession,
      organization,
      skills,
      experience,
      picture,
      bio,
      role: role || 'Student',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    jsonStore.users.push(newUser);
    saveJson();
    const token = signToken(newUser);
    return res.status(201).json({ user: { ...newUser, password: undefined }, token });
  }

  const existing = await models.User.findOne({ where: { email: normalizedEmail } });
  if (existing) {
    return res.status(409).json({ message: 'Email already exists' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await models.User.create({
    name,
    email: normalizedEmail,
    password: hashedPassword,
    phone,
    profession,
    organization,
    skills,
    experience,
    picture,
    bio,
    role: role || 'Student'
  });
  const token = signToken(user);
  res.status(201).json({ user: { ...user.toJSON(), password: undefined }, token });
});

router.post('/login', loginValidation, validateRequest, async (req, res) => {
  const { email, password, remember } = req.body;
  const normalizedEmail = email.toLowerCase();
  let user;
  if (useJson) {
    user = jsonStore.users.find((u) => u.email === normalizedEmail);
  } else {
    user = await models.User.findOne({ where: { email: normalizedEmail } });
  }
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = signToken(user);
  res.json({ user: { ...user.toJSON?.(), password: undefined, ...user }, token, remember: !!remember });
});

router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out' });
});

module.exports = router;
