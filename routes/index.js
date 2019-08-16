var express = require('express');
var router = express.Router();
var path = require('path');

// Connect string to MySQL
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'fling.seas.upenn.edu',
  user: '',
  password: '',
  database: ''
});

connection.connect(function(err) {
  if (err) {
    console.log("Error Connection to DB" + err);
    return;
  }
  console.log("Connection established...");
});

/* GET home page. */
router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'login.html'));
});

router.get('/dashboard', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'dashboard.html'));
});

router.get('/reference', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'reference.html'));
});

router.get('/recommendations', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'recommendations.html'));
});

router.get('/best-of', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'best-of.html'));
});

router.get('/posters', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'posters-test.html'));
});

// Templete for adding a new page
/*
router.get('/routeName', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'fileName.html'));
});
*/

router.post('/login', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  var query = "REPLACE INTO User VALUES ('" + username + "','" + password + "');";
  connection.query(query, function(err, rows, fields) {
    console.log("rows", rows);
    console.log("fields", fields);
    if (err) console.log('insert error: ', err);
    else {
      res.json({
        result: 'success'
      });
    }
  });
});

router.get('/dashboardData', function(req, res) {

  var query = 'SELECT * FROM User';

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
});

router.get('/genreData', function(req, res) {

  var query = 'SELECT DISTINCT(genre) FROM Genres';

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
});

router.get('/topMoviesData/:genre', function(req, res) {

  var genre = req.params.genre;
  var query = "SELECT m.title AS Title, m.rating AS Rating, m.vote_count as Votes " + 
              "FROM Genres g JOIN Movies m ON g.movie_id=m.id WHERE g.genre='"+genre+"' AND m.id=g.movie_id " +
              "ORDER BY m.rating DESC, m.vote_count DESC LIMIT 10;";
  console.log(genre);
  console.log(query);

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
});

router.get('/movieRecs/:id', function(req, res) {

  var id = req.params.id;
  // set of genres of the movie
  var query = "SELECT genre FROM Genres WHERE movie_id='"+id+"';";
  console.log(id);
  console.log(query);

  connection.query(query, function(err, rows, fields) {
    console.log(rows);

    if (err) console.log(err);
    else if (rows.length == 0) {
      console.log("here");
      res.json(rows);
    }
    else {

      // subquery -- populate dict until its size = 10
      var dict = {};

      // iterate over each genre of the movie to add one random movie
      for (var j = 0; j < 10; j += rows.length) {
          for (var i = 0; i < rows.length; i++) {

            var query2 = "SELECT m.title, g.genre " +
                         "FROM Movies m JOIN Genres g ON m.id=g.movie_id " +
                         "WHERE m.id!='" + id + "' AND g.genre='" + rows[i].genre + "' " +
                         "ORDER BY RAND() " +
                         "LIMIT 1;";
            
            connection.query(query2, function(err, rows2, fields) {
              if (err) console.log(err);
              else {
                var title = rows2[0].title;
                var genre = rows2[0].genre;
                dict[title] = genre;
                
                if (Object.keys(dict).length == 10) {
                  var result = [];
                  for (var k in dict) {
                    var v = dict[k];
                    result.push(k + " (" + v + ")");
                  }
                  console.log(result);
                  res.json(result);
                }
              }
            });

          }
      }
    }
  });
});

router.get('/bestOf/:year', function(req, res) {

  var year = req.params.year;

  console.log(year)

  var query = "SELECT g.genre, m.title, m.vote_count " +
              "FROM Genres g JOIN Movies m ON g.movie_id=m.id " +
              "WHERE m.release_year='"+year+"' AND m.vote_count= "+
                  "(SELECT MAX(m2.vote_count) " +
                  "FROM Genres g2 JOIN Movies m2 ON g2.movie_id=m2.id " +
                  "WHERE m2.release_year=m.release_year AND g2.genre=g.genre)" +
              "ORDER BY g.genre;";

  console.log(query);

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
});

router.get('/titles', function(req, res) {

  var query = "SELECT title, imdb_id " +
              "FROM Movies " +
              "ORDER BY RAND() " +
              "LIMIT 12;";

  console.log(query);

  connection.query(query, function(err, rows, fields) {
    if (err) {
      console.log(err);
    }
    else {
      console.log(rows);
      res.json(rows);
    }
  });
});


// template for GET requests
/*
router.get('/routeName/:customParameter', function(req, res) {

  var myData = req.params.customParameter;    // if you have a custom parameter
  var query = '';

  // console.log(query);

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
});
*/

module.exports = router;
