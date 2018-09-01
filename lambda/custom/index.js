const Alexa = require('ask-sdk-core');
const Helpers = require('./helpers');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Welcome to top movie quotes. This simple skill is designed to show off my ability to mimic speech patterns. Simply ask me to say a quote, and I will attempt to mimic a movie quote from a list of over 100 movies. Action! <audio src ="https://s3.amazonaws.com/ask-soundlibrary/home/amzn_sfx_door_shut_01.mp3" />';

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
    // pass sessionData to quote to avoid getting repeat quotes
    // const movie = Helpers.getQuote(sessionData.quote[0]);
    // const quote = Helpers.getQuote(sessionData.quote[1]);
    console.dir(attributes, { depth: null, color: true });
    const speechText = 'the quote. From the movie movie. Would you like to hear another?';

    return (
      handlerInput.responseBuilder
        .speak(speechText)
        // .withSimpleCard('Hello World', speechText)
        .reprompt(speechText)
        .getResponse()
    );
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

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent'
    );
  },
  handle(handlerInput) {
    const speechText = 'You can say hello to me!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

// TODo change this to the ending lines from Jim Carey movie //
const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent')
    );
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hello World', speechText)
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
      .speak("Sorry, I can't understand the command. Please say again.")
      .reprompt("Sorry, I can't understand the command. Please say again.")
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    GetQuoteIntentHandler,
    GetEasterEggHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
