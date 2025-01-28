const express = require('express');
const Todo = require('../models/Todo');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all todos for the authenticated user
router.get('/', auth, async (req, res) => {
    const todos = await Todo.find({ user: req.user.id });
    res.json(todos);
});

// Create a new todo
router.post('/', auth, async (req, res) => {
    const { title } = req.body;
    const todo = new Todo({
        title,
        user: req.user.id,
    });
    await todo.save();
    res.status(201).json(todo);
});

// Update a todo
router.put('/:id', auth, async (req, res) => {
    const { title, completed } = req.body;
    const todo = await Todo.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        { title, completed },
        { new: true }
    );
    res.json(todo);
});

// Delete a todo
router.delete('/:id', auth, async (req, res) => {
    await Todo.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: 'Todo deleted' });
});

module.exports = router;