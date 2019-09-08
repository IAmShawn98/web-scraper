// Grab the Express Instance From the 'server.js' File.
module.exports = app => {
    // Save Article.
    app.get("/saveArticle", function (req, res) {
        // Grab the URL of the Site We Want to Scrape.
        axios.get("https://www.nytimes.com/section/todayspaper").then(function (response) {
            // Load URL String Into Cheerio to Make It Our Shorthand
            // So That It's Easier to Call With.
            var $ = cheerio.load(response.data);

            // Grab All News Classes.
            $(".css-10wtrbd").each(function () {
                // Create An Empty Array For Later Population.
                var resultSave = {};

                // Scrape Every 'h2' Tag Containing Article Headers.
                resultSave.title = $(this)
                    .children("h2")
                    .text();
                // Scrape Every Link Available.
                resultSave.link = $(this)
                    .children("div")
                    .children("a")
                    .attr("href")
                // Scrape Every 'p' Tag Containing Brief Article Descriptions.
                resultSave.articleDescribe = $(this)
                    .children("p")
                    .text();

                // Create New Article Using the 'result' Object Created From Scraping.
                db.Article.create(resultSave)
                    .then(function (ScrapesDB) {
                        // Show All Processed Scrapes In the Console.
                        console.log(ScrapesDB);
                    })
                    .catch(function (err) {
                        // If There's An Error, Handle It.
                        console.log(err);
                    });
            });
            // Redirect Back to the Root Route When Finished.
            res.redirect("/");
        });
    });
}