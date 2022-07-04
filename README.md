# govuk-prototype-kit usage examples

You've copied the govuk-prototype-kit template and maybe deployed it to heroku, but how do you make it do what you want?

This repository builds on what you can find in the govuk-prototype-kit documentation.

Read the [templates and tutorials in the govuk-prototype-kit documentation](https://govuk-prototype-kit.herokuapp.com/docs/tutorials-and-examples) before implementing anything described here.

# Routing - show different pages based on the user's answers

By default, a form submits to a single location - but after asking a question you may want to show a different page depending on how the user has answered. For example, to show an error state or alternate journey.

Things you may want to prototype that your service will commonly need to do include:
* validate the format of user input and redisplay the form with error messages
* determine if the service is suitable based on users answers and display different eligibility messages depending on their current progress
* collect more information based on their previous answer

## Strategies

You know what you want to do, but you're not sure how. Below are some approaches, grouped into categories. Listing some pros and cons, and links to examples in this prototype and other external resources.

These are based on things we've seen used and had shared with us by the prototyping community within HMRC.

### 1: Choreographed

You distribute the routing rules across your prototype. Inline in page templates, or in routes in your routes.js files.

* Good, because it's easy to get started
* Good, because it can be easier to understand where you can go next when navigating the prototype
* Bad, because it can become difficult to maintain
* Bad, because it can be hard to understand the different end-to-end journeys possible through your prototype

#### 1.1: Using bespoke logic

Each time you need to route somewhere new, you write code to check the data the user submitted and redirect them accordingly.

* Good, because it's easy to start with
* Bad, because it can become hard to maintain

##### 1.1.1: In the browser, by changing the form action

The simplest bespoke approach you can take. In [the example in this prototype](/app/views/prototype-routing-strategies/choreographed/clientside-by-changing-form-action), when a user clicks a radio button, we change the form action (which is the url the form will send its data to) using javascript written in the "onchange" attribute of the radio button (which gets run when the radio button is selected).

* Good, because you can easily see where you can go next when navigating the prototype
* Good, because it's harder to break accidentally when changing a template (compared to the routing logic being maintained separately, which you have to know about)
* Good, because it needs less technical experience
* Bad, because it can be harder to use existing data from the session as part of working out where to route the user next

##### 1.1.2: In the prototype, inside the routes.js files

Can be easier to maintain complex routing rules. [This approach to branching is documented in the govuk-prototype-kit docs](https://govuk-prototype-kit.herokuapp.com/docs/make-first-prototype/branching).

* Good, because you can easily reuse existing data from the session as part of working out where to route the user next
* Bad, because it can be hard to know where you can go next when navigating the prototype
* Bad, because it can be easier to break accidentally when changing a template (compared to adding the routing logic inline in templates)
* Bad, because it needs more technical experience - specifically, understanding of [how to create routes](https://govuk-prototype-kit.herokuapp.com/docs/creating-routes)

#### 1.2: Reusing logic through conventions

You copy, install, or code some logic into your prototype that lets you declare where to redirect the user next without having to code how the redirect will be done.

* Good, because it's much more maintainable
* Good, because it makes it easier to implement routing consistently with multiple contributors

> **Note**
> You can use relative paths for your redirects, but depending on where you are redirecting from (browser or prototype) the destination will differ.
> For example, if you are on page c with a url path of /a/b/c and you redirect in the browser to ./d then you will go to /a/b/c/d
> However, if you handle the redirect in the prototype (server-side rather than client-side) then you will go to /a/b/d

##### 1.2.1: In the browser, by changing the form action

This is an extension of 1.1.1 - with this, rather than setting up a route on each radio button individually, you could adopt the [convention that the value of each radio button on the page is the next page you want to redirect to](/app/views/prototype-routing-strategies/choreographed/controlled-by-form-data-conventions/clientside-by-changing-form-action/index.html#L54-L60)

This approach still [allows for overriding on a case by case basis similarly to 1.1.1](/app/views/prototype-routing-strategies/choreographed/controlled-by-form-data-conventions/clientside-by-changing-form-action/index.html#L40-L42) and could be further generalised into something more reusable.

* Good, because it's easy to customise
* Bad, because it requires some javascript coding- currently there is no general purpose code snippet or library to use

##### 1.2.2: In the prototype, by intercepting form data

You include additional data when submitting a form that you can use to work out where to redirect the user to next.

There are multiple implementations of this in use within HMRC. I believe this is the most commonly re-used pattern for routing.

* Good, because there are general purpose code snippets and libraries you can use without needing to do any custom coding
* Good, because this approach will be familiar to lots of contributors

> **Warning**
> Your prototype must be password protected, these conventions for initiating adhoc redirects are useful but dangerous if exposed without authentication.

###### 1.2.2.1: Using code snippet commonly reused amongst HMRC services

For example, this snippet, when added to your routes.js file will intercept and form submissions and check each field in the form for a special string `redirect(/path)`. On the first match that it finds, it will extract the path, strip out the redirect(/path) (and any commas and whitespace either side of it) from the form value in your session.data.
```
const REDIRECT = /\s*,?\s*redirect\(([^)]+)\)\s*,?\s*/

router.post('*', function maybeRedirectBasedOnFormData (req, res, next) {
  const form = req.body

  for (const field in form) {
    const redirect = form[field].match(REDIRECT)

    if (redirect) {
      req.session.data[field] = form[field].replace(REDIRECT, '')

      return res.redirect(redirect[1])
    }
  }

  next()
})
```
So if you have a group of radio buttons with `name="whereDoYouLive" value="england redirect(/lives-in/england)"` then if that radio button is selected and submitted, the user will be redirected to `/lives-in/england` with `req.session.data["whereDoYouLive"] = "england"`.

[View the example in this prototype](/app/views/prototype-routing-strategies/choreographed/controlled-by-form-data-conventions/serverside-redirect-by-intercepting-requests)

* Good, because it's easy to understand and change
* Good, because it's easy to see where you can go next when navigating the prototype
* Bad, because it doesn't allow you to easily use other data from the session for more dynamic routing

> **Warning**
> There are multiple implementations of this approach in use across hmrc, we'd recommend not implementing this in a way that requires a modification to your server.js file.
> Changes to your server.js file will be overwritten when upgrading your prototype.

###### 1.2.2.2: Using the radio-button-redirect library

Similar to the pattern above (1.2.2.1) but with an alternate syntax, this library uses a `~` as a placeholder to separate the value of the form field from the location to redirect to next if it's selected.

[View the library on GitHub for installation details](https://github.com/abbott567/radio-button-redirect/), and [check out the usage example within this prototype](/app/views/prototype-routing-strategies/choreographed/controlled-by-form-data-conventions/serverside-redirect-using-radio-button-redirect-library).

* Good, a dependency is probably easier to use than copying around a code snippet
* Bad, you have to install a dependency
* Bad, harder to understand convention than 1.2.2.1 if you're not familiar with this library
  * logic is hidden in the dependency so hard to find if you want to understand how it works
  * a `~` is a good separator, but it doesn't give any hint at it's meaning, `value="england~england"` vs `value="england redirect(england)"`

### 2: Orchestrated

You control all the routing rules centrally

* Good, because it can be easier to change
* Good, because you can see the different end-to-end journeys possible through your prototype
* Bad, because it requires more technical experience to implement
* Bad, because it can be harder to understand where you can go next navigating the prototype

#### 2.1: Using the library govuk-prototype-wizard

Currently, orchestration is not a commonly used approach in HMRC. So we have no good examples or insight / recommendations to share.

A library that you could explore if interested in trying this approach, is the [govuk-prototype-wizard](https://github.com/x-govuk/govuk-prototype-wizard)