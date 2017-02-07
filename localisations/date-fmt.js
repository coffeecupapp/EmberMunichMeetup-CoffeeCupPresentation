//helpers/date-fmt.js
import Ember from "ember";

const DateFmtHelper = Ember.Helper.extend({
  formatter: Ember.inject.service(),
  compute([date]) {
    let formatter =  this.get('formatter');
    return formatter.formatDate(date);
  }
});

export default DateFmtHelper;