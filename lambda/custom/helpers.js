let quotes = require('./quotes');

const values = Object.values(quotes);

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

  if (!attributes.counter || attributes.counter >= values.length) {
    attributes.counter = 0;
    // shuffle quotes to randomize Alexa responses
    quotes = shuffle(values);
  }
  attributes.quoteData = quotes[attributes.counter];
  attributes.counter += 1;
  handlerInput.attributesManager.setSessionAttributes(attributes);
};

// * has to have it's own function in case user launches easter egg first
// * also prevents counter from +1
const getHiddenQuote = (handlerInput) => {
  const attributes = handlerInput.attributesManager.getSessionAttributes();
  const hiddenQuote = {
    movie: "Breaking Bad'",
    quote:
      'I am not in danger, Skyler. I am the danger. A guy opens his door and gets shot and you think that of me? No. I am the one who knocks!',
    url: process.env.HIDDEN_QUOTE,
  };

  if (!attributes.counter || attributes.counter >= values.length) {
    attributes.counter = 0;
    // shuffle quotes to randomize Alexa responses
    quotes = shuffle(values);
  }
  attributes.effect = null;
  attributes.quoteData = hiddenQuote;
  handlerInput.attributesManager.setSessionAttributes(attributes);
};

module.exports = {
  sessionData,
  getHiddenQuote,
};
