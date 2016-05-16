var express = require('express');
var router = express.Router();

var redis = require("redis"),
    client = redis.createClient();

// Redis key -> value format:
//   task_id:user_id:date -> curent_step

// Initialize a new task in redis
router.get('/tasks', function(req, res) {
    task_id = req.body.task_id;
    user_id = req.body.user_id;
    total_steps = req.body.total_steps;

    res.json({});
});


// Get task progress and details
router.get('/tasks/:task_id', function(req, res) {
    res.json(req.params);
});


// Increment task progress by one step
router.put('/tasks/:task_id', function(req, res) {
    res.json({});
});


// End task
router.delete('/tasks/:task_id', function(req, res) {
    res.json({});
});


module.exports = router;
