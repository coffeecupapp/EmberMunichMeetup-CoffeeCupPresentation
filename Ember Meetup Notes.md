# Ember Munich Meetup 7.02.17
### CoffeeCup Case Study

# Ember updates are your friend
- The time entry list has a lot of dynamic behaviour, with drag and drop and resizing. The logic used to be all together in the controller and there were a lot of small optimisations to keep everything running well.
- We refactored all the logic out into individual components. The logic was a lot cleaner, but the performance was worse.
- We spent a lot of time analysing the render behaviour and try and figure out how we could optimise it. The problem was that every time we saved an individual model, it caused the whole page to be rerendered. This also caused issues with some jQuery components that were doing direct DOM manipulation.
- The solution was...to update Ember. We were on Ember 1.12 at the time and updating to 1.13 got us Glimmer.
- It made a huge difference and it is now faster than it was before the refactor.
- Consider planning in times for updates regularly, even if you're just sticking with the LTS releases.

# Ember Deprecations
- Ember 1.13 brought with it a whole lot of new deprecation messages.
- Make sure you read the blog, google deprecation messages.
- Deprecation messages can also be caused by dependencies, so keep that in mind when you're looking for what is causing the message.
- Searching may lead you to the issue on Github where someone has reported the warning. 
- The solution may involve updating a dependency.

# Responsive vs. Mobile Optimisation
- Responsiveness is part of optimising for mobile, but it is not everything.
- Responsiveness is important for ensuring that your site works well at any resolution, but there are fundamental differences between touch and mouse-based devices.
- There is no fool-proof way to detect touch-only devices. Please tell me I'm wrong. The unsatisfactory solution that we chose was parsing User-Agents.
- Generally you should be careful about any specific changes you make, it'll add to potential bugs and testing burden. Best choice is always to avoid inconsistencies, while still providing a good user experience.

### Things to look out for
  - No hover events.
  - Hide language regarding keyboard interation or information about keyboard shortcuts.
  - Don't forget momentum scrolling. Just feels wrong if its not there.

# When to load your data?
- Ember offers really good handling of promises, integrating with Ember Data to asynchronously load data. But I think we've all seen applications that show spinner after spinner as you go deeper into application.
- For some applications, I think particularly if users are going to visit various routes directly, then it makes a lot of sense to be flexible.
- CoffeeCup is an application that most users seem to open and leave open throughout the work day. So we wanted to keep the loading process simple, as well as avoiding some of the transitional states. The solution is simple, load everything in the application route and use peek throughout the other routes to access the data.

# WebSockets  
- Any web application that provides value for users and that they are going to use a lot and leave open throughout the day is going to have to think about when data gets refreshed. That's why we chose to use a WebSocket for our core API. WebSockets also provide a lot of value if you have multiple clients. A user isn't necessarily going to understand why they don't immediately see the updates they made in another client.
- Ember Data works really well with WebSockets, because if you work with the Array returned by the Ember Data Store then you generally get automatically updated as new data is pushed into the store from the socket.
- The exception to this rule is if you have a query. In the case of the time entries list here, we are only showing entries for a specific week and a specific user. Ember Data doesn't automatically update these results as new data comes from the WebSocket. This means if a new time entry is added or removed, the array won't be updated.
- The solution for this is to listen to the events from Socket directly, and then manually update the data. Ember Data still handles updates to individual objects, so you just need to worry about creation and deletion.

### Depending on Dependencies
- In the case of CoffeeCup the server is based on node, using the library Sails. Sails has a builtin WebSocket interface and can handle the events. 
- Sails uses a non-standard format for the WebSocket messages. However, there is an ember addon that handles the messages and adds everything to Ember Data. The only problem is that the addon isn't maintained anymore. This isn't the end of the world because the dependency isn't so big, but it has been one of the roadblocks that's kept us from updating to Ember 2.0+. 
- Something to consider regarding any dependency is:
  1. Could you write it yourself? I think this is mostly relevant to really small pieces of code. See left-pad.
  2. Is it well maintained? (e.g. How many outstanding issues are there? When were the last commits?)
  3. Are there any alternatives? If someone stops maintaining it, could I migrate to something else?
  4. Are you willing to maintain it?

# Mutability in an API / Analytics
- Having a dynamic API that always keeps data up to date is not the solution to everything.
- In some cases you want an API that is immutable.
- In our case, we have a separate REST API for analytics. This is because it would be both difficult to implement, but also unecessary. It would actually be confusing to a user if the statistics they're looking at continue to update in real time.
- A case of different tools for different situations.


# Localisation
- MomentJS/NumeralJS
- Never hardcode strings. You will forget!
- Use helpers and services
  - Services are easily accessible anywhere in your Ember application, and can make it very easy to centralise localisation logic.
  - Helpers are great because they can make these services easily accessible in your templates.

### Localisations for consistency
- If your application supports multiple localisations, it can be difficult to keep them up to date. Most importantly, they can be difficult to maintain, because as your application evolves and changes, you'll want to remove unused strings. Writing a simple test to continuously parse, and throw errors about inconsistensies can be a way to manage this, and is something that we've found quite effective. Effectively a PR can't be merged until the localisations are in sync. However, we only support German and English, so if you support many languages, and the localisations are done mostly by an external agency, I think using one language as the 'master' you could use a script to create a diff of the localisation based on a previous commit, and only send new or changed localisations to the agency.


# Testing

### jQuery callbacks
  - Using jQuery plugins can be a really quick way of integrating complicated additional functionality. In CoffeeCup we use a number of plugins such as the jQuery UI resizable and sortable plugins. Something to keep in mind is that these additions can cause issues with testing. 
  - When running an acceptance test, the test runner doesn't automatically start run loops, which happens in production. This means that if jQuery triggers an update to an Ember model out of turn, an error will be thrown during the test. The solution to this is to simply wrap updates in an Ember.run call which triggers a loop. 
  - Another point regarding jQuery plugins is you need to make sure you remove your event listeners when the containing component gets destroyed. Ember test actions run much faster than a normal person would normally click, so its a great way to discover race conditions and edge cases in your UI.

### When to write your tests?
- NOW!
- Building acceptance tests from the beginning changes the way you think about how data is encapsulated in your application. In the case of CoffeeCup we didn't have tests until after the product was relatively mature. This made building in reliable tests more difficult after the fact. Also, strange behaviour in the tests are harder to distinguish between a problem in the app or just some strange behaviour of Ember.
- Tests make it easier for new members to come into the team. New team members often don't understand all of the requirements, features and history behind a complex application. Having tests lets them make changes and get feedback when things shouldn't be changed.
