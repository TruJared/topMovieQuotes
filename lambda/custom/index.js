const Alexa = require('ask-sdk-core');
const Helpers = require('./helpers');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = '<prosody rate = "105%" volume = "+2dB" > Welcome to Top Movie Quotes.</prosody>This simple skill is designed to show off my ability to mimic speech. Simply ask me to say a quote, and I will quote a line from a famous movie.';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const GetQuoteIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'GetQuoteIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.YesIntent')
    );
  },
  handle(handlerInput) {
    Helpers.sessionData(handlerInput);
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const movie = attributes.quote[0];
    const quote = attributes.quote[1];
    const speechText = `${quote} From ${movie}. Would you like to hear another?`;

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Top Movie Quotes', `${quote} From ${movie}.`)
      .reprompt(speechText)
      .getResponse();
  },
};

const GetEasterEggHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'EasterEggIntent'
    );
  },
  handle(handlerInput) {
    Helpers.getHiddenQuote(handlerInput);
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const movie = attributes.quote[0]; // ! not a movie //
    const quote = attributes.quote[1];
    const speechText = `${quote} From ${movie}. Would you like to hear another?`;

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('You Found The Hidden Quote!!', `${quote} From ${movie}.`)
      .reprompt(speechText)
      .getResponse();
  },
};

const RepeatIntentHandler = {
  canHandle(handlerInput) {
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.RepeatIntent'
      && attributes.counter
    );
  },
  handle(handlerInput) {
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const movie = attributes.quote[0];
    const quote = attributes.quote[1];
    const speechText = `${quote} From ${movie}. Would you like to hear another?`;

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const FallbackIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.FallbackIntent'
    );
  },
  handle(handlerInput) {
    const speechText = '<say-as interpret-as="interjection">Great Scott!</say-as> I\'m not sure I can handle that request right now.';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent'
    );
  },
  handle(handlerInput) {
    const speechText = 'Just ask me to say a quote.';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Top Movie Quotes -- HELP', speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NoIntent')
    );
  },
  handle(handlerInput) {
    const speechText = 'The unknown future rolls toward us. I face it, for the first time, with a sense of hope. Because if a machine, a Terminator, can learn the value of human life, maybe we can too... Goodbye';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Top Movie Quotes', speechText)
      .getResponse();
  },
};
const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    const effect = "<audio src='https://s3.amazonaws.com/ask-soundlibrary/scifi/amzn_sfx_scifi_alien_voice_04.mp3'/>";

    return handlerInput.responseBuilder
      .speak(`${effect} Malfunction. Need input.`)
      .reprompt('Malfunction. Need input.')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    GetQuoteIntentHandler,
    GetEasterEggHandler,
    RepeatIntentHandler,
    FallbackIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
