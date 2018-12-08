var app = {
  winners: [],
  contestants: [],
  blacklistedAuthors: [
    '[deleted]',
    'AutoModerator'
  ],

  fireworks: new Fireworks(document.getElementById('fireworks'), {
    maxRockets: 3,
    rocketSpawnInterval: 150,
    numParticles: 100,
    explosionMinHeight: 0.2,
    explosionMaxHeight: 0.9,
    explosionChance: 0.08
  }),

  init: function () {
    app.exampleHandler()
    app.formHandler()
  },

  exampleHandler: function () {
    $('.btn-example').on('click', function (e) {
      e.preventDefault()

      $('.raog-form').find('input').val('https://www.reddit.com/r/RandomActsOfGaming/comments/26o1hd/giveaway_watch_dogs_for_pc/')

      $('.btn-get-winner.btn-submit').click()
      $('.btn-example').prop('disabled', true)
    })
  },

  toggleProgressBar: function () {
    var $progressBar = $('.progress-bar')

    if ($progressBar.hasClass('progress-bar-animated')) {
      $progressBar.removeClass('progress-bar-animated')
      $progressBar.animate({ opacity: 0 }, 300)
    } else {
      $progressBar.addClass('progress-bar-animated')
      $progressBar.animate({ opacity: 1 }, 300)
    }
  },

  formHandler: function () {
    var $input = $('.raog-form input')
    var $getWinner = $('.btn-get-winner')

    $getWinner.on('click', function (e) {
      e.preventDefault()

      if (app.contestants.length) {
        return app.showWinner()
      }

      var url = $input.val()

      if (!url || url === '' || !url.includes('reddit.com/r/RandomActsOfGaming')) {
        return utilities.showError('You need to provide a URL to a reddit.com/r/randomactsofgaming post -or- click the "Example" button.')
      }

      app.toggleProgressBar()

      var postURL = 'https://api.reddit.com' + url.split('reddit.com')[1]

      app.getPostData(postURL)
    })
  },

  getPostData: function (postURL) {
    $.get(postURL, function (data) {
      app.transformUserData(data[1].data.children)
      app.toggleProgressBar()
      app.updateSubmitButtonText('Get another winner')
      utilities.resetError()
    }).fail(function () {
      utilities.showError('Something went wrong. Please refresh and try again.')
    })
  },

  updateSubmitButtonText: function (buttonText) {
    $('.btn-submit').text(buttonText)
  },

  transformUserData: function (data) {
    data.forEach(function (user) {
      var userData = user.data

      app.blacklistedAuthors.forEach(function (blacklistedAuthor) {
        if (userData.author === blacklistedAuthor) return

        return app.contestants.push({
          body: userData.body,
          author: userData.author,
          commentPermalink: userData.permalink
        })
      })
    })

    app.showWinner()
  },

  showWinner: function () {
    var alreadyWon = false
    var winner = app.contestants[utilities.randomNumberInRange(0, app.contestants.length)]

    app.fireworks.fire()

    app.winners.forEach(function (user) {
      if (user.author === winner.author && user.body === winner.body) {
        alreadyWon = true
      }
    })

    if (!alreadyWon) {
      app.winners.push(winner)
    } else {
      return app.showWinner()
    }

    $('.winners').append(
      '<div class="card bg-light winner">' +
        '<div class="card-body">' +
          '<h5 class="card-title">' +
            '<a href="https://www.reddit.com/user/' + winner.author + '" target="_blank">' +
              winner.author +
            '</a>' +
          '</h5>' +
          '<p class="card-text">' + new showdown.Converter().makeHtml(winner.body) + '</p>' +
        '</div>' +
        '<div class="card-footer bg-transparent">' +
          '<a href="https://www.reddit.com' + winner.commentPermalink + '" target="_blank">' +
            'Permalink' +
          '</a>' +
        '</div>' +
      '</div>'
    )
  }
}

app.init()
