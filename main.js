/**
 * @author Will Robbins http://willrobbins.org
 *
 *  Main.js is a content script that executes at the end of every page load.  
 *  It walks the DOM and replaces text.
 */

// Regular Expression matching dollar values (eg. matches $5.00).  See regex101.com for analysis
var re = /\$+\d+((,\d{3})*)\.?[0-9]?[0-9]?/gi;

walkDOM(document.body);

/**
 *  Walks the DOM and calls replaceText for each text node that contains matching text.
 */
function walkDOM(node) {

    var next;

    if (node.nodeType === 1) {  // Element
        if (node = node.firstChild) {
            do {
                next = node.nextSibling;
                walkDOM(node);
            } while(node = next);
        }

    } else if (node.nodeType === 3) {  // Text node
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

    console.log("Text node found: " + textNode.nodeValue);
    console.log("Match for the above text node: " + match);
    console.log("Typeof textNode: " + (typeof textNode));
    console.log("Typeof parentNode: " + (typeof textNode.parentNode));

    for (var i = 0; i < match.length; i++) {
        if (match[i] !== null && typeof match[i] !== 'undefined' && match[i] !== '') {
            var amount = parseFloat(match[i].substring(1, match[i].length).replace(/,/g, '')).toFixed(2);
            generateHTML(getPerspective(amount), textNode);
            console.log("generateHTML just ran.\nmatch[i] == " + match[i] + "\namount: " + amount);
        }
    }
}

/**
 *  Generates a DOM element to be injected, based on an object representing a potential impact.
 *  There's not really native support for what we want to do so it's hacked as follows:
 */
function generateHTML(impact, textNode) {

    if (textNode.parentNode == null) {
        console.log("parentNode is null: aborting generateHTML().");
        return;
    }

    var newDiv = document.createElement('div');
    newDiv.setAttribute('class', 'perspective');

    // TODO: break HTML gen out into its own method
    var newHTML = '<span><a style="max-width: 90px; color: rgb(0, 0, 0); ' + 
                    'background: rgb(203, 215, 233);" href="' + impact.link + '">' + 
                    impact.content + '</a>($' + impact.originalValue + ')</span>'; 

    newDiv.innerHTML = textNode.data.replace(re, newHTML); 

    console.log('newDiv innerHTML: ' + newDiv.innerHTML);
    console.log('Print newDiv: ' + newDiv);
    console.log('textNode Parent: ' + textNode.parentNode);
    console.log('textNode type: ' + textNode.nodeType);
   
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
 *      { content: "Save " + 10 + " goldfish from dying",
 *        link: "http://savethefish.org/donate&amount=10",
 *        originalValue: 19.99 }
 *
 *  TODO: Provide sources for the cost of each option
 *  TODO: Switch from if/else to a dict of lists (keyed w/ cost ranges) and add more ranges/causes
 */
function getPerspective(amount) {

    if(amount < 50) {
        return {
            content: "Sponsor " + (amount / 4.50).toFixed(1) + " anti-malarial bed nets",
            link: "http://www.givewell.org/international/top-charities/amf",
            originalValue: amount
        };
    }
    else {
        return {
            content: "Prevent " + (amount / 40).toFixed(1) + " people from going blind",
            link: "http://www.hollows.org/au/home",
            originalValue: amount
        };
    }
}
