//routes/application.js
import Ember from "ember";
import SimpleAuthApplicationRouteMixin from "simple-auth/mixins/application-route-mixin";

const { inject } = Ember;

var ApplicationRoute = Ember.Route.extend(SimpleAuthApplicationRouteMixin, {

  responsive: inject.service(),

  model: function() {
    // Load all key models/fixture models here so you can peek in other routes
    return Ember.RSVP.hash({
      color: this.store.findAll('color'),
      menu: this.store.findAll('menu'),
      submenu: this.store.findAll('submenu'),
      countries: this.store.findAll('country'),
      currencies: this.store.findAll('currency'),
      languages: this.store.findAll('language'),
      dateFormats: this.store.findAll('date-format'),

      projects: this.store.findAll('projects'),
      clients: this.store.findAll('clients'),
      tasks: this.store.findAll('tasks')
    });

  }

  });

export default ApplicationRoute;
