((window) ->

  # Let's make friends with Javascript
  'use strict'

  # Our crazy object
  Hangman =
    i18n:
      win: 'Parabéns, você venceu'
      lose: 'Você perdeu :('


    # setup the game
    setup: (elm) ->
      @startOver()
      @gameAnswer = @chooseWord()
      @gameShownAnswer = @blanksFromAnswer(@gameAnswer)
      @hangmanState = 0
      @drawWord @gameShownAnswer

      # Default sequence of drawing the hangman
      @drawSequence = [
        this.drawHead
        this.drawTorso
        this.drawLeftArm
        this.drawRightArm
        this.drawLeftLeg
        this.drawRightLeg
      ]

      # Start listening to the keypresses
      return  unless elm
      that = this
      $(elm).on 'keyup', ->
        that.keypress $(elm)
        return

      return


    # reset the game
    startOver: ->
      $('.body-part').remove()
      $('.guessed-letter').remove()
      $('.shown-letter').remove()
      return


    # happens when the user wins the game
    win: ->
      alert @i18n.win
      @setup()
      return


    # happens once the man is totally hung
    lose: ->
      alert @i18n.lose
      @setup()
      return


    # User inputted words, developed in the future
    inputWords: ->
      false


    # Default words in case no input was given
    words: ->
      [
        'gato'
        'cachorro'
        'sapo'
        'elefante'
        'girafa'
        'pinguim'
      ] or @inputWords

    chooseWord: ->
      w = @words()
      w[Math.floor(Math.random() * w.length)]

    blanksFromAnswer: (answerWord) ->
      result = ''
      for i of answerWord
        result = '_' + result
      result

    # Where to alter
    alterAt: (index, letter, originalString) ->
      originalString.substr(0, index) + letter + originalString.substr(index + 1, originalString.length)


    # Guessing which word, returns shown
    guessLetter: (letter, shown, answer) ->
      return  unless letter # failsafe to not lock the browser... stupid loops
      checkIndex = 0
      checkIndex = answer.indexOf(letter)
      while checkIndex >= 0
        shown = @alterAt(checkIndex, letter, shown)
        checkIndex = answer.indexOf(letter, checkIndex + 1)
      shown


    # Updates the field with the wrong letter typed in
    wrongLetter: (letter) ->
      $('#wrong-letters').append $('<span/>').addClass('guessed-letter').text(letter)
      return


    # Update the word with the right letter that was typed in
    updateWord: (answer) ->
      $k = $('.shown-letter').first()
      for i of answer
        if answer.charAt(i) isnt '_'

          # if the right letter was typed, insert it in the right place
          $k.text answer.charAt(i)
        else

          # if the wrong letter was typed, just leave the place blank
          $k.html '&nbsp;'

        # go to the next field of the words
        $k = $k.next()
      return


    #
    #    / In each keypress, we check:
    #    /   1. If the letter exists in the word
    #    /   2. If the letter was already guessed
    #    /   3. If the letter is the last one in the word
    #    /   4. If it's the last one, check if either won or lose
    #
    keypress: (elm) ->

      # if nothing is pressed, please don't fuck the app
      return  if not elm or not elm.val()

      # now keep going
      tempChar = $(elm).val().toLowerCase()
      tempString = ''
      $(elm).val ''
      tempString = @guessLetter(tempChar, @gameShownAnswer, @gameAnswer)
      if tempString isnt @gameShownAnswer
        @updateWord tempString
        @gameShownAnswer = tempString
        @win()  if @gameShownAnswer is @gameAnswer
      else
        @wrongLetter tempChar
        @drawSequence[@hangmanState++]()
        @lose()  if @hangmanState is @drawSequence.length
      return


    # Drawing method specifically the word itself
    drawWord: (answer) ->
      for i of answer
        $('.word-display').append $('<span/>').addClass('shown-letter').html('&nbsp;')
      return


    # Drawing hangman figure methods
    drawHead: ->
      $('.draw-area').append $('<div/>').addClass('body-part head')
      return

    drawTorso: ->
      $('.draw-area').append $('<div/>').addClass('body-part armbox').append($('<div/>').addClass('body-part torso'))
      $('.draw-area').append $('<div/>').addClass('body-part legbox').append($('<div/>').addClass('body-part pelvis'))
      return

    drawLeftArm: ->
      $('.armbox').prepend $('<div/>').addClass('body-part leftarm')
      return

    drawRightArm: ->
      $('.armbox').prepend $('<div/>').addClass('body-part rightarm')
      return

    drawLeftLeg: ->
      $('.legbox').prepend $('<div/>').addClass('body-part leftleg')
      return

    drawRightLeg: ->
      $('.legbox').prepend $('<div/>').addClass('body-part rightleg')
      return


  # API it out
  window.Hangman = Hangman
  return
) this

# Dom ready? Start the game.
$ ->
  'use strict'
  Hangman.setup '#letter-input' if window.Hangman # jshint still bitches about this
  return
