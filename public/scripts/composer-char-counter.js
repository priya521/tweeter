//function controls counter behaviour upon entry of text into tweet-text box
$(document).ready(function () {
  $("#tweet-text").on('keyup', function () {
    const numOfCharacters = $("#tweet-text").val().length;
    console.log(numOfCharacters);
    const max = 140;
    const remainingChar = max - numOfCharacters;
    const remainingElem = $("#tweet-counter").text(remainingChar);
    remainingElem.toggleClass("red-font", (remainingChar < 0));
  });
});


