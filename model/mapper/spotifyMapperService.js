"use strict";

const Artist = require('./../entity/Artist')
const Collection = require('../entity/Collection')
const Album = require('../entity/Album')
const Track = require('../entity/Track')

const methods = {}

/**
 * Maps spotify search artists json object to a collection of Artists
 *
 * @param json Artists Search Json
 * @return {Collection} Collection of Artists
 */
methods.mapArtistsToCollection = function(json) {
    let artists = json.artists.items.map(artist => this.mapArtist(artist))

    return new Collection(
        json.artists.offset,
        json.artists.limit,
        json.artists.total,
        artists)
}

/**
 * Maps spotify albums json object to a collection of Albums
 *
 * @param albumsJson
 * @return {Collection} Collection of Albums
 */
methods.mapAlbumsToCollection = function(albumsJson) {
    let albums = albumsJson.items.map(album => this.mapAlbum(album))

    return new Collection(albumsJson.offset,
        albumsJson.limit,
        albumsJson.total,
        albums)
}

/**
 * Maps the artist json and his albums to an Artist Entity with a collection of
 * albums in the albums property
 *
 * @param artistJson
 * @param albumsJson
 * @return {Artist} Artist with a Collection of Albums
 */
methods.mapArtistAndAlbums = function(artistJson, albumsJson) {
    let artist = this.mapArtist(artistJson)
    artist.albums = this.mapAlbumsToCollection(albumsJson)

    return artist
}

/**
 * Maps a json artist item to an Artist Entity without albums
 * @param jsonArtistItem
 * @return {Artist} Artist
 */
methods.mapArtist = function(jsonArtistItem) {
    return new Artist(
        jsonArtistItem.id,
        jsonArtistItem.name,
        getImageFromJsonArray(jsonArtistItem.images, '/img/defaultAvatar.png'),
        jsonArtistItem.genres.slice(), // duplicate array
        jsonArtistItem.popularity,
        jsonArtistItem.type,
        jsonArtistItem.uri,
        jsonArtistItem.followers.total
    )
}

/**
 * Maps a json album info to an Album Entity, with or without tracks
 *
 * @param jsonAlbumItem
 * @return {Album} Album
 */
methods.mapAlbum = function(jsonAlbumItem) {
    return new Album(
        jsonAlbumItem.id,
        jsonAlbumItem.name,
        jsonAlbumItem.uri,
        getImageFromJsonArray(jsonAlbumItem.images, '/img/music_default.jpg'),
        jsonAlbumItem.type,
        jsonAlbumItem.label,
        jsonAlbumItem.release_date,
        this.mapTracksToCollection(jsonAlbumItem.tracks)
    )
}

/**
 * Maps a json tracks array to a Collection of tracks
 *
 * @param jsonTracks
 * @return {Collection} Collection of Tracks
 */
methods.mapTracksToCollection = function (jsonTracks) {
    if(!jsonTracks) return null

    let tracks = jsonTracks.items.map(track => this.mapTrack(track))

    return new Collection(jsonTracks.offset,
        jsonTracks.limit,
        jsonTracks.total,
        tracks)
}

/**
 * Create a Track entity from a jsonTrack
 *
 * @param jsonTrackItem
 * @return {Track} Track
 */
methods.mapTrack = function(jsonTrackItem) {

    let album = null
    if(jsonTrackItem.album) {
        album = this.mapAlbum(jsonTrackItem.album)
    }

    return new Track(
        jsonTrackItem.id,
        jsonTrackItem.name,
        jsonTrackItem.disk_number,
        jsonTrackItem.duration_ms,
        jsonTrackItem.preview_url,
        jsonTrackItem.track_number,
        jsonTrackItem.uri,
        album
    )
}

/*
 |--------------------------------------------------------------------------
 | Helpers
 |--------------------------------------------------------------------------
 */
/**
 * Gets the image of the wanted size from the images array
 * Spotify images sizes: 64px, 200px, 300px, 640px, 1000px
 *
 * @param images
 * @param preferenceSizesArray [200, 300] example, 300px as a fallback if there is no 200px image
 * @param imgDefault
 * @return {string}
 */
function getImageFromJsonArray(images, imgDefault = null,
                               preferenceSizesArray = [200, 300, 640, 64, 1000]) {
    const size = images.length
    if (size == 0)
        return imgDefault

    // Find the image for each of the preferences sizes
    for (let i = 0; i < preferenceSizesArray.length; i++) {
        let img = images.find(img => img.width == preferenceSizesArray[i])

        if (img) return img.url
    }

    // If none of the prefered sizes was found, lets return the first one
    return images[0].url
}

module.exports = methods
