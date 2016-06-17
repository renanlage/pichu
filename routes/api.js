var router = require('express').Router(),
    client = require('redis').createClient(),
    uuid = require('node-uuid');


var Task = function(totalSteps, extra) {
    var nowUtc = new Date().getTime();
    this.currentStep = 0;
    this.totalSteps = totalSteps;
    this.dateCreated = nowUtc;
    this.dateUpdated = nowUtc;

    if (extra !== undefined) {
        this.extra = extra;
    }
};

// Redis key -> value format:
// taskId -> {currentStep: int, totalSteps: int, extra: object,
//            dateCreated: utc, dateUpdated: utc}


// Get all tasks
router.get('/tasks', function(req, res) {
    res.json('lala');
});

// Initialize a new task in redis
router.post('/tasks', function(req, res) {
    var json = req.body,
        task = new Task(json.totalSteps, json.extra),
        taskGroup = json.taskGroup,
        taskId = uuid.v1()

    client.hmset(taskId, task, function(err, reply) {
        res.json({taskId: taskId});
    });
});

// Get tasks progress and details by id
router.get('/tasks/:id', function(req, res) {
    var task_id = req.params.id;

    client.hgetall(task_id, function(err, obj) {
        res.json({task: obj});
    });
});


// Increment task progress by one step
router.put('/tasks/:id', function(req, res) {
    var task_id = req.params.id;
    var nowUtc = new Date().getTime();

    client.hincrby(task_id, 'currentStep', 1, function(err, reply) {
        res.json({currentStep: reply});
    });
});


// Delete task
router.delete('/tasks/:id', function(req, res) {
    var task_id = req.params.id;

    client.del(task_id, function(err, reply) {
        res.sendStatus(200);
    });
});


module.exports = router;
