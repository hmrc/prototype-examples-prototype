const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line

const maybeRedirectBasedOnFormData = require('./views/prototype-routing-strategies/choreographed/controlled-by-form-data-conventions/serverside-redirect-by-intercepting-requests/maybeRedirectBasedOnFormData')
router.post(
  '/prototype-routing-strategies/choreographed/controlled-by-form-data-conventions/serverside-redirect-by-intercepting-requests',
  maybeRedirectBasedOnFormData
)
// to enable for forms posted to all routes,            router.post('*', maybeRedirectBasedOnSubmittedData)
// to enable for normal links as well as forms posted,  router.use(maybeRedirectBasedOnSubmittedData)

const radioButtonRedirect = require('radio-button-redirect')
router.post(
  '/prototype-routing-strategies/choreographed/controlled-by-form-data-conventions/serverside-redirect-using-radio-button-redirect-library',
  radioButtonRedirect
)

module.exports = router
