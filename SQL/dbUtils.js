var mysql = require('mysql');

var dbConnection = mysql.createConnection({
  user: "root",
  password: "oLXR8i26",
  database: "chat"
});

dbConnection.connect();


exports.getUserByName = function(messageData, callback) {
 dbConnection.query("SELECT id FROM users WHERE ?;", {username: messageData.username}, function(err, rows, fields) {
  if (err) {
    throw err;
  }
  if (rows.length > 0) {
    var userId = rows[0].id;
    callback(userId, messageData);
  } else {
      dbConnection.query("INSERT INTO users SET ?", {username: messageData.username}, function(err, result) {
        if (err) {
          throw err;
        }
        console.log("User added successfully to db.");
        var userId = result.insertId;
        callback(userId, messageData);
      });
    }
  });
};

exports.insertNewMessage = function(userId, messageData, callback) {
  dbConnection.query("INSERT INTO messages SET ?", {message: messageData.text, user_id: userId}, function(err, result) {
    if (err) {
      throw err;
    }
    console.log("Message added successfully to db.");
    if (callback) {
      var returnMsg = {objectId:result.insertId, username: messageData.username, text: messageData.text};
      console.log(returnMsg, result);
      callback(returnMsg);
    }
  });
};


exports.getAllMessages = function(callback) {
  dbConnection.query("SELECT u.username, m.message AS 'text', m.id AS 'objectId' , m.created_at AS 'createdAt' FROM messages m INNER JOIN users u ON (m.user_id = u.id);", function(err, result) {
    if (err) {
      throw err;
    }
    console.log("Messages successfully queried from db.");
    // console.log({results: result});
    callback({results: result});
  });  
};