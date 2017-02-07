//helpers/currency-fmt.js
import Ember from "ember";


const CurrencyFmtHelper = Ember.Helper.extend({
  formatter: Ember.inject.service(),
  compute(params) {
    let [currencyValue, short] = params;
    let formatter =  this.get('formatter');
    return formatter.formatCurrency(currencyValue, short);
  }
});

export default CurrencyFmtHelper;