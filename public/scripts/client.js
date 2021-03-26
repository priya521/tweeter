/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */




//escapes a string to prevent XSS attacks.
const escape = function (str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}



//renderTweets will be called in loadTweets to display all stored tweets in the app body.
$(document).ready(function () {
const renderTweets = function(tweets) {
for (let tweet of tweets) {
  const $tweet = createTweetElement(tweet);
  $('#tweets-container').append($tweet);
}
}



//This function creates the body of the app, with all posted tweets taking this format.
const createTweetElement = function(tweet) { 
let $tweet = `<article class="tweet-article"> 
    <header class="tweet-main">
    <figure class="tweet-avatar-container">
      <img class="tweetAvatar" src="${tweet.user.avatars}" alt="this is your avatar">
     <figcaption> <a class="user-name"> ${tweet.user.name} </a> </figcaption>
    </figure>
      <a class="user-handle"> ${tweet.user.handle}</a>
    </header>
    <p>${escape(tweet.content.text)}</p>
    <footer class="tweet-footer">
</span>
    <div class="tweet-details">
      <div class="tweet-age">
        <h6>${moment(tweet.created_at).fromNow()}</h6>
      </div>
      <div class="emoji-footers">
      <a href="#"><i class="fa fa-flag"></i></a>
      <a href="#"><i class="fa fa-retweet"></i></a>
      <a href="#"><i class="fa fa-heart"></i></a>
    </div>
    </footer>
  </article>`
  return $tweet;
}


const loadTweets = function () {
  console.log("loading posts");
  $.ajax({ url: "/tweets" })
    .then((res) => {
      renderTweets(res);
    })
}
loadTweets();
$("form").on('submit', function (event) {
  //prevents button from redirecting page
  event.preventDefault();
  //in the event of errors, this slides up the error messages when the submit button is pressed again.
  $("#content-error").slideUp('fast');
  $("#length-error").slideUp('fast');
  //when the counter is 140 characters when the button is clicked, we slide down an error showing that there is no text in the tweet box.
  if ($(".counter").val() == 140) {
    $("#content-error").slideDown('slow');
    //if the counter is less than 0, we slide down an error that tells the user they are past the limit for text, and set the counter to red.
  } else if ($(".counter").val() < 0) {
    $("#length-error").slideDown('slow');
    $(".counter").toggleClass('red-font');
    //For a successful button press. Serializes the ajax requests POST; asynchronously returns the loadTweets function with the new tweet content. Slides up any displayed error messages.
  } else {
    console.log("serialize", $(this).serialize());
    $.ajax({ url: '/tweets', method: 'POST', data: $(this).serialize() })
      .then((res) => {
        $("#content-error").slideUp('fast');
        $("#length-error").slideUp('fast');
        $("#tweet-text").val("");
        $("#tweet-counter").val(140);
        return loadTweets();
      })
  }
});

});
