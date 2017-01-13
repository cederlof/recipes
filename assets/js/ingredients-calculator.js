calculateIngredients();

function calculateIngredients(){
    if($("section.content ul").length > 0){
        $("<div/>").attr("id", "output-container")
            .insertBefore($("section.content ul").first());
        addInputForCalculation();
        makeTableFromIngredients();
    }
}

function addInputForCalculation(){
    var label = $("<label/>")
        .css("float", "right")
        .text("Förändringsfaktor: ");

    var input = $("<input/>")
        .attr("id", "percentageInput")
        .attr("type", "text")
        .css("width", "30px")
        .css("text-align", "right")
        .val("1")
        .appendTo(label)
        .keyup(percentageInputChange)
        .blur(function(){
            if($("#percentageInput").val().length == 0)
                $("#percentageInput").val(1);
        });
    
    $("#output-container").append(label);
}

function percentageInputChange(evt){
    var input = $("#percentageInput");

    $(".ingredients-calculator-table tr").each(function(trIndex,trValue){
        var cell = $(trValue).find("td:first");
        var val = $(trValue).attr("data-amount");
        var precentageVal = input.val();
        console.log(val);

        var newVal;
        if(precentageVal == "1" || precentageVal == "")
            newVal = val;
        else if(!isNaN(val)){
            newVal = val * precentageVal;
        }else{
            newVal = "-";
        }

        cell.text(newVal);
    });
}

function makeTableFromIngredients(){
    var list = $("section.content ul");

    if(list.length > 0){
        var table = $("<table/>")
            .addClass("table")
            .addClass("table-condensed")
            .addClass("ingredients-calculator-table")
            .attr("border", 1);
        $(list).find("li").each(function(index,value){
            var text = $(value).text();
            var parsedIngredient = parseIngredient(text);

            var tableRow = $("<tr/>").appendTo(table);
            var amountCell = $("<td/>")
                .css("width", "50px")
                .css("text-align", "right")
                .appendTo(tableRow);
            var unitCell = $("<td/>")
                .css("width", "50px")
                .appendTo(tableRow);
            var ingredientCell = $("<td/>").appendTo(tableRow);

            if(parsedIngredient != null){
                tableRow.attr("data-amount", parsedIngredient.amount);
                amountCell.append(parsedIngredient.amount);
                unitCell.append(parsedIngredient.unit);
                ingredientCell.append(parsedIngredient.ingredient)
            }
            
            var originalCell = $("<td/>")
                .css("font-size", "0.8em").css("color", "#666")
                .appendTo(tableRow)
                .append(parsedIngredient.original);
        });
        $(list).remove();
        $("#output-container").append(table);
    }
}

function parseIngredient(text){
    var amount = 0;
    var unit = "";
    var ingredient = "";
    text = text.trim();
    match = text.match(/^\d+(\.\d{1,2})?([/.]\d+)?/);
    if(match && match.length>0)
    {
        var amount = match[0];
        var amountLength = amount.length;
        var remainingString = text.substring(amountLength).trim();
        var typeSplitOnSpaces = remainingString.split(" ");

        //if at least two words remaing, asume the first one is the type
        if(typeSplitOnSpaces.length > 1) 
        {
            unit = typeSplitOnSpaces[0];
            ingredient = remainingString.substring(unit.length+1);
        }   
        else {
            unit = "";
            if(typeSplitOnSpaces.length == 1)
                ingredient = typeSplitOnSpaces[0];
        }
        return {amount: amount, unit: unit, ingredient: ingredient, original: text};
    }    
    else 
        return null;
}