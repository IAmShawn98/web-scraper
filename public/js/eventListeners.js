// Processing Scrape Alert.
$("#btnScrape").click(function () {
    $("#pAlertSuccess").show();
});

$("#btnPostNote").click(function () {
    var articleID = $("#articleID").val();

    var txtNote = $("#txtNote").val();


    var noteAndID = {
        _articleId: articleID,
        comment: txtNote
    }

    $.post("/comments", noteAndID).then(function () {
        
    });

});