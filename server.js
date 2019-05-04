var express = require("express");
var path = require("path");
var connection = require("./db/connection");


var app = express();
// Sets an initial port
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//set up routes
app.get("/",function(req,res){
  res.sendFile(path.join(__dirname,"./html/index.html"));
});
app.get("/notes",function(req,res){
  res.sendFile(path.join(__dirname,"./html/notes.html"));
});
app.get("/tables",function(req,res){
  res.sendFile(path.join(__dirname,"./html/tables.html"));
})
// get all tables
app.get('/api/tables', function(req, res) {
  // query db for all table data
  connection.query('SELECT * FROM notes', function(err, tableData) {
    if (err) {
      console.log(err);
    }
    // if no error, send back array of table data
    res.json(tableData);
    
  });
});
app.post('/api/tables', function(req, res) {
  
    connection.query('INSERT INTO notes SET ?', req.body, function(err, insertResult) {
      if (err) {
        console.log(err);
        
      }
      // if insert was successful
      res.json({ status: 'successful' });
    });
  });


//delete function 
app.delete("/api/tables/:id", function(req, res) {
  
  console.log("In DELETE: /api/tables/"+req.params.id);

  connection.query("DELETE FROM notes WHERE id = ?", [req.params.id], function(err, result) {

    if (err) {
        return res.status(500).end();
    }
    else if (result.affectedRows === 0) {
        return res.status(404).end();
    }
      res.status(200).end();
    });
});

app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});


