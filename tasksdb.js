var Datastore = require('nedb')
  , db = new Datastore({ filename: 'tasks.db', autoload: true });
  db.persistence.setAutocompactionInterval(1000 * 30);

function updateTask(name) {
  return new Promise((resolve, reject) => {
  db.update({name}, {name}, {upsert:true}, (err, result) => {
if (err) {
  reject(err);
} else {
       resolve(result);
}
  });
  });
}

function removeTask(name) {
  return new Promise((resolve, reject) => {
    db.remove({name}, {}, function (err, numRemoved) {
if (err) {
  reject(err);
} else {
       resolve(numRemoved);
}
    });
  });
  }

function findAllTasks() {
  return new Promise((resolve, reject) => {
  db.find({}, (err, result) => {
if (err) {
  reject(err);
} else {
       resolve(result);
}
      });
});
}

module.exports.updateTask = updateTask;
module.exports.removeTask = removeTask;
module.exports.findAllTasks = findAllTasks;