/*
|--------------------------------------------------------------------------
| DOM helpers
|--------------------------------------------------------------------------
*/
function DOMHelper() {

    /*
    |--------------------------------------------------------------------------
    | Query snippet (https://developer.mozilla.org/en-US/Add-ons/Code_snippets/QuerySelector)
    |--------------------------------------------------------------------------
    */
    this.id = function (id) {
        return document.getElementById(id)
    }

    this.query = function (selector, el) {
        if (!el) {
            el = document;
        }
        return el.querySelector(selector);
    }

    this.queryAll = function (selector, el) {
        if (!el) {
            el = document;
        }
        return el.querySelectorAll(selector);
        // Note: the returned object is a NodeList.
        // If you'd like to convert it to a Array for convenience, use this instead:
        // return Array.prototype.slice.call(el.querySelectorAll(selector));
    }

    /*
    |--------------------------------------------------------------------------
    | Select Element
    |--------------------------------------------------------------------------
    */
    this.selectGetValue = function(element) {
        return element.value;
    }

    this.selectGetSelectedOption = function(element) {
        return element.options[element.selectedIndex];
    }

    /*
    |--------------------------------------------------------------------------
    | Remove closest tr (remove table rows)
    |--------------------------------------------------------------------------
    */
    this.removeRow = function (element) {
        element.closest('tr').remove()
    }
}

const Html = new DOMHelper()

/*
|--------------------------------------------------------------------------
| Others
|--------------------------------------------------------------------------
*/
function stringToHtml(str) {
    const div = document.createElement('div')
    div.innerHTML = str
    return div.firstChild
}