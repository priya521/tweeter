
const escape =  function(str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

// Renders all tweets onto homepage
const renderTweets = function(tweets) {
  for (let tweet of tweets) {
    const tweetAppended = createTweetElement(tweet);
    $('.tweet-feed').prepend(tweetAppended);
  }
};

// Timestamp of when the tweet was created
const timeStamp = function(date) {
  let timeElapsedinSeconds = (Date.now() - date) / 1000;
  let minutesPassed = Math.floor(timeElapsedinSeconds /  (60));
  let hoursPassed = Math.floor(minutesPassed /  (60));
  let daysPassed = Math.floor(hoursPassed /  (24));

  if (daysPassed > 1) {
    return daysPassed + " days ago";
  }
  if (hoursPassed > 1) {
    return hoursPassed + " hours ago";
  } else {
    return minutesPassed + " minutes ago";
  }
};
/// New tweet html structure
const createTweetElement = function(tweet) {
  const $tweet = `
    <article class="tweet-article">
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
        <h6>${timeStamp(tweet.created_at)}</h6>
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

$(document).ready(function() {
  $(".error-slide").hide();
  const loadTweets = function() {
    $.ajax({
      url: "/tweets",
      method: "GET"
    }).then(result => {
      renderTweets(result);
    }).catch(err => {
      console.log("ajax error caught");
    });
  };
  loadTweets();

  // Events after tweet submission
  $("form").on("submit", function(event) {
    event.preventDefault();
    $("#content-error").slideUp('fast');
    $("#length-error").slideUp('fast');
    //when the counter is 140 characters when the button is clicked, we slide down an error showing that there is no text in the tweet box.
    if ($(".counter").val() == 140) {
      $("#content-error").slideDown('slow');
      
    }else if ($(".counter").val() < 0) {
      $("#length-error").slideDown('slow');
      $(".counter").toggleClass('red-font');
      return;
    }
  
    // Loads new tweet onto the page after posting
    const serializeData = $(this).serialize();
    $.ajax({
      url: "/tweets",
      method: "POST",
      data: serializeData
    })
      .then(() => {
        $.ajax({
          url: "/tweets",
          method: "GET"
        })
          .then((data) => {
            $("#content-error").slideUp('fast');
            $("#length-error").slideUp('fast');
            $("#tweet-counter").val(140);
            $("#tweet-text").val("");
            const $newTweet = createTweetElement(data[data.length - 1]);
            $(".tweet-feed").prepend($newTweet);
          } )
          .catch(err => {
            console.log("ajax error caught");
          });
      });
    
  });

});
























