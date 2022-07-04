const maybeRedirectBasedOnFormData = require("./maybeRedirectBasedOnFormData")

describe("no redirect", () => {
  it("only executes the next action", () => {
    const next = jest.fn()
    const req = { body: {}, query: {}, session: { data: {} } }
    const res = { redirect: jest.fn() }
    maybeRedirectBasedOnFormData(req, res, next)
    expect(req).toStrictEqual({ body: {}, query: {}, session: { data: {} } })
    expect(res.redirect).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
  })
})

describe("redirect specified in any place in a form field, with or without a comma separator", () => {
  it.each([
    [{ body: { whereDoYouLive: "england,redirect(/lives-in/england)" } }, { whereDoYouLive: "england" }, "/lives-in/england"],
    [{ body: { whereDoYouLive: "redirect(/lives-in/england),england" } }, { whereDoYouLive: "england" }, "/lives-in/england"],
    [{ body: { whereDoYouLive: "england, redirect(/lives-in/england)" } }, { whereDoYouLive: "england" }, "/lives-in/england"],
    [{ body: { whereDoYouLive: "england,  redirect(/lives-in/england)" } }, { whereDoYouLive: "england" }, "/lives-in/england"],
    [{ body: { whereDoYouLive: "england ,redirect(/lives-in/england)" } }, { whereDoYouLive: "england" }, "/lives-in/england"],
    [{ body: { whereDoYouLive: "england  ,redirect(/lives-in/england)" } }, { whereDoYouLive: "england" }, "/lives-in/england"],
    [{ body: { whereDoYouLive: "england  redirect(/lives-in/england)" } }, { whereDoYouLive: "england" }, "/lives-in/england"],
    [{ body: { whereDoYouLive: "redirect(/lives-in/england)  england" } }, { whereDoYouLive: "england" }, "/lives-in/england"],
  ])('triggers a redirect and updates the session data', (params, expectedData, expectedRedirect) => {
    const next = jest.fn()
    const res = { redirect: jest.fn() }
    const req = Object.assign({ body: {}, query: {}, session: { data: {} } }, params)
    maybeRedirectBasedOnFormData(req, res, next)
    expect(req.session.data).toStrictEqual(expectedData)
    expect(res.redirect).toHaveBeenCalledWith(expectedRedirect)
    expect(next).not.toHaveBeenCalled()
  })
})
