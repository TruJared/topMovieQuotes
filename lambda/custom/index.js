const Alexa = require('ask-sdk-core');
const Helpers = require('./helpers');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Welcome to top movie quotes. This simple skill is designed to show off my ability to mimic speech. Simply ask me to say a quote, and I will attempt to mimic a movie quote from a list of over 100 movies. Action! <audio src ="https://s3.amazonaws.com/ask-soundlibrary/home/amzn_sfx_door_shut_01.mp3" />';

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
    const speechText = `${quote} From the movie ${movie}. Would you like to hear another?`;

    return (
      handlerInput.responseBuilder
        .speak(speechText)
        // .withSimpleCard('Hello World', speechText)
        .reprompt(speechText)
        .getResponse()
    );
  },
};
// todo add in Breaking Bad quote  //
const GetEasterEggHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'EasterEggIntent'
    );
  },
  handle(handlerInput) {
    const speechText = 'This is an easter egg! Would you like to hear a movie quote now?';

    return (
      handlerInput.responseBuilder
        .speak(speechText)
        // .withSimpleCard('Hello World', speechText)
        .reprompt(speechText)
        .getResponse()
    );
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
    const speechText = `${quote} From the movie ${movie}. Would you like to hear another?`;

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};
// TODO figure out how this actually works ???? //
const FallbackIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.FallbackIntent'
    );
  },
  handle(handlerInput) {
    const speechText = "Great Scott! I'm not sure I can handle that request right now";

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Top Movie Quotes', speechText)
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
    const speechText = 'Just ask me to Say a quote.';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Top Movie Quotes', speechText)
      .getResponse();
  },
};

// TODo change this to the ending lines from Jim Carey movie //
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
    const speechText = 'The unknown future rolls toward us. I face it, for the first time, with a sense of hope. Because if a machine, a Terminator, can learn the value of human life, maybe we can too.';

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

    return handlerInput.responseBuilder
      .speak('Malfunction. Need input.')
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
