"use strict";

const request = require('superagent')
const sprintf = require('sprintf')
const config = require('../config')
const couchdb = require('./couchdbUtils')

/**
 * Invites Repository
 * Manages invites from chouchdb
 */
const invites = {}
const url = config.couchdb_url + "/invites/"


/**
 * Send playlist invitation to a user
 * Creates a new doc
 * The json response contains ok, id, rev fields
 *
 * @param toEmail
 * @param fromEmail
 * @param playlistID
 * @param writable bool
 * @param cb (err, couchdbObj)
 */
invites.sendInvitation = function (toEmail, fromEmail, playlistID, writable, cb) {
    request
        .post(url)
        .send({
            "accepted": false,
            "toUser": toEmail,
            "fromUser": fromEmail,
            "playlistId": playlistID,
            "write": writable
        })
        .end(couchdb.bodyCallback(cb))
}

/**
 * Gets an specific invitation
 * Usefull to check duplicates
 *
 * @param toEmail
 * @param fromEmail
 * @param playlistID
 * @param cb
 */
invites.getInvitation = function (toEmail, fromEmail, playlistID, cb) {
    request
        .post(url + '_find')
        .send({
            "selector": {
                "toUser": toEmail,
                "fromUser": fromEmail,
                "playlistId": playlistID
            },
            "limit": 1
        })
        .end(couchdb.searchCallback(cb))
}

/**
 * Get an invite by its ID
 *
 * @param id
 * @param cb
 */
invites.getInvitationById = function (id, cb) {
    request.get(url + id)
        .end(couchdb.bodyCallback(cb))
}

/**
 * Gets an specific invitation for a specific user and playlist
 *
 * @param toEmail
 * @param playlistId
 * @param cb
 */
invites.getInvitationByPlaylistAndUser = function (toEmail, playlistId, cb) {
    request
        .post(url + '_find')
        .send({
            "selector": {
                "toUser": toEmail,
                "playlistId": playlistId
            },
            "limit": 1
        })
        .end(couchdb.searchCallback(cb))
}


/**
 * Get all invitations of an user
 *
 * @param toEmail
 * @param cb
 */
invites.getInvitationsOfUser = function (toEmail, cb) {
    request
        .post(url + '_find')
        .send({
            "selector": {
                "toUser": toEmail
            },
            "limit": 100
        })
        .end(couchdb.bodyCallback(cb))
}

/**
 * Get all unaccepted invitations of an user
 *
 * @param toEmail
 * @param cb
 */
invites.getPendingInvitationsOfUser = function (toEmail, cb) {
    request
        .post(url + '_find')
        .send({
            "selector": {
                "toUser": toEmail,
                "accepted": false
            },
            "limit": 100
        })
        .end(couchdb.bodyCallback(cb))
}

/**
 * Gets the invitations of a playlist sent by the user
 *
 * @param fromEmail
 * @param playlistID
 * @param cb
 */
invites.getInvitesOfPlaylist = function (fromEmail, playlistID, cb) {
    request
        .post(url + '_find')
        .send({
            "selector": {
                "fromUser": fromEmail,
                "playlistId": playlistID
            },
            "limit": 100
        })
        .end(couchdb.bodyCallback(cb))
}

/**
 * Delete Invitation
 *
 * @param id
 * @param rev
 * @param cb
 */
invites.deleteInvite = function (id, rev, cb) {
    request
        .delete(url + id)
        .query({ rev: rev })
        .end(couchdb.bodyCallback(cb))
}

/**
 * Update invitation
 *
 * @param invite
 * @param cb
 */
invites.updateInvite = function (invite, cb) {
    request
        .put(url + invite.id)
        .send({
            "accepted": invite.accepted,
            "toUser": invite.toEmail,
            "fromUser": invite.fromEmail,
            "playlistId": invite.playlistId,
            "write": invite.writable,
            "_rev": invite._rev
        })
        .end(couchdb.bodyCallback(cb))
}


module.exports = invites