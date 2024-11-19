$(document).ready(() => {
  const $body = $('body');
  $body.html('');

  // Styling for a dark, edgy theme
  $body.css({
    'background-image': 'url("https://25.media.tumblr.com/0c48fb5d058b311240eb593e77fe454a/tumblr_mrrc9qSBEv1s3a8qvo1_500.gif")',
    'background-size': 'cover',
    'background-repeat': 'no-repeat',
    'background-attachment': 'fixed',
    'background-position': 'center',
    'color': '#e0e0e0',
    'font-family': 'Roboto, sans-serif',
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
  const $refreshButton = $('<button>')
    .attr('class', 'marked')
    .text('Refresh')
    .css({
      'background-color': '#333',
      'color': '#e74c3c',
      'border': '1px solid #e74c3c',
      'border-radius': '5px',
      'padding': '5px 15px',
      'cursor': 'pointer'
    });
  $refreshButton.appendTo($body);

  const $inputTextBox = $('<textarea>')
    .attr('class', 'textBox')
    .attr('placeholder', 'Send a Message')
    .css({
      'background-color': '#1e1e1e',
      'color': '#e0e0e0',
      'border': '1px solid #444',
      'padding': '10px',
      'border-radius': '5px',
      'width': '250px',
      'margin-right': '10px'
    });
  $inputTextBox.appendTo($body);

  const $sendButton = $('<button>')
    .attr('class', 'sendButton')
    .text('Send')
    .css({
      'background-color': '#333',
      'color': '#e74c3c',
      'border': '1px solid #e74c3c',
      'border-radius': '5px',
      'padding': '5px 15px',
      'cursor': 'pointer'
    });
  $sendButton.appendTo($body);

  // Tweet box container
  const $tweetbox = $('<div>').attr('id', 'tweetbox').css({
    'padding': '20px',
    'margin-top': '20px',
  }).appendTo($body);

  // Track displayed tweets
  let displayedTweets = new Set();

  // Function to create tweets
  function tweetmaker(tweets) {
    tweets.filter(tweet => !displayedTweets.has(tweet.created_at)).forEach(tweet => {
      displayedTweets.add(tweet.created_at); // Mark tweet as displayed
      const $tweet = $('<div>');

      // Add username and message
      const $username = $('<p>')
        .attr('class', 'clickableName')
        .css('color', '#e74c3c')
        .text(`@${tweet.user}`)
        .on('click', () => {
          const filteredTweets = streams.home.filter(t => t.user === tweet.user);
          showFilteredTweets(filteredTweets, `@${tweet.user}`);
        });

      const $message = $('<p>')
        .text(tweet.message)
        .css('color', '#b3b3b3');

      const $timestamp = $('<p>')
        .text(`${dayjs(tweet.created_at).format('MMMM D, YYYY h:mm A')} (${dayjs(tweet.created_at).fromNow()})`)
        .css('color', '#888');

      // Add emoji reactions
      const $emojiContainer = $('<div>').css({
        'display': 'flex',
        'gap': '10px',
        'margin-top': '10px',
        'font-size': '1.2em',
      });

      ['👍', '😂', '❤️', '🔥', '😮'].forEach(emoji => {
        const $emoji = $('<span>')
          .text(emoji)
          .css({ 'cursor': 'pointer', 'padding': '5px' })
          .on('click', function () {
            $(this).toggleClass('emoji-selected');
          });
        $emojiContainer.append($emoji);
      });

      $tweet.append($username, $message, $timestamp, $emojiContainer).css({
        'background-color': '#1e1e1e',
        'border': '1px solid #444',
        'color': '#e0e0e0',
        'padding': '10px',
        'border-radius': '5px',
        'margin-bottom': '10px',
        'box-shadow': '0 0 15px rgba(255, 0, 0, 0.5)',
      });

      $tweetbox.prepend($tweet); // Add new tweets to the top
    });
  }

  // Function to show filtered tweets and add a back button
  function showFilteredTweets(tweets, title) {
    $tweetbox.empty(); // Clear all tweets
    const $title = $('<h3>').text(`${title}'s Timeline`).css('color', '#e74c3c');
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
        $tweetbox.empty();
        tweetmaker(streams.home); // Reload home timeline
      });

    $tweetbox.append($title, $backButton);
    tweetmaker(tweets);
  }

  // Load initial tweets
  tweetmaker(streams.home);

  // Refresh button functionality
  $refreshButton.on('click', () => {
    tweetmaker(streams.home);
  });

  // Send button functionality
  $sendButton.on('click', () => {
    const newTweet = {
      user: 'You',
      message: $inputTextBox.val(),
      created_at: new Date()
    };

    streams.home.unshift(newTweet); // Add to data stream
    tweetmaker([newTweet]); // Show new tweet on top
    $inputTextBox.val(''); // Clear the input box
  });

  // Add custom CSS for selected emoji
  const style = $('<style>').text(`
    .emoji-selected {
      border: 2px solid #e74c3c;
      border-radius: 5px;
      padding: 5px;
    }
  `);
  $('head').append(style);
});


