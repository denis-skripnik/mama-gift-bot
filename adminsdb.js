var Datastore = require('nedb')
  , db = new Datastore({ filename: 'admins.db', autoload: true });
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

function addUser(id, prev_status, status) {
  return new Promise((resolve, reject) => {
  db.insert({id, prev_status, status}, function (err, newDoc) {
if (err) {
  reject(err);
} else {
       resolve(newDoc);
}
    });
  });
  }

function updateUser(id, prev_status, status) {
  return new Promise((resolve, reject) => {
  db.update({id}, {id, prev_status, status}, {}, (err, result) => {
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