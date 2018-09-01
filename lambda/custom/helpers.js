let quotes = require('./quotes');

const entries = Object.entries(quotes);

// * https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array //
const shuffle = (array) => {
  const a = array;
  let j;
  let x;
  let i;
  for (i = a.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
};

const sessionData = (handlerInput) => {
  const attributes = handlerInput.attributesManager.getSessionAttributes();

  if (!attributes.counter || attributes.counter >= entries.length) {
    attributes.counter = 0;
    // shuffle quotes to randomize Alexa responses
    quotes = shuffle(entries);
  }
  attributes.quote = quotes[attributes.counter];
  attributes.counter += 1;
  handlerInput.attributesManager.setSessionAttributes(attributes);
};

module.exports = {
  sessionData,
};
