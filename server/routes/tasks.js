const express = require('express');
const router = express.Router();

const Task = require('../models/Task');
const expressAsyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const mongoose = require('mongoose');
const NotFound = require('../errors/notFound');
const authMiddleware = require('../middleware/authMiddleware');
const taskLayout = '../views/layouts/task';


// Get all tasks
router.route('/tasks').get(authMiddleware, expressAsyncHandler(async (req, res) => {
  try {
    const locals = {
      title: "Task Manager",
      description: "Manage your task seemlessly."
    }
    const userId =  req.userId;
    const tasks = await Task.find({userId});
    res.render('index', { tasks, locals });
  } catch (error) {
    throw error;
   }
}));

// Get a specific task
router.route('/tasks/:id').get(authMiddleware, expressAsyncHandler(async (req, res) => {
  const { id: taskID } = req.params;
  const locals = {
    title: "Edit Task",
    description: "Manage your task seemlessly."
  }
  const userId =  req.userId;
  const some = await Task.findOne({ _id: taskID,userId });
  if (!some) {
    throw new NotFound(`No task with id: ${taskID}`);
  }
  res.render('task/index' ,{ some ,layout:taskLayout,locals});
}));

// Create a new task
router.route('/tasks').post(authMiddleware, expressAsyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  req.body.userId = req.userId;
  try {
    console.log(req.body);
    const task = await Task.create([req.body], { session });
    console.log('task',task)
    await session.commitTransaction();
    res.status(StatusCodes.CREATED).json(task[0]);
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}));


// Delete a task
router.route('/tasks/:id').delete(authMiddleware, expressAsyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const { id: taskID } = req.params;
    const userId = req.userId;
    console.log(taskID)
    const { _id } = await Task.findOneAndDelete({ _id: taskID,userId}, { session });
    if (!_id) { 
      await session.abortTransaction();
      throw new NotFound(`No task with id: ${_id}`);
    }
    await session.commitTransaction();
    res.status(StatusCodes.OK).json({ _id });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}));

// Update a task
router.route('/tasks/:id').patch(authMiddleware,expressAsyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  const { completed, name } = req.body;
  try {

    const updateObject = {}
    if(completed) updateObject.completed = true;
    if(name) updateObject.name = name;
    if(req.userId) updateObject.userId = req.userId;

    session.startTransaction();
    const { id: taskID } = req.params;
    const task = await Task.findOneAndUpdate({ _id: taskID }, updateObject , {
      session,
    });
    if (!task) {
      throw new NotFound(`No task with id: ${taskID}`);
    }
    await session.commitTransaction();
    res.status(StatusCodes.OK).json({ task });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}));

module.exports = router;


