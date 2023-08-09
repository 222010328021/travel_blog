const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/blogApp', { useNewUrlParser: true, useUnifiedTopology: true });

const User = mongoose.model('User', {
    email: String,
    password: String,
});

app.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Authentication failed' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Authentication failed' });
        }
        const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


import React, { useState } from 'react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform login logic using email and password
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Email:</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <label>Password:</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;


import React, { useState } from 'react';

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform signup logic using email, password, and confirmPassword
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Email:</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <label>Password:</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <label>Confirm Password:</label>
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <button type="submit">Signup</button>
    </form>
  );
};

export default SignupForm;


import React from 'react';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  return (
    <div>
      <h1>Login Page</h1>
      <LoginForm />
    </div>
  );
};

export default LoginPage;


import React from 'react';
import SignupForm from '../components/SignupForm';

const SignupPage = () => {
  return (
    <div>
      <h1>Signup Page</h1>
      <SignupForm />
    </div>
  );
};

export default SignupPage;

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost/blogApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Define API routes
app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

import React, { useState } from 'react';
import axios from 'axios';

const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/blogs', { title, content });
      // Clear form fields
      setTitle('');
      setContent('');
      // Redirect to blog list
      window.location.href = '/';
    } catch (error) {
      console.error('Error creating blog:', error);
    }
  };

  return (
    <div>
      <h2>Create a New Blog</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">Create Blog</button>
      </form>
    </div>
  );
};

export default CreateBlog;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios.get('/api/blogs').then((response) => {
      setBlogs(response.data);
    });
  }, []);

  return (
    <div>
      <h2>Blog List</h2>
      {blogs.map((blog) => (
        <div key={blog._id}>
          <h3>{blog.title}</h3>
          <p>{blog.content}</p>
        </div>
      ))}
    </div>
  );
};

export default BlogList;

document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');

  // Add event listener for login form submission
  loginForm.addEventListener('submit', function(event) {
      event.preventDefault();
      // Perform login form validation and actions
      // loginForm.submit(); when ready to submit
  });

  // Add event listener for signup form submission
  signupForm.addEventListener('submit', function(event) {
      event.preventDefault();
      // Perform signup form validation and actions
      // signupForm.submit(); when ready to submit
  });
});
