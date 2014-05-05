var Hangman = (function() {

  'use strict';

  var gameAnswer
    , gameShownAnswer
    , hangmanState
    , drawSequence
    , i18n = {
      win:  "Parabéns, você venceu",
      lose: "Você perdeu :("
    };
  // end variable declarations

  // setup the game
  function setup() {
    startOver();
    gameAnswer = chooseWord();
    gameShownAnswer = blanksFromAnswer( gameAnswer );
    hangmanState = 0;
    drawWord( gameShownAnswer );

    // Default sequence of drawing the hangman
    drawSequence = [ drawHead, drawTorso, drawLeftArm, drawRightArm, drawLeftLeg, drawRightLeg ];
  }

  // reset the game
  function startOver() {
    $('.body-part').remove();
    $('.guessed-letter').remove();
    $('.shown-letter').remove();
  }

  // happens when the user wins the game
  function win() {
    alert( i18n.win );
    startOver();
  }

  // happens once the man is totally hung
  function lose() {
    alert( i18n.lose );
    startOver();
  }

  // User inputted words, developed in the future
  function inputWords() {
    return false;
  }

  // Default words in case no input was given
  function words() {
    return ['gato', 'cachorro', 'sapo', 'elefante', 'girafa', 'pinguim'] || inputWords;
  }

  function chooseWord() {
    var w = words();
    return w[ Math.floor( Math.random() * w.length ) ];
  }

  function blanksFromAnswer( answerWord ) {
    var result = "";
    for ( var i in answerWord ) {
      result = "_" + result;
    }
    return result;
  }

  // Where to alter
  function alterAt( n, c, originalString ) {
    return originalString.substr( 0, n ) + c + originalString.substr( n + 1, originalString.length );
  }

  // Guessing which word, returns shown
  function guessLetter( letter, shown, answer ) {
    var checkIndex = 0;
    checkIndex = answer.indexOf(letter);
    while( checkIndex >= 0 ) {
      shown = alterAt( checkIndex, letter, shown );
      checkIndex = answer.indexOf(letter, checkIndex + 1);
    }
    return shown;
  }

  // Updates the field with the wrong letter typed in
  function wrongLetter( letter ) {
    $('#wrong-letters').append(
      $('<span/>').addClass('guessed-letter').text(letter));
  }

  // Update the word with the right letter that was typed in
  function updateWord( answer ) {
    $k = $('.shown-letter:first');
    for ( var i in answer ) {
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
  }

  /*
  / In each keypress, we check:
  /   1. If the letter exists in the word
  /   2. If the letter was already guessed
  /   3. If the letter is the last one in the word
  /   4. If it's the last one, check if either won or lose
  */
  function keypress(elm) {
    if (!elm) return;
    var tempChar = $(elm).val().toLowerCase(),
        tempString = "";
    $(elm).val("");

    tempString = guessLetter( tempChar, gameShownAnswer, gameAnswer );
    if ( tempString != gameShownAnswer ) {
      updateWord( tempString );
      gameShownAnswer = tempString;
      if ( gameShownAnswer === gameAnswer ) {
        win();
      }
    } else {
      wrongLetter( tempChar );
      drawSequence[ hangmanState++ ]();
      if ( hangmanState === drawSequence.length ) {
        lose();
      }
    }

  }

  // Drawing method specifically the word itself
  function drawWord( answer ) {
    for ( var i in answer ) {
      $('.word-display').append(
        $('<span/>').addClass('shown-letter').html('&nbsp;'));
    }
  }

  // Drawing hangman figure methods
  function drawHead() {
    $('.draw-area').append( $('<div/>').addClass("body-part head") );
  }
  function drawTorso() {
    $('.draw-area').append(
      $('<div/>').addClass("body-part armbox").append(
        $('<div/>').addClass("body-part torso")));
    $('.draw-area').append(
      $('<div/>').addClass("body-part legbox").append(
        $('<div/>').addClass("body-part pelvis")));
  }
  function drawLeftArm() {
    $('.armbox').prepend( $('<div/>').addClass("body-part leftarm") );
  }
  function drawRightArm() {
    $('.armbox').prepend( $('<div/>').addClass("body-part rightarm") );
  }
  function drawLeftLeg() {
    $('.legbox').prepend( $('<div/>').addClass("body-part leftleg") );
  }
  function drawRightLeg() {
    $('.legbox').prepend( $('<div/>').addClass("body-part rightleg") );
  }


  // API

  return {
    setup: setup,
    startOver: startOver,
    win: win,
    lose: lose,
    inputWords: inputWords,
    words: words,
    chooseWord: chooseWord,
    blanksFromAnswer: blanksFromAnswer,
    alterAt: alterAt,
    guessLetter: guessLetter,
    wrongLetter: wrongLetter,
    updateWord: updateWord,
    keypress: keypress,
    drawWord: drawWord,
    drawHead: drawHead,
    drawLeftArm: drawLeftArm,
    drawRightArm: drawRightArm,
    drawLeftLeg: drawLeftLeg,
    drawRightLeg: drawRightLeg
  }

})();

// Listening the field for every input
// $('#letter-input').keyup( function() { Hangman.keypress(this); } );

// // Dom ready? Start the game.
// $(function() {
//   Hangman.setup();
// });
