var Hangman = {
  i18n: { 
    win:  "Parabéns, você venceu",
    lose: "Você perdeu :("
  },
  
  // setup the game
  setup: function() {
    this.startOver();
    this.gameAnswer = this.chooseWord();
    this.gameShownAnswer = this.blanksFromAnswer( this.gameAnswer );
    this.hangmanState = 0;
    this.drawWord( this.gameShownAnswer );
    
    // Default sequence of drawing the hangman
    this.drawSequence = [ this.drawHead, this.drawTorso, this.drawLeftArm, this.drawRightArm, this.drawLeftLeg, this.drawRightLeg ];
  },

  // reset the game
  startOver: function() {
  	$('.body-part').remove();
    $('.guessed-letter').remove();
    $('.shown-letter').remove();
  },

  // happens when the user wins the game
  win: function() {
  	alert( this.i18n.win );
  	this.startOver();
  },

  // happens once the man is totally hung
  lose: function() {
  	alert( this.i18n.lose );
  	this.startOver();
  },

  // User inputted words, developed in the future
  inputWords: function() {
    return false;
  },

  // Default words in case no input was given
  words: function() {
    return ['gato', 'cachorro', 'sapo', 'elefante', 'girafa', 'pinguim'] || this.inputWords;
  },

  chooseWord: function() {
    var w = this.words();
    return w[ Math.floor( Math.random() * w.length ) ];
  },

  blanksFromAnswer: function( answerWord ) {  
    var result = ""; 
    for ( i in answerWord ) {
      result = "_" + result;
    }
    return result;
  },

  // Where to alter
  alterAt: function( n, c, originalString ) {
    return originalString.substr( 0, n ) + c + originalString.substr( n + 1, originalString.length );
  },

  // Guessing which word, returns shown
  guessLetter: function( letter, shown, answer ) {
    var checkIndex = 0;
    checkIndex = answer.indexOf(letter);
    while( checkIndex >= 0 ) {
      shown = this.alterAt( checkIndex, letter, shown );
      checkIndex = answer.indexOf(letter, checkIndex + 1);
    }
    return shown;
  },

  // Updates the field with the wrong letter typed in
  wrongLetter: function( letter ) {
    $('#wrong-letters').append(
      $('<span/>').addClass('guessed-letter').text(letter));
  },

  // Update the word with the right letter that was typed in
  updateWord: function( answer ) {
    $k = $('.shown-letter:first');
    for ( i in answer ) {
      if ( answer.charAt(i) != '_' ) {
        // if the right letter was typed, insert it in the right place
        $k.text( answer.charAt(i) );
      } else { 
        // if the wrong letter was typed, just leave the place blank
        $k.html('&nbsp;');
      }
      // go to the next field of the words
      $k = $k.next();
    }
  },

  /* 
  / In each keypress, we check:
  /   1. If the letter exists in the word
  /   2. If the letter was already guessed
  /   3. If the letter is the last one in the word
  /   4. If it's the last one, check if either won or lose
  */
  keypress: function(elm) {
    if (!elm) return;
    var tempChar = $(elm).val().toLowerCase(),
        tempString = "";
    $(elm).val("");

    tempString = this.guessLetter( tempChar, this.gameShownAnswer, this.gameAnswer );
    if ( tempString != this.gameShownAnswer ) {
      this.updateWord( tempString );
      this.gameShownAnswer = tempString;
      if ( this.gameShownAnswer === this.gameAnswer ) {
        this.win();
      }
    } else {
      this.wrongLetter( tempChar );
      this.drawSequence[ this.hangmanState++ ]();
      if ( this.hangmanState === this.drawSequence.length ) {
        this.lose();
      }
    }

  },

  // Drawing method specifically the word itself
  drawWord: function( answer ) {
    for ( i in answer ) {
      $('.word-display').append(
        $('<span/>').addClass('shown-letter').html('&nbsp;'));
    }
  },

  // Drawing hangman figure methods
  drawHead: function() {
    $('.draw-area').append( $('<div/>').addClass("body-part head") );
  },
  drawTorso: function() {
    $('.draw-area').append(
      $('<div/>').addClass("body-part armbox").append(
        $('<div/>').addClass("body-part torso")));
    $('.draw-area').append(
      $('<div/>').addClass("body-part legbox").append(
        $('<div/>').addClass("body-part pelvis")));
  },
  drawLeftArm: function() {
    $('.armbox').prepend( $('<div/>').addClass("body-part leftarm") );
  },
  drawRightArm: function() {
    $('.armbox').prepend( $('<div/>').addClass("body-part rightarm") );   
  },
  drawLeftLeg: function() {
    $('.legbox').prepend( $('<div/>').addClass("body-part leftleg") );   
  },
  drawRightLeg: function() {
    $('.legbox').prepend( $('<div/>').addClass("body-part rightleg") );   
  },

}

// Listening the field for every input
$('#letter-input').keyup( function() { Hangman.keypress(this); } );

// Dom ready? Start the game.
$(function() {
  Hangman.setup();
});
