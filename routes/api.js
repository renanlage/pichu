var router = require('express').Router(),
    client = require('redis').createClient(),
    uuid = require('node-uuid');

var STATE = {
    PROGRESS: 'PROGRESS',
    FAILURE: 'FAILURE'
};
var TTL = 43200;

var Task = function(total, extra) {
    var nowUtc = new Date().getTime();
    this.current = 0;
    this.total = total;
    this.dateCreated = nowUtc;
    this.dateUpdated = nowUtc;
    this.state = STATE.PROGRESS;

    if (extra !== undefined) {
        this.extra = extra;
    }
};

// Redis key -> value format:
// taskId -> {current: int, total: int, extra: object,
//            dateCreated: utc, dateUpdated: utc}


// Get all tasks
router.get('/tasks', function(req, res) {
    res.json('lala');
});

// Initialize a new task in redis
router.post('/tasks', function(req, res) {
    var json = req.body,
        task = new Task(json.total, json.extra),
        id = json.identifier || uuid.v1();

    client.multi().hmset(id, task, function(err, reply) {
        res.status(201).json({id: id});
    }).expire(id, TTL).exec();
});

// Get tasks progress and details by id
router.get('/tasks/:id', function(req, res) {
    var id = req.params.id;

    client.hgetall(id, function(err, task) {
        if (task.fail) {

        }
        res.json({task: obj});
    });
});


// Increment task progress
router.put('/tasks/:id', function(req, res) {
    var id = req.params.id,
        json = req.body,
        failure = req.body.failure || false;

    if (failure) {
        res.json({})
    }

    var incrementBy = req.query.increment || 1;
    var nowUtc = new Date().getTime();

    client.hincrby(id, 'current', incrementBy, function(err, reply) {
        res.json({current: reply});
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
