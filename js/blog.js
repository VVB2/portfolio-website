const MEDIUM_USERNAME = "@vinodvamanbhat";
const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/${MEDIUM_USERNAME}`;

$(function () {
  var mediumPromise = new Promise(function (resolve) {
    var $content = $("#blog-content");
    $.get(
      API_URL,
      function (response) {
        if (response.items.length > 0) {
          var output = "";
          $.each(response.items, function (k, item) {
            output += `<div class="card mb-3 mx-auto mr-5 " style="width: 20rem;">`;
            var tagIndex = item.content.indexOf("<img"); // Find where the img tag starts
            var srcIndex =
              item.content.substring(tagIndex).indexOf("src=") + tagIndex; // Find where the src attribute starts
            var srcStart = srcIndex + 5; // Find where the actual image URL starts; 5 for the length of 'src="'
            var srcEnd =
              item.content.substring(srcStart).indexOf('"') + srcStart; // Find where the URL ends
            var src = item.content.substring(srcStart, srcEnd); // Extract just the URL
            output += `<img src="${src}" class="card-img-top" alt="Cover image" style="max-height: 200px">`;
            output += `<div class="card-body">`;
            output += `<h5 class="card-title"><a href="${item.link}" target="_blank">${item.title}</a></h5>`;
            var yourString = item.content.replace(/<img[^>]*>/g, ""); //replace with your string.
            yourString = yourString.replace("h4", "p");
            yourString = yourString.replace("h3", "p");
            var maxLength = 120; // maximum number of characters to extract
            //trim the string to the maximum length
            var trimmedString = yourString.substr(0, maxLength);
            //re-trim if we are in the middle of a word
            trimmedString = trimmedString.substr(
              0,
              Math.min(trimmedString.length, trimmedString.lastIndexOf(" "))
            );
            output += `<p class="card-text">${trimmedString}...</p>`;
            output += `<a href="${item.link}" class="btn btn-outline-success" target="_blank">Read More</a>`;
            output += "</div></div>";
            return k < 10;
          });
          output += "</div>"
          resolve($content.html(output));
        }
      }
    );
  });

  mediumPromise.then(function () {
    //Pagination
    pageSize = 3;
    var pageCount = $(".card").length / pageSize;

    for (var i = 0; i < pageCount; i++) {
      $("#pagin").append(
        `<li class="page-item"><a class="page-link" href="#blog">${i + 1}</a></li> `
      );
    }
    $("#pagin li:nth-child(1)").addClass("active");
    showPage = function (page) {
      $(".card").hide();
      $(".card").each(function (n) {
        if (n >= pageSize * (page - 1) && n < pageSize * page) $(this).show();
      });
    };

    showPage(1);

    $("#pagin li").click(function () {
      $("#pagin li").removeClass("active");
      $(this).addClass("active");
      showPage(parseInt($(this).text()));
    });
  });
});
