const REDIRECT = /\s*,?\s*redirect\(([^)]+)\)\s*,?\s*/

function maybeRedirectBasedOnFormData (req, res, next) {
  const form = req.body

  for (const field in form) {
    const redirect = form[field].match(REDIRECT)

    if (redirect) {
      req.session.data[field] = form[field].replace(REDIRECT, '')

      return res.redirect(redirect[1])
    }
  }

  next()
}

module.exports = maybeRedirectBasedOnFormData
