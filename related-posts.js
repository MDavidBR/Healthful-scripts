// related-posts.js
(function($) {
  $.fn.relatedPosts = function(options) {
    var settings = $.extend({
      blogURL: '',
      maxPosts: 3,
      containerId: 'related-posts-container'
    }, options);

    function getLabels() {
      var labels = [];
      $(".post-labels a").each(function() {
        labels.push($(this).text());
      });
      return labels;
    }

    function fetchRelatedPosts(label, container) {
      var feedUrl = settings.blogURL + "/feeds/posts/default/-/" + encodeURIComponent(label) + "?alt=json-in-script&callback=?";
      $.getJSON(feedUrl, function(data) {
        var entries = data.feed.entry || [];
        var output = "<ul>";
        var count = 0;

        for (var i = 0; i < entries.length && count < settings.maxPosts; i++) {
          var entry = entries[i];
          var title = entry.title.$t;
          var url = '';
          for (var j = 0; j < entry.link.length; j++) {
            if (entry.link[j].rel === 'alternate') {
              url = entry.link[j].href;
              break;
            }
          }
          output += '<li><a href="' + url + '">' + title + '</a></li>';
          count++;
        }

        output += "</ul>";
        $(container).html(output);
      });
    }

    return this.each(function() {
      var labels = getLabels();
      if (labels.length > 0) {
        fetchRelatedPosts(labels[0], '#' + settings.containerId);
      }
    });
  };
})(jQuery);
