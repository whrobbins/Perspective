/**
 * @author Will Robbins http://willrobbins.org
 *
 *  Main.js is a content script that executes at the end of every page load.  It walks the DOM and replaces text.
 */

// Toggle for console outputs
var DEV_MODE = true;

// Regular Expression matching dollar values (eg. matches $5.00)
var re = /\$+\d+((,\d{3})*)\.?[0-9]?[0-9]?/gi;

walkDOM(document.body);

/**
 *  Walks the DOM and calls replaceText for each text node that contains matching text.
 */
function walkDOM(node) {

	var next;

    if (node.nodeType === 1) { // Element
        if (node = node.firstChild) {
            do { // Calls walkDOM on every child node
                next = node.nextSibling;
                walkDOM(node);
            } while(node = next);
        }

    } else if (node.nodeType === 3) { // Text node
        if (re.test(node.data)) {
            replaceText(node);
        }
    }
}

/**
 *  Parses the given text node for a dollar amount (if it exists), and replaces it appropriately
 */
function replaceText(textNode) {

    var match = [].concat(re.exec(textNode.nodeValue));

    if (match == null || match.length === 0)
        return;

    if(DEV_MODE) console.log("Text node found: " + textNode.nodeValue);
    if(DEV_MODE) console.log("Match for the above text node: " + match + " Is array: " + (match instanceof Array) + " Print array :" + match);

    for (var i = 0; i < match.length; i++) {
        if (match[i] !== null && typeof match[i] !== 'undefined' && match[i] !== '') {
            var amount = parseFloat(match[i].substring(1, match[i].length)).toFixed(2);
            generateHTML(getPerspective(amount), textNode);
            if(DEV_MODE) console.log("generateHTML just ran");
        }
    }
}

/**
 *  Generates a DOM element to be injected, based on an object representing a potential impact
 *  Object format:
 *      { verb: "Save", number: 10, outcome: "goldfish from dying",
 *          link: "http://savethefish.org/donate&amount=10", originalValue: 19.99 }
 */
function generateHTML(impact, textNode) {

    if(textNode.parentNode == null) return;

    var newDiv = document.createElement('div');
    newDiv.setAttribute('class', 'perspective');
    // newDiv.setAttribute('style', 'max-width: 90px; ' + 
    //                             'color: rgb(0, 0, 0); ' + 
    //                             'background: rgb(203, 215, 233);');

    newDiv.innerHTML = textNode.data.replace(re, '<span>' + 
                                                '<a ' + 'style="' +
                                                'max-width: 90px; ' + 
                                                'color: rgb(0, 0, 0); ' + 
                                                'background: rgb(203, 215, 233);"' +
                                                'href="' + impact.link + '">' + 
                                                impact.verb + ' ' + 
                                                impact.number + ' ' + 
                                                impact.outcome + '</a>' + 
                                                ' ($' + impact.originalValue + ')' + 
                                                '</span>'); 

    if(DEV_MODE) console.log('newDiv innerHTML: ' + newDiv.innerHTML);
    if(DEV_MODE) console.log('Print newDiv: ' + newDiv);
    if(DEV_MODE) console.log('textNode Parent: ' + textNode.parentNode);
    if(DEV_MODE) console.log('textNode type: ' + textNode.nodeType);
   
    // Rearrange the nodes
    while (newDiv.firstChild) {
        textNode.parentNode.insertBefore(newDiv.firstChild, textNode);
    }

    // Remove original textNode
    textNode.parentNode.removeChild(textNode);
}

/**
 *  Randomly chooses good-deed from a list of potential impacts based on cost and amount given
 *  Returns object of format:
 *      { verb: "Save", number: 10, outcome: "goldfish from dying",
 *          link: "http://savethefish.org/donate&amount=10", originalValue: 19.99 }
 *
 *  TODO: Write this method...
 */
function getPerspective(amount) {

    // Dummy content for testing
    if(DEV_MODE) return { verb: "Save", 
                            number: 10, 
                            outcome: "goldfish from dying", 
                            link: "http://savethefish.org/donate&amount=10", 
                            originalValue: 19.99 };

    // Impacts correlated to 'amount,' grouped within an order of magnitude of each other
    // Example: use impactOf.one[2] for second option in the one category
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
