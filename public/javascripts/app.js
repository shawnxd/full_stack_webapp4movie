var app = angular.module('angularjsNodejsTutorial', []);

app.controller('loginController', function($scope, $http) {
  $scope.verifyLogin = function() {

    var request = $http({
      url: '/login',
      method: "POST",
      data: {
        'username': $scope.username,
        'password': $scope.password
      }
    })

    request.success(function(response) {
      // success
      console.log(response);
      if (response.result === "success") {
        window.location.href = "http://localhost:8081/dashboard"
      }
    });
    request.error(function(err) {
      // failed
      console.log("error: ", err);
    });

  };
});

app.controller('dashboardDataController', function($scope, $http) {
  $scope.displayUsers = function() {
    
    var request = $http({
      url: '/dashboardData',
      method: "GET",
    })

    request.success(function(data) {
      // success
      $scope.users = data
    });
    request.error(function(err) {
      // failed
      console.log("error: ", err);
    });
  }

  $scope.displayGenres = function() {

    var request = $http({
      url: '/genreData',
      method: "GET",
    })

    request.success(function(data) {
      // success
      $scope.genres = data
    });
    request.error(function(err) {
      // failed
      console.log("error: ", err);
    });
  }

  $scope.displayMovies = function(genre) {

    var request = $http({
      url: '/topMoviesData/' + genre,
      method: "GET"
    })

    request.success(function(data) {
      // success
      $scope.genre = genre;
      $scope.movies = data;
    });
    request.error(function(err) {
      // failed
      console.log("error: ", err);
    });
  }

  $scope.displayUsers();
  $scope.displayGenres();

});

app.controller('movieRecsController', function($scope, $http) {
  $scope.getRecs = function(id) {

    var request = $http({
      url: '/movieRecs/' + id,
      method: "GET"
    })

    request.success(function(data) {
      // success
      $scope.movieRecs = data;
    });
    request.error(function(err) {
      // failed
      console.log("error: ", err);
    });
  }

});

app.controller('bestOfController', function($scope, $http) {
  var years = [];
  for (var i = 2000; i < 2018; i++) {
    years.push(i);
  }
  $scope.years = years;

  $scope.getBest = function(year) {

    var request = $http({
      url: '/bestOf/' + year,
      method: "GET"
    })

    request.success(function(data) {
      // success
      $scope.best = data;
      console.log("data here");
      console.log($scope.best);
    });
    request.error(function(err) {
      // failed
      console.log("error: ", err);
    });
  }
});

app.controller('postersController', function($scope, $http) {

  $scope.getTitles = function() {

    var request = $http({
      url: '/titles',
      method: "GET"
    })

    request.success(function(data) {
      $scope.movies = [];
      angular.forEach(data, function(row){
        var request_info = $http({
          url: 'http://www.omdbapi.com/?apikey='+'&i='+row.imdb_id,
          method: "GET"
        })

        request_info.success(function(info) {
          var temp = [];
          temp.push(info.Title);
          temp.push(info.Poster);
          // check valid website -- if N/A, put empty string
          if (info.Website.localeCompare("N/A") == 0) {
            temp.push("");
          }
          else {
            temp.push(info.Website);
          }
          $scope.movies.push(temp);
        });

      });
    });
    request.error(function(err) {
      // failed
      console.log("error: ", err);
    });
  }

  $scope.getPoster = function(imdb_id, index) {

    var request = $http({
      url: 'http://www.omdbapi.com/?apikey=fb35b5a2&i='+imdb_id,
      method: "GET"
    })

    request.success(function(data) {
      // success
      $scope.movie1 = data;
      $scope.movie2 = [];
    });
    request.error(function(err) {
      // failed
      console.log("error: ", err);
    });
  }

  $scope.verifyWebsite = function(index) {

    movie = $scope.movies[index];
    website = movie[2];

    if (website.length != 0) {
      window.open(website, '_blank');
    }
  };

  $scope.getTitles();
  // $scope.getPosters('tt1039652');

});

// Template for adding a controller
/*
app.controller('dummyController', function($scope, $http) {
  // normal variables
  var dummyVar1 = 'abc';

  // Angular scope variables
  $scope.dummyVar2 = 'abc';

  // Angular function
  $scope.dummyFunction = function() {

  };
});
*/
