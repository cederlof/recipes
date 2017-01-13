
calculateIngredients();

function calculateIngredients(){
    makeTableFromIngredients();
}
function makeTableFromIngredients(){
    var list = $("section.content ul");

    if(list.length > 0){
        var table = $("<table/>")
            .addClass("table").attr("border", 1);
        $(list).find("li").each(function(index,value){
            //console.log($(value).text());
            var text = $(value).text();
            var parsedIngredient = parseIngredient(text);
            var tableRow = $("<tr/>").appendTo(table);
            var amountCell = $("<td/>").appendTo(tableRow)
                .append(parsedIngredient.amount);
            var typeCell = $("<td/>").appendTo(tableRow)
                .append(parsedIngredient.type);
            var originalCell = $("<td/>").appendTo(tableRow)
                .append(parsedIngredient.original);
        });
        $("#output-container").append(table);
    }

    //$("#output-container").append(list);
}
function parseIngredient(text){
    var amount = 0;
    amount = text.match(/^\d+(\.\d+)?([/.]\d+)?/)


    return {amount: amount, type: "yo", original: text};
}