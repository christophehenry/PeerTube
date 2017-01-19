'use strict'

const express = require('express')

const constants = require('../../initializers/constants')
const db = require('../../initializers/database')
const middlewares = require('../../middlewares')
const admin = middlewares.admin
const oAuth = middlewares.oauth

const router = express.Router()

router.get('/stats',
  oAuth.authenticate,
  admin.ensureIsAdmin,
  getStatsRequests
)

// ---------------------------------------------------------------------------

module.exports = router

// ---------------------------------------------------------------------------

function getStatsRequests (req, res, next) {
  db.Request.countTotalRequests(function (err, totalRequests) {
    if (err) return next(err)

    return res.json({
      totalRequests: totalRequests,
      requestsLimitPods: constants.REQUESTS_LIMIT_PODS,
      requestsLimitPerPod: constants.REQUESTS_LIMIT_PER_POD,
      remainingMilliSeconds: db.Request.remainingMilliSeconds(),
      milliSecondsInterval: constants.REQUESTS_INTERVAL
    })
  })
}
