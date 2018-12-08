var utilities = {
  $errorElement: $('.alert-danger'),

  randomNumberInRange: function (minimum, maximum) {
    minimum = Math.ceil(minimum)
    maximum = Math.floor(maximum)

    return Math.floor(Math.random() * (maximum - minimum)) + minimum
  },

  showError: function (message) {
    utilities.$errorElement.text(message)
    utilities.$errorElement.animate({
      opacity: 1
    }, 400)
  },

  resetError: function () {
    utilities.$errorElement.html('&npsp;')
    utilities.$errorElement.animate({
      opacity: 0
    }, 400)
  }
}
