$(document).ready(() => {
  const $body = $('body');
  $body.html('');

  // Styling for a dark, edgy theme
  $body.css({
    'background-color': '#121212',
    'color': '#e0e0e0',
    'font-family': 'Roboto, sans-serif'
  });

  // Header image container
  const $div = $('<div>').attr('id', 'logo-image-container').attr('class', 'image-container');
  const $img = $('<img>')
    .attr('id', 'logo-image')
    .attr('src', 'https://lumiere-a.akamaihd.net/v1/images/image_67b709e4.jpeg?region=0,0,1536,864&width=768')
    .css({
      'width': '150px',
      'border-radius': '50%',
      'box-shadow': '0 0 15px rgba(255, 0, 0, 0.5)',
    });
  $img.appendTo($div);
  $div.appendTo($body);

  // Input and button styling
  const $input = $('<button>')
    .attr('class', 'marked')
    .width('70px')
    .height('30px')
    .text('Refresh')
    .css({
      'background-color': '#333',
      'color': '#e74c3c',
      'border': '1px solid #e74c3c',
      'border-radius': '5px',
      'padding': '5px 15px',
      'cursor': 'pointer'
    });
  $input.appendTo($body);

  const $inputTextBox = $('<textarea>')
    .attr('class', 'textBox')
    .attr('placeholder', 'Send a Message')
    .width('200px')
    .height('30px')
    .css({
      'background-color': '#1e1e1e',
      'color': '#e0e0e0',
      'border': '1px solid #444',
      'padding': '10px',
      'border-radius': '5px'
    });
  $inputTextBox.appendTo($body);

  const $inputSendButton = $('<button>')
    .attr('class', 'sendButton')
    .width('70px')
    .height('30px')
    .text('Send')
    .css({
      'background-color': '#333',
      'color': '#e74c3c',
      'border': '1px solid #e74c3c',
      'border-radius': '5px',
      'padding': '5px 15px',
      'cursor': 'pointer'
    });
  $inputSendButton.appendTo($body);

  // Tweet box container styling
  const $tweetbox = $('<div>').attr('id', 'tweetbox').css({
    'padding': '20px',
    'margin-top': '20px',
  }).appendTo($body);

  // Function to create tweets with emoji reactions and timestamps
  function tweetmaker(tweets) {
    const $tweets = tweets.map((tweet) => {
      const $tweet = $('<div></div>');
      const text1 = `@${tweet.user}: `;
      const text2 = `${tweet.message} ${dayjs(tweet.created_at).format('MMMM D, YYYY h:mm A')} (${dayjs(tweet.created_at).fromNow()})`;

      // Username and message styling within each tweet
      $('<p>').attr('class', 'clickableName')
        .css('color', '#e74c3c')
        .text(text1)
        .appendTo($tweet);
      $('<p>').text(text2).css({
        'color': '#b3b3b3'
      }).appendTo($tweet);

      // Emoji reactions container
      const $emojiContainer = $('<div>').attr('class', 'emoji-container').css({
        'display': 'flex',
        'gap': '10px',
        'margin-top': '10px',
        'font-size': '1.2em',
      });

      // Add emojis with click functionality for red border
      const emojis = ['👍', '😂', '❤️', '🔥', '😮'];
      emojis.forEach((emoji) => {
        const $emoji = $('<span>')
          .text(emoji)
          .css({
            'cursor': 'pointer',
            'padding': '5px',
            'border-radius': '5px',
            'transition': 'transform 0.2s',
            'color': '#e0e0e0'
          })
          .on('click', function() {
            // Toggle red box around clicked emoji
            $(this).toggleClass('emoji-selected');
          });
        $emojiContainer.append($emoji);
      });

      $emojiContainer.appendTo($tweet);

      // Tweet container styling with red glow
      $tweet.attr('id', tweet.user)
        .attr('class', 'aTweet')
        .css({
          'background-color': '#1e1e1e',
          'border': '1px solid #444',
          'color': '#e0e0e0',
          'padding': '10px',
          'border-radius': '5px',
          'margin-bottom': '10px',
          'box-shadow': '0 0 15px rgba(255, 0, 0, 0.5)', // Red glow
        });

      return $tweet;
    });

    // Clear existing tweets and append new ones at the top
    $tweetbox.prepend($tweets);
  }

  // Initial call to load tweets
  tweetmaker(streams.home);

  // Button hover effects for interactivity
  $('button').hover(
    function() {
      $(this).css({
        'background-color': '#e74c3c',
        'color': '#121212',
        'box-shadow': '0 0 10px rgba(255, 0, 0, 0.8)'
      });
    },
    function() {
      $(this).css({
        'background-color': '#333',
        'color': '#e74c3c',
        'box-shadow': 'none'
      });
    }
  );

  // Refresh button functionality (loads tweets)
  $('.marked').on('click', () => {
    tweetmaker(streams.home);
  });

  // Send button functionality (adds new tweet to the top)
  $('.sendButton').on('click', () => {
    const newMessage = {
      user: 'You',
      message: $inputTextBox.val(),
      created_at: new Date()
    };
    streams.home.unshift(newMessage); // Add new tweet at the top
    tweetmaker(streams.home);
    $inputTextBox.val(''); // Clear the input after sending
  });

  // Filter by user on click (shows that user's timeline)
  $tweetbox.on('click', '.clickableName', function() {
    const username = $(this).closest('.aTweet').attr('id');
    const filteredTweets = streams.home.filter((tweet) => tweet.user === username);
    tweetmaker(filteredTweets);

    // Add a "Back to Home" button
    const $backButton = $('<button>')
      .text('Back to Home')
      .css({
        'background-color': '#333',
        'color': '#e74c3c',
        'border': '1px solid #e74c3c',
        'border-radius': '5px',
        'padding': '5px 15px',
        'cursor': 'pointer',
        'margin-top': '10px'
      })
      .on('click', () => {
        tweetmaker(streams.home); // Display home timeline again
        $backButton.remove(); // Remove the back button
      });
    $tweetbox.prepend($backButton);
  });
});

// CSS for selected emoji box
const style = $('<style>')
  .text(`
    .emoji-selected {
      border: 2px solid #e74c3c;
      border-radius: 5px;
      padding: 5px;
    }
  `);
$('head').append(style);
