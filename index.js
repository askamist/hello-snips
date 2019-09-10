#!/usr/bin/env node

const toolkit = require("snips-toolkit");

const { withHermes } = require("hermes-javascript");

withHermes((hermes, done) => {
  try {
    const dialog = hermes.dialog();
    dialog.flow(
      "skamarnath:Addition",
      (message, flow) => {
        return addNumbers(message, flow);
      }
    );
  } catch (error) {
    console.error(error.toString());
    done();
  }
});

async function addNumbers(msg, flow) {
  const firstNumber = toolkit.message.getSlotsByName(msg, "firstNumber", {
    onlyMostConfident: true,
    threshold: 0.3
  });
  const secondNumber = toolkit.message.getSlotsByName(msg, "secondNumber", {
    onlyMostConfident: true,
    threshold: 0.3
  });
  const operator = toolkit.message.getSlotsByName(msg, "operator", {
    onlyMostConfident: true,
    threshold: 0.5
  });

  // If the slot was not found or was discarded, we throw.
  if (!firstNumber || !secondNumber) {
    flow.end();
    return `Can you say that again? I didn't quite get the ${
      firstNumber ? "second" : "first"
    } number there!`;
  }

  if (!operator) {
    flow.end();
    return `Can you say that again? I didn't quite get the ${
      firstNumber ? "second" : "first"
    } number there!`;
  }

  // Make an API call to retrieve the pokemon details.
  let sum;
  const firstVal = firstNumber.value.value,
    secondVal = secondNumber.value.value;
  switch (operator.value.value) {
    case "add":
      sum = firstVal + secondVal;
      break;
    case "subtract":
      sum = firstVal - secondVal;
      break;
    case "multiply":
      sum = firstVal * secondVal;
      break;
    case "divide":
      sum = secondVal / firstVal;
      break;
  }

  // Mark the session as ended.
  flow.end();

  // Speak!
  // return i18n.translate('addNumbers.info', {
  //  sum
  // });
  return `it would be ${sum.toFixed(2).replace(".00")}`;
}
