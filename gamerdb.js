var Datastore = require('nedb')
  , db = new Datastore({ filename: 'gamer.db', autoload: true });
  db.persistence.setAutocompactionInterval(1000 * 30);

  function getUser(id) {
    return new Promise((resolve, reject) => {
        db.findOne({id}, (err,data) => {
               if(err) {
                      reject(err);
               } else {
                      resolve(data);
               }
        });
    });
}

function addUser(id, level, points, prev_status, status) {
  return new Promise((resolve, reject) => {
  db.insert({id, level, points, prev_status, status}, function (err, newDoc) {
if (err) {
  reject(err);
} else {
       resolve(newDoc);
}
    });
  });
  }

function updateUser(id, level, points, prev_status, status) {
  return new Promise((resolve, reject) => {
  db.update({id}, {id, level, points, prev_status, status}, {}, (err, result) => {
if (err) {
  reject(err);
} else {
       resolve(result);
}
  });
  });
}

module.exports.getUser = getUser;
module.exports.addUser = addUser;
module.exports.updateUser = updateUser;