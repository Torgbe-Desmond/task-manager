const { StatusCodes } = require('http-status-codes');
const User = require('../models/User');
const jwt = require('jsonwebtoken'); 
const mongoose = require('mongoose');
const BAD_REQUEST = require('../errors/badRequest');
const router = require('express').Router();
const authLayout = '../views/layouts/auth';
const Task = require('../models/Task');


router.route('/').get(async (req,res)=>{
  const locals = {
    title: "Task Manager",
    description: "Manage your task seemlessly."
  }
    res.render('auth/authentication' , { layout:authLayout,locals })
})

router.route('/auth/login').post(async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        throw new BAD_REQUEST('Invalid email or password')
      }

      const isMatch = await user.comparePassword(password); 
      if (!isMatch) {
        throw new BAD_REQUEST('Invalid email or password');
      }
      
       const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1h'
      });  
      res.cookie('taskToken', token, { httpOnly: true, maxAge: 3600000 });
      res.status(StatusCodes.OK).json({ success: true });
    } catch (error) {
        throw error;
    }
  });


  router.route('/auth/register').post(async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    const { name, email, password } = req.body;
  
    try {
      let user = await User.findOne({ email });
      if (user) {
        throw new BAD_REQUEST('User already exists');
      }
      const createdUsers = await User.create([{ name, email, password }], { session });
      const newUser = createdUsers[0];
      if (newUser) {
        const initialDummyTask = {
          name: 'Example',
          completed: true,
          userId: newUser._id
        };
        await Task.create([initialDummyTask], { session });
      }
      await session.commitTransaction();
      res.status(StatusCodes.CREATED).json({ success: true });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  });
  
  router.post('/logout', (req, res) => {
    res.clearCookie('taskToken');
    res.status(StatusCodes.OK).json({success:true});
  });
  

  module.exports = router;