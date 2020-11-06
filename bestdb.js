var Datastore = require('nedb')
  , db = new Datastore({ filename: 'best.db', autoload: true });
  db.persistence.setAutocompactionInterval(1000 * 30);

  function getBest(name) {
    return new Promise((resolve, reject) => {
        db.findOne({name}, (err,data) => {
               if(err) {
                      reject(err);
               } else {
                      resolve(data);
               }
        });
    });
}

function updateBest(name, points) {
  return new Promise((resolve, reject) => {
  db.update({name}, {name, points}, {upsert:true}, (err, result) => {
if (err) {
  reject(err);
} else {
       resolve(result);
}
  });
  });
}

function removeBest(name) {
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

function findAllBests() {
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

module.exports.getBest = getBest;
module.exports.updateBest = updateBest;
module.exports.removeBest = removeBest;
module.exports.findAllBests = findAllBests;