"use strict";

const viewService = require('../model/service/viewService')
const dataService = require('../model/service/dataService')
const utils = require('../Utils')
const cacheController = require('../controller/cacheController')

const controllers = {}

/**
 * Home controller
 * @param request
 * @param callback (err, viewString)
 */
controllers.home = function (request, callback) {
    callback(null, viewService.render('home', {title: "Homepage"}))
}

/**
 * Artist search controller
 * Receives the Artist from the querystring parameter q or in the path
 * ex: /artist or /?q=artist
 * Also looks for pagination parameteres page and limit
 * ex: /artist?page=2&limit=10
 *
 * @param request
 * @param callback (err, viewString)
 */
controllers.search = function (request, callback) {
    const params = utils.getParameters(request.url)
    const page = params.page || 1
    const limit = params.limit || 10
    const artist = params.q || decodeURIComponent(utils.getPathname(request.url).split('/')[2])

    if (!artist)
        return callback("No artist provided!")

    dataService.searchArtist(artist, page, limit, (err, collection) => {
        if (err)
            return callback(err)

        const data = {
            title: collection.total + " Results for " + artist,
            query: artist,
            collection: collection
        }

        callback(null, viewService.render('search', data))
    })

}

/**
 * Artists Controller
 * Shows all the artist info and his albums paginated
 * USES CACHE!
 * @param request
 * @param callback
 * @return {*}
 */
controllers.artists = function (request, callback) {
    const params = utils.getParameters(request.url)
    const page = params.page || 1
    const limit = params.limit || 5
    const id = decodeURIComponent(utils.getPathname(request.url).split('/')[2])

    if (!id)
        return callback("No artist id provided")

    cacheController.getArtistInfoWithAlbums(id, page, limit, callback)
}

/**
 * Album Controller
 * Shows the album info with tracks (not paginated! The first 50)
 * @param request
 * @param callback
 * @return {*}
 */
controllers.album = function (request, callback) {
    const id = decodeURIComponent(utils.getPathname(request.url).split('/')[2])

    if (!id)
        return callback("No album id provided")

    dataService.albumInfo(id, (err, album) => {
        if (err)
            return callback(err)

        const data = {
            title: album.name,
            album: album
        }

        callback(null, viewService.render('album', data))
    })
}

module.exports.controllers = controllers