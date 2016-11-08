"use strict";

/**
 * Data collection
 * Contains the paginate data and the items
 * @param offset
 * @param limit
 * @param total
 * @param items
 * @constructor
 */
function Collection(offset, limit, total, items) {
    this.offset = offset
    this.limit = limit
    this.total = total
    this.items = items
}

/**
 * Get how many pages we have
 * @return {*}
 */
Collection.prototype.getTotalPages = function () {
    return Math.ceil(this.total / this.limit)
}

/**
 * Get the current page
 * @return {number}
 */
Collection.prototype.getCurrentPage = function () {
    return Math.ceil(this.offset / this.limit) + 1
}

/**
 * See if there is a next page to navigate
 * @return {boolean}
 */
Collection.prototype.hasNext = function () {
    return this.getCurrentPage() < this.getTotalPages()
}

/**
 * See if there is a previous page to navigate
 * @return {boolean}
 */
Collection.prototype.hasPrevious = function () {
    return this.getCurrentPage() > 1
}

Collection.prototype.isFirst = function() {
    return this.offset == 0
}

Collection.prototype.isLast = function() {
    return this.offset+this.items.length == this.total
}

Collection.prototype.getPreviousPageOffset = function() {
    return this.offset-this.limit
}

Collection.prototype.getNextPageOffset = function() {
    return this.offset+this.limit
}

Collection.prototype.getFirstPageOffset = function() {
    return 0
}

Collection.prototype.getLastPageOffset = function() {
    return this.total-this.limit
}

module.exports = Collection