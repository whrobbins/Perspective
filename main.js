/*
 *  Main.js is a content script that executes at the end of every page load.  It walks the DOM and replaces text.
 */
var str = generateHTML(getPerspective(50.00));
console.log(str);
console.log(typeof str);
walkDOM(document.body);

/*
 *  Walks the DOM and calls replaceText for each text node that contains matching text.
 */
function walkDOM(node) {
	var child, next;

    if (node.nodeType === 1 || node.nodeType === 9 || node.nodeType === 11) {
        child = node.firstChild;
        while (child) {
            next = child.nextSibling;
            walkDOM(child);
            child = next;
        }
    } else if (node.nodeType === 3) {
        replaceText(node);
    }
}

/*
 *  Parses the given text node for a dollar amount (if it exists), and replaces it appropriately
 */
function replaceText(textNode) {
    var text = textNode.nodeValue;
    var re = /\$+\d+((,\d{3})*)\.?[0-9]?[0-9]?/g;
    var match = re.exec(text);

    if (match == null)
        return;

    //debugger;

    console.log("Text node found: " + text);
    console.log("Match for the above text node: " + match + "Is array: " + (match instanceof Array));

    if (!(match instanceof Array)) {
        console.log("Is not array. Replacing " + match + " with " + generateHTML(getPerspective(amount)));
        var amount = parseFloat(match.substring(1,match.length)).toFixed(2);
        text.replace(re, generateHTML(getPerspective(amount)));
    }
    else if (0 < match.length) {
        for (var i = 0; i < match.length; i++) {
            if (match[i] !== null && typeof match[i] !== 'undefined' && match[i] !== '') {
                console.log("Is array.  Replacing " + match[i] + " with " + generateHTML(getPerspective(amount)));
                var amount = parseFloat(match[i].substring(1, match[i].length)).toFixed(2);
                text.replace(re, generateHTML(getPerspective(amount)));
            }
        }
    }

	textNode.nodeValue = text;
}

/*
 *  Generates HTML to be injected, based on an object representing a potential impact
 *  Object format:
 *      { verb: "Save", number: 10, outcome: "goldfish from dying",
 *          link: "http://savethefish.org/donate&amount=10", originalValue: 19.99 }
 */
function generateHTML(impact) {
    // DUMMY CONTENT FOR TESTING.  DELETE LATER **********************************************
    impact = { verb: "Save", number: 10, outcome: "goldfish from dying", link: "http://savethefish.org/donate&amount=10", originalValue: 19.99 }
    // ======================================== **********************************************

    var perspective;
    // Font/Typeface settings
    perspective = '<span class="perspective" ' +
        'style="max-width: 90px; color: rgb(0, 0, 0); background: rgb(203, 215, 233);">';
    // Content
    perspective += '<a href="' + impact.link + '">' + impact.verb + ' ' + impact.number + ' ' +
        impact.outcome + '</a>' + '$(' + impact.originalValue + ')' + '</span>';

    return perspective;
}

/*
 *  Randomly chooses good-deed from a list of potential impacts based on cost and amount given
 *  Returns object of format:
 *      { verb: "Save", number: 10, outcome: "goldfish from dying",
 *          link: "http://savethefish.org/donate&amount=10", originalValue: 19.99 }
 */
function getPerspective(amount) {
    // Impacts correlated to 'amount,' grouped within an order of magnitude of each other
    // To access, use impactOf.one[2] for second option in the one category
    impactOf = {
        "one":["list"],
        "ten":["list"],
        "hundred":["list"],
        "thousand":["list"],
        "tenThousand":["list"],
        "hundredThousand":["list"],
        "million":["list"]
    }

    if(amount < 1) {

    }
    else if(amount < 10) {

    }
    else if(amount < 100) {

    }
    else if(amount < 1000) {

    }
    else if(amount < 10000) {

    }
    else if(amount < 100000) {

    }
    else {
        var impact = amount / 40;
        return "Prevent " + impact + "people from going blind";
    }

    return "Donate " + amount + " to charity.";
}