$(document).ready(function () {
  renderRecentSearchBtns(retrieveRecentSearches());

  $(document).foundation();

  $("#add-movie").on("click", function (event) {
    event.preventDefault();
    var movie = storeRecentSearches(retrieveRecentSearches());
    renderRecentSearchBtns(retrieveRecentSearches());
    getMovieDetails(movie);
  });

  $(document).on("click", ".recent-search", getMovieClicked);

  function getMovieClicked() {
    getMovieDetails($(this).attr("movie-name"));
  }

  function storeRecentSearches(recentSearches) {
    var movie = $("#movie-input").val().trim();
    if (movie === "") {
      return;
    }
    recentSearches.push(movie);
    if (recentSearches.length > 3) {
      recentSearches = recentSearches.slice(1);
    }
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
    return movie;
  }

  function retrieveRecentSearches() {
    var storedSearches = JSON.parse(localStorage.getItem("recentSearches"));
    if (storedSearches === null) {
      return [];
    }
    return storedSearches;
  }

  function renderRecentSearchBtns(recentSearches) {
    $("#recent-search-btns").empty();
    for (var i = 0; i < 3; i++) {
      if (recentSearches[i] === undefined) {
        return;
      }
      var newButton = $("<button>");
      newButton.addClass("button secondary recent-search");
      newButton.attr("movie-name", recentSearches[i]);
      newButton.text(recentSearches[i]);
      $("#recent-search-btns").prepend(newButton);
    }
  }

  function getMovieDetails(movie) {
    var queryURL = "https://www.omdbapi.com/?t=" + movie + "&apikey=trilogy";
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (omdbResponse) {
      renderMainMovie(omdbResponse,movie);
      renderActorsTab(omdbResponse);
      renderCrewTab(omdbResponse);
      renderSimilarMoviesTab(movie);
    });
  }

  function renderMainMovie(omdbResponse,movie) {
    $("#body-container").css("display", "block");
    $("#main-film-poster").attr("src", omdbResponse.Poster);
    $("#main-film-name").text(
      omdbResponse.Title + " (" + omdbResponse.Year + ")"
    );
    $("#main-film-synopsis").text(omdbResponse.Plot);
    nyTimes(movie);
  }

  function renderActorsTab(omdbResponse) {
    $("#actorsTab").empty();
    // Remove modals content
    $(".reveal-overlay").empty();
    // Converting actor string into array
    var actorArray = omdbResponse.Actors.split(",");
    // For loop that create actors images and their related infomation
    for (var i = 0; i < actorArray.length; i++) {
      var actorName = actorArray[i].trim();
      fetchActorImg(actorName, i);
      fetchActorInfo(actorName, i);
    }
  }

  function fetchActorImg(name, i) {
    var imdbIdUrl = {
      async: true,
      crossDomain: true,
      url:
        "https://imdb-internet-movie-database-unofficial.p.rapidapi.com/search/" +
        name,
      method: "GET",
      headers: {
        "x-rapidapi-key": "f1b3cbe9c3msh648456feaa198ebp1d2da3jsnc55cec980b8a",
        "x-rapidapi-host":
          "imdb-internet-movie-database-unofficial.p.rapidapi.com",
      },
    };
    $.ajax(imdbIdUrl).done(function (imdbResponse) {
      setActorImg(imdbResponse, i);

      $(document).foundation();
    });
  }

  function setActorImg(imdbResponse, i) {
    var newImg = $("<img>");

    newImg.addClass("thumbnail");
    newImg.css({ width: "150px", height: "150px" });
    newImg.attr({
      id: "actorImg" + i,
      src: imdbResponse.names[0].image,
      alt: imdbResponse.names[0].title,
      "data-tooltip": "",
      tabindex: "2",
      title: imdbResponse.names[0].title,
    });

    $("#actorsTab").append(newImg);

    $(document).foundation();
  }

  function fetchActorInfo(name, i) {
    var apiKey = "OXs37W7S5QcenGqKB1COIMhZ7KybW7p6exHAYP7H";
    var queryURL =
      "https://api.celebrityninjas.com/v1/search?limit=1&name=" + name;
    $.ajax({
      method: "GET",
      url: queryURL,
      headers: { "X-Api-Key": apiKey },
      contentType: "application/json",
      success: function (celebNinjasResponse) {
        actorsModals(celebNinjasResponse, name, i);

        $(document).foundation();
      },
      error: function ajaxError(jqXHR) {
        console.error("Error: ", jqXHR.celebNinjasResponseText);
      },
    });
  }

  function actorsModals(celebNinjasResponse, name, i) {
    var age = celebNinjasResponse[0].age;
    var birthday = celebNinjasResponse[0].birthday;
    var nationality = celebNinjasResponse[0].nationality;
    var occupation = celebNinjasResponse[0].occupation;
    // Creating modals when actors images are clicked
    modalDiv = $("<div>");
    modalDiv.addClass("small reveal");
    modalDiv.attr({ "data-reveal": "", id: "actorInfo0" + i });
    $("#actorImg" + i).attr("data-open", "actorInfo0" + i);
    modalDiv.append("<h2 id=actorName></h2>");
    modalDiv.append("<div id=actorInfo></div>");
    modalDiv.append(
      "<button class=close-button data-close aria-label=Close modal type=button><span aria-hidden=true>&times;</span></button>"
    );
    $("#actorsTab").append(modalDiv);
    $("#actorName").text(name);
    $("#actorInfo").html(
      "<b>Age: </b>" +
        age +
        "<br>" +
        "<b>Birthday : <b/>" +
        birthday +
        "<br>" +
        "<b>Nationality : </b>" +
        nationality +
        "<br>" +
        "<b>Occupation : </b>" +
        occupation
    );
  }

  function renderCrewTab(omdbResponse) {
    $("#crewTab").empty();
    $(".reveal-overlay").empty();

    var directorArray = omdbResponse.Director.split(",");

    for (var i = 0; i < directorArray.length; i++) {
      var directorName = directorArray[i].trim();
      fetchDirectorImg(directorName, i);
      fetchDirectorInfo(directorName, i);
    }
  }

  function fetchDirectorImg(name, i) {
    var imdbIdUrl = {
      async: true,
      crossDomain: true,
      url:
        "https://imdb-internet-movie-database-unofficial.p.rapidapi.com/search/" +
        name,
      method: "GET",
      headers: {
        "x-rapidapi-key": "f1b3cbe9c3msh648456feaa198ebp1d2da3jsnc55cec980b8a",
        "x-rapidapi-host":
          "imdb-internet-movie-database-unofficial.p.rapidapi.com",
      },
    };
    $.ajax(imdbIdUrl).done(function (imdbResponse) {
      setDirectorImg(imdbResponse, i);

      $(document).foundation();
    });
  }

  function setDirectorImg(imdbResponse, i) {
    var newImg = $("<img>");

    newImg.addClass("thumbnail");
    newImg.css({ width: "150px", height: "150px" });
    newImg.attr({
      id: "directorImg" + i,
      src: imdbResponse.names[0].image,
      alt: imdbResponse.names[0].title,
      "data-tooltip": "",
      tabindex: "2",
      title: imdbResponse.names[0].title,
    });

    $("#crewTab").append(newImg);

    $(document).foundation();
  }

  function fetchDirectorInfo(name, i) {
    var apiKey = "OXs37W7S5QcenGqKB1COIMhZ7KybW7p6exHAYP7H";
    var queryURL =
      "https://api.celebrityninjas.com/v1/search?limit=1&name=" + name;
    $.ajax({
      method: "GET",
      url: queryURL,
      headers: { "X-Api-Key": apiKey },
      contentType: "application/json",
      success: function (celebNinjasResponse) {
        directorModals(celebNinjasResponse, name, i);

        $(document).foundation();
      },
      error: function ajaxError(jqXHR) {
        console.error("Error: ", jqXHR.responseText);
      },
    });
  }

  function directorModals(celebNinjasResponse, name, i) {
    var age = celebNinjasResponse[0].age;
    var birthday = celebNinjasResponse[0].birthday;
    var nationality = celebNinjasResponse[0].nationality;
    var occupation = celebNinjasResponse[0].occupation;

    modalDiv = $("<div>");
    modalDiv.addClass("small reveal");
    modalDiv.attr({ "data-reveal": "", id: "directorInfo0" + i });
    $("#directorImg" + i).attr("data-open", "directorInfo0" + i);
    modalDiv.append("<h2 id=directorName></h2>");
    modalDiv.append("<div id=directorInfo></div>");
    modalDiv.append(
      "<button class=close-button data-close aria-label=Close modal type=button><span aria-hidden=true>&times;</span></button>"
    );
    $("#crewTab").append(modalDiv);
    $("#directorName").text(name);
    $("#directorInfo").html(
      "<b>Age: </b>" +
        age +
        "<br>" +
        "<b>Birthday : <b/>" +
        birthday +
        "<br>" +
        "<b>Nationality : </b>" +
        nationality +
        "<br>" +
        "<b>Occupation : </b>" +
        occupation
    );
  }

  function renderSimilarMoviesTab(movie) {
    $.ajax({
      type: "GET",
      url: "https://tastedive.com/api/similar?limit=4",
      jsonp: "callback",
      dataType: "jsonp",
      data: {
        type: "movie",
        q: movie,
        k: "400900-Popcornp-N9NY6GRY",
      },

      success: function (tasteDiveResponse) {
        fetchPosters(tasteDiveResponse);
      },
    });
  }

  function fetchPosters(tasteDiveResponse) {
    $("#filmsTab").empty();

    for (var i = 0; i < 4; i++) {
      var queryURL =
        "https://www.omdbapi.com/?t=" +
        tasteDiveResponse.Similar.Results[i].Name +
        "&apikey=trilogy";
      $.ajax({
        url: queryURL,
        method: "GET",
      }).then(function (omdbResponse) {
        displayPosters(omdbResponse);
      });
    }
  }

  function displayPosters(omdbResponse) {
    var newImg = $("<img>");

    newImg.addClass("thumbnail SuggestedFilmImg");
    newImg.css({ width: "150px", height: "150px" });
    newImg.attr({
      src: omdbResponse.Poster,
      alt: omdbResponse.Title,
      "data-tooltip": "",
      tabindex: "2",
      title: omdbResponse.Title,
    });

    $("#filmsTab").append(newImg);
  }


  function nyTimes(movie) {
    var url = "https://api.nytimes.com/svc/movies/v2/reviews/search.json";
    url +=
      "?" +
      $.param({
        "api-key": "yZy7D7qdolnKnRDtSuRYxUWeYDF1hyVr",
        query: movie,
      });

      $.ajax({
        url: url,
        method: "GET",
      })

      .done(function (nyTimesResponse) {
        $("#film-review").text(nyTimesResponse.results[0].summary_short);
      console.log (nyTimesResponse.results[0].byline);
      })
      .fail(function (err) {
        throw err;
      });
      
  }
 



});
