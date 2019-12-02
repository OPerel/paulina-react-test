console.log("flokitest Start Up");

const defs = require('./definitions');

class Flokitest {
  constructor(testArguments) {
    this.testArguments = testArguments || {};
    this.runDescribes = runDescribes;
    this.itOperationPairs = itOperationPairs;
    this.assertExpectedAlert = assertExpectedAlert;
  }
}

module.exports = function (testArguments) {
  return new Flokitest(testArguments);
};
/*module.exports = {
  Flokitest: Flokitest
};*/

const sleepInterval = -1;

function runDescribes(packageName, array, describeList) {
  if (describeList) {
    console.log("DescribeList: " + JSON.stringify(describeList));
  }
  let describeCounter = 1;
  array.forEach(function (describeItem) {
    const method = !describeList || describeList.includes(describeCounter) ? describe : xdescribe;
    const dName = describeCounter + ". " + packageName + ", " + camelCaseToText(describeItem.name);
    describeItem.dName = dName;
    method(dName, describeItem);
    describeCounter++;
  });
}

function camelCaseToText(cText) {
  const replaced = cText.replace(/([A-Z])/g, ' $1');
  const ans = replaced.replace(/^./, function(str){ return str.toUpperCase(); });
  return ans
}

// require('rootpath')();

function itOperationPairs(packageName, describeName, operationsPairs, itList) {
  const that = this;
  const tagJson = {/*msg : describeName, */colors : ['green', 'inverse']};
  let message = packageName + ", " + describeName + ":";
  let counter = 1;
  operationsPairs.forEach(function (operationPair) {    //console.log("operationPair: " + JSON.stringify(operationPair));
    const operation = operationPair[0];
    const expected = operationPair[1];
    const number = counter++;
    const operationExpectationInfo = computeOperationExpectationInfo(operation, expected, number);
    message += "\n\t" + operationExpectationInfo;
    const itName = "\t" + operationExpectationInfo;
    const method = itList != null && !itList.includes(number) ? xit : it;
    method(itName, function () {//      if (number == 1){        //logger({}).log(describeName);      }
      logger({}).log(" " + itName);
      doOperation.call(that, operation, number);
      doAssertions.call(that, expected, number);
    });
  });
  logger(tagJson).log(message);
}

function computeOperationExpectationInfo(operation, expected, number) {
  const expectedMessage = createExpectedMessage(expected);
  const nameValue = operation.name || "";
  const operationInfo = number + ". " + nameValue/* + ", " + operation.type*/;
  return operationInfo + ",\n\t " + expectedMessage;
}

function createExpectedMessage(expected) {
  let expectedMessage = "Expect";
  if (Array.isArray(expected) && !expected.name) {
    expectedMessage += computeExpectedMessage(expected[0]);
    for (let i = 1; i < expected.length; i++) {
      const item = expected[i];
      expectedMessage += "\n\t\t" + computeExpectedMessage(item);
    }
  } else {
    expectedMessage += computeExpectedMessage(expected);
  }
  return expectedMessage;
}

function computeExpectedMessage(expected) {
  let innerMessage = "";
  if (expected) {
    if (expected.name){
      innerMessage += " " + expected.name;
    }
    else {
      if (expected.expectedPage) innerMessage += " Page " + expected.expectedPage;
      if (expected.expectedName) innerMessage += " Name " + expected.expectedName;
      if (expected.expectedAlert) innerMessage += " Alert " + expected.expectedAlert;
      if (expected.expectedDialogue) innerMessage += " Alert " + expected.expectedDialogue;
    }
  }
  return innerMessage;
}

function doAssertions(expected) {
  if (typeof expected === 'function'){
    expected();
  }
  else {
    const that = this;
    if (Array.isArray(expected)) {
      expected.forEach(function (item) {
        doAssertions.call(that, item);
      })
    }
    else {
      doPageAssertions.call(that, expected);
    }
  }
}

function computeOperationPromise(operation) {
  let promise;
  switch (operation.type) {
    case "Refresh":
      promise = browser.refresh();
      break;
    case "Get":
      browser.get(operation.link);
      break;
    default:
      break;
  }
  return promise;
}

const repeaterDef = 'item in tableList';
/* Click on a row in a table according to operation target */
function ClickTableItem(operation) {
  const tableName = operation.table;
  console.log('Click Table ' + tableName + ' item ' + operation.target);
  const columns = element(by.name(tableName)).all(by.repeater(repeaterDef));
  columns.filter(function (elm) {
    return elm.getText().then(function (text) {
      const operator = operation.operator;
      const target = operation.target;
      return operator ? text[operator](target) : text.startsWith(target);
    });
  }).first().click();/*  let found = false;  element(by.name(expected.table)).all(by.repeater(repeaterDef))    .filter(function (rowFinder) {      rowFinder.getText().then(function (txt) {        if (!found) {          if (txt.startsWith(expected.target)) {            rowFinder.click();            found = true;          }        }      });  });*/
}

/* Hack to Management Page.
* Retrieve from each of the tables in operation.counts the number of records in the table
* and initialize this flokitest count variable */
function HackManagementInitializeCounts(operation) {
  const counts = operation.counts;
  console.log('Hack Management Initialize Counts ' + JSON.stringify(counts));
  browser.get(defs.serverHack);
  const that = this;
  Object.keys(counts).forEach(countKey => {
    const tableName = counts[countKey];
    console.log('Init Counter ' + countKey + ' with table ' + tableName);
    const transformation = {[countKey]: "$"};    //transformation[countKey] = "$";
    const promise = element(by.name(tableName)).all(by.repeater(defs.itemInTableList)).count();
    promise.then(function (value) {
      doTransformation.call(that, transformation, value)
    });
  });
}
const operationsMap = {
  ClickTableItem,
  HackManagementInitializeCounts
};

const debugOp = 3;
function doOperation(operation, counter) {
  if (counter >= debugOp){
    console.log(counter);
  }
  if (typeof operation === 'function'){
    operation();
    return;
  }
  if (operation.type){
    const operationFunction = operationsMap[operation.type];
    if (operationFunction){
      operationFunction.call(this, operation);
      return;
    }
  }
  doOperationV1.call(this, operation);
}

function doOperationV1(operation) {
  const operationCallback = computeOperationCallback(operation);
  let promise = computeOperationPromise(operation);
  if (!operationCallback) {
    return;
  }
  let byDef = operation.by;
  if (byDef) {
    const method = byDef.method;
    processDefinition.call(this, byDef, method, operationCallback);
  } else if (promise) {
    promise.then(function (finder) {
      operationCallback(finder);
    });
  }
}

function computeOperationCallback(operation) {
  let operationCallback;
  switch (operation.type) {
    case "Get":
      if (operation.by) {
        operationCallback = function (elementFinder) {
          return elementFinder.getText();
        };
      }
      break;
    case "Click":
      operationCallback = function (elementFinder) {
        return elementFinder ? elementFinder.click() : null;
      };
      break;
    default:
      operationCallback = function (elementFinder) {
        return elementFinder ? elementFinder.getText() : null;
      };
      break;
  }
  return operationCallback;
}

function flatten(array) {
  let flattenArray = [];
  array.forEach(function (element) {
    if (Array.isArray(element)){
      flattenArray = flattenArray.concat(flatten(element));
    }
    else {
      flattenArray.push(element);
    }
  });
  return flattenArray;
}

function computeElementFinder(byDef, operationCallback) {
  let elementFinder;
  if (byDef.list) {
    elementFinder = computeFinderFromByList(byDef.list, element);
  } else if (!Array.isArray(byDef)) {
    const parentFinder = element;
    elementFinder = computeFinder(byDef, parentFinder, operationCallback);
  }
  return elementFinder;
}

function computePromiseCallback(byDef, elementFinder, operationCallback) {
  const that = this;
  let callback = Array.isArray(byDef) || byDef.list ? operationCallback : function (opResult) {
    doTransformation.call(that, byDef.transformation, opResult);
    let nextFinder;
    if (byDef.childIndex){
      nextFinder = opResult[byDef.childIndex];
    }
    else {
      nextFinder = elementFinder;
    }
    operationCallback(nextFinder, opResult);
  };
  return callback;
}

function processDefinition(byDef, method, operationCallback) {/*    const byDefCallback = byDef.callback;    const operationCallbackC = byDefCallback ? byDefCallback : function (rowItem){      rowItem.click();    };    */
  const elementFinder = computeElementFinder(byDef, operationCallback);
  const promise = computePromise.call(this, byDef, elementFinder, method);
  const callback = computePromiseCallback.call(this, byDef, elementFinder, operationCallback);
  if (promise) {
    promise.then(callback);
  } else {
    callback(elementFinder);
  }
}

function computePromise(byDef, elementFinder, method) {
  if (Array.isArray(byDef)) {
    return processByArray.call(this, flatten(byDef), 0, element);
  }
  switch (byDef.type) {
    case "repeater":
      return null;
    case "filter":
      return elementFinder;
  }
  const sendKeysInput = byDef.input;
  const childIndex = byDef.childIndex;
  const useAll = byDef.useAll;
  try {
    return switchMethod.call(this,
      elementFinder, method, sendKeysInput, childIndex, useAll);
  } catch (er) {
    console.warn(er);
  }
}

function processByArray(byArray, index, nextFinder) {
  const rowItemHolder = {};
  const byDef = byArray[index];
  const finders = computeFinders(byDef, nextFinder, index, byArray, rowItemHolder);
  processPromise.call(this, byDef, finders.elementFinder, finders.parentFinder, rowItemHolder, byArray, index);
  return {then: function (callback) {
      byArray.eCallback = callback;
    }};
}

function processPromise(byDef, elementFinder, parentFinder, rowItemHolder, byArray, index) {
  const that = this;
  const method = byDef.method;
  const promise = computePromise.call(this, byDef, elementFinder, method);
  if (promise) {
    promise.then(function (opResult) {
      console.log(JSON.stringify({opResult, byDef}));
      const byDefNextFinder = rowItemHolder.data/* ? rowItemHolder.data : elementFinder FAILS THE Tests*/;
      doNext.call(that, opResult, byDefNextFinder);
    });
  } else {
    doNext.call(that, null, elementFinder);
  }

  function doNext(opResult, byDefNextFinder) {
    //console.log("\t" + index + ". By " + JSON.stringify(byDef) + " " + opResult);
    doTransformation.call(that, byDef.transformation, opResult);
    let nextFinder = computeNextFinder(opResult, byArray, byDef, parentFinder, byDefNextFinder);
    if (index + 1 < byArray.length) {
      processByArray.call(this, byArray, index + 1, nextFinder);
    } else {
      if (byArray.eCallback) {
        byArray.eCallback(elementFinder);
      }
    }
  }
}

function doTransformation(transformation, value) {
  if (transformation == null){
    return;
  }
  //console.log("\t\tTransformation: " + JSON.stringify(transformation) + " value: " + value);
  for (let key in transformation){
    const tValue = transformation[key];
    let newValue;
    switch (tValue){
      case "increment":
        newValue = this.testArguments[key] + 1;
        break;
      case "decrement":
        newValue = this.testArguments[key] - 1;
        break;
      case "increaseSuffixCounter":
        if (!value){
          value = this.testArguments[key];
        }
        newValue = increaseSuffixCounter(value);
        break;
      case "$":
        newValue = value;
        break;
      default:
        throw new Error("Failed to transform value from " + value);
    }
    console.log('Set ' + key + ' = ' + newValue);
    this.testArguments[key] = newValue;
  }
}

function computeFinders(byDef, parentFinder, index, byArray, rowItemHolder) {
  let elementFinder;
  if (byDef.list) {
    elementFinder = computeFinderFromByList(byDef.list, parentFinder);
  } else {
    if (byDef.useElementParent) {
      parentFinder = element;
    }
    if (byDef.type) {
      const isLast = index === byArray.length - 1;
      const finderCallback = isLast ? function (rowItem) {
        rowItem.click();
      } : function (rowItem) {
        console.log('Set Row Item Data of ' + JSON.stringify(byDef));
        rowItemHolder.data = rowItem;
      };
      elementFinder = computeFinder(byDef, parentFinder, finderCallback);
    } else {
      elementFinder = byDef.lastArrayIndex == null ? parentFinder : byArray.lastArray[byDef.lastArrayIndex];
    }
  }
  return {elementFinder, parentFinder};
}

function computeFinderFromByList(list, parentFinder) {
  let elementFinder;
  for (let i in list) {
    const byDefElement = list[i];
    const target = i == 0 ? parentFinder : elementFinder.element;
    const byObject = by[byDefElement.type](byDefElement.value);
    elementFinder = target.call(elementFinder, byObject);
  }
  return elementFinder;
}

function computeFinder(byDef, parentFinder, callback) {
  let finder;
  switch (byDef.type) {
    case "filter":
      let found = false;
      finder = parentFinder.filter(function (rowFinder) {
        const condition = byDef.condition;
        const methodFinder = rowFinder[condition.method]();
        methodFinder.then(function (txt) {
          if (found){
            return;
          }
          const ans = txt[condition.operator](condition.target);
          if (ans) {
            callback(rowFinder);
            found = true;
          }
        });
      });
      break;
    default:
      const byObject = by[byDef.type](byDef.value);
      if (byDef.childIndex != null || byDef.useAll || byDef.type == "repeater") {
        finder = parentFinder.all(byObject);
        if (byDef.next){
          finder = finder[byDef.next]();
        }
      } else {
        finder = parentFinder(byObject);
      }
      break;
  }
  return finder;
}


function sendKeysPromise(byInput, elementFinder) {
  const input = computeSendKeysInput.call(this, byInput);
  let promise;
  if (Array.isArray(input)) {
    for (let i in input) {
      const value = input[i];
      promise = elementFinder.sendKeys(value);
    }
  } else {
    promise = elementFinder.sendKeys(input);
  }
  return promise;
}

function switchMethod(elementFinder, method, sendKeysInput, childIndex, useAll) {
  let promise;
  switch (method) {
    case "sendKeys":
      promise = sendKeysPromise.call(this, sendKeysInput, elementFinder);
      break;
    case "count":
      promise = elementFinder.count();
      break;
    case "click":
      promise = elementFinder.click();
      break;
    case "text":
      promise = elementFinder.getText();
      break;
    default:
      if (childIndex != null || useAll) {// TODO Check if necessary to do if: byDef.childIndex != null || byDef.useAll
        return elementFinder;
      }
      if (elementFinder.getText){
        promise = elementFinder.getText();
      }
      break;
  }
  return promise;
}

function computeNextFinder(opResult, byArray, byDef, parentFinder, byDefNextFinder) {
  const isArray = Array.isArray(opResult);
  if (isArray) {
    byArray.lastArray = opResult;
  }
  let nextFinder;
  if (byDefNextFinder) {
    nextFinder = byDefNextFinder;
  } else {
    if (isArray) {
      if (byDef.childIndex == null) {
        nextFinder = opResult;
      } else {
        nextFinder = opResult[byDef.childIndex];
      }
    }
    else {
      nextFinder = parentFinder;
    }
  }
  return nextFinder;
}

function computeSendKeysInput(byInput) {
  if (Array.isArray(byInput)) {
    const input = Object.assign([], byInput);
    for (let i in input) {
      const value = transformInput.call(this, input[i]);
      if (value) {
        input[i] = value;
      } else {
        console.warn("Failed to transform input " + i + ": " + input[i]);
      }
    }
    return input;
  } else {
    return transformInput.call(this, input);
  }
}

function transformInput(input) {
  if (!input.startsWith('$')){
    return input;
  }
  const key = input.substr(1);
  const value = this.testArguments[key];
  return value;
}

function increaseSuffixCounter(innerTdText) {
  if (innerTdText == null){
    return null;
  }
  const splitArray = innerTdText.split(" ");
  const counterString = splitArray[splitArray.length - 1];
  let counter = Number(counterString);
  counter++;
  splitArray[splitArray.length - 1] = counter;
  const newInnerTdValue = splitArray.join(" ");
  return newInnerTdValue;
}

/* Assert a Table has the expected records count */
function TableCount(expected) {
  const expectedValue = computeExpectedValue.call(this, expected.expectedValue);
  console.log('Expect Table ' + expected.table + ' Count to be ' + expectedValue);
  const finder = element(by.name(expected.table)).all(by.repeater(repeaterDef));
  const promise = finder.count();
  expect(promise).toBe(expectedValue);
}
const assertionsMap = {
  TableCount
};

function doPageAssertions(expected) {

  if (expected.type){
    const assertFunction = assertionsMap[expected.type];
    assertFunction.call(this, expected);
    return;
  }

  if (expected.expectedAlert) {
    assertExpectedAlert(expected.expectedAlert);
  }
  assertExpectedDialogue(expected);
  assertExpectedPage(expected);
  const checked = assertByValueFinder.call(this, expected);
  if (!checked){
    assertByDef.call(this, expected);
  }
}

function assertByDef(expected) {
  let byDef = expected.by;
  if (!byDef) {
    return;
  }

  function processDefinitionAssertExpectation(method, expectedValueDefinition) {
    const expectedValue = computeExpectedValue.call(this, expectedValueDefinition);
    processDefinition.call(this, byDef, method, function (elementFinder, opResult) {
      const expectation = expect(opResult || elementFinder.getText());
      let expectedOperator = expected.operator;
      if (expectedOperator == null) {
        switch (method) {
          case 'text':
            expectedOperator = 'toEqual';
            break;
        }
      }
      assertExpectation(expectation, expectedValue, expectedOperator);
    });
  }

  const methods = byDef.methods;
  if (methods) {
    const keys = Object.keys(methods);
    for (let i in keys) {
      const method = keys[i];
      const expectedValueDefinition = methods[method];
      processDefinitionAssertExpectation.call(this, method, expectedValueDefinition);
    }
  } else {
    const method = byDef.method;
    const expectedValueDefinition = expected.expectedValue;
    processDefinitionAssertExpectation.call(this, method, expectedValueDefinition);
  }
}

function assertByValueFinder(expected) {
  let valueFinder;
  if (expected.byModel) {
    const inputFinder = element(by.model(expected.byModel));
    valueFinder = inputFinder.getAttribute(expected.attribute);
  } else if (expected.byRepeater) {
    const inputFinder = element.all(by.repeater(expected.byRepeater));
    valueFinder = inputFinder[expected.method]();
  }
  else if (expected.by){
    valueFinder = computeElementFinder(expected.by);
  }
  if (valueFinder != null) {
    const expectation = expect(valueFinder);
    const expectedValueDefinition = expected.expectedValue;
    const expectedValue = computeExpectedValue.call(this, expectedValueDefinition);
    const expectedOperator = expected.operator;
    assertExpectation(expectation, expectedValue, expectedOperator);
    return true;
  }
}

function assertExpectedAlert(expectedAlert) {
  const alertPromise = defs.getAlertPromise();
  const allertTextPromise = alertPromise.getText();
  expect(allertTextPromise).toContain(expectedAlert);
  alertPromise.accept();
}

function assertExpectedDialogue(expected) {
  if (expected.expectedDialogue) {
    const alertPromise = defs.getAlertPromise();
    const allertTextPromise = alertPromise.getText();
    expect(allertTextPromise).toContain(expected.expectedDialogue);
    if (expected.expectedDialogueAccept) {
      alertPromise.accept(); // Use to accept (simulate clicking ok)
    } else {
      alertPromise.dismiss(); // Use to simulate cancel button
    }
  }
}

function assertExpectedPage(expected) {
  if (expected.expectedPage) {// TODO Remove expectedPage property, logic should be in json
    const expectedUrl = defs.serverUrl + expected.expectedPage;
    expect(browser.getCurrentUrl()).toContain(expectedUrl);
  }
}

function computeExpectedValue(expectedValueDefinition) {
  if (isString(expectedValueDefinition) && expectedValueDefinition.startsWith("$")) {
    expectedValueDefinition = this.testArguments[expectedValueDefinition.substring(1)];
  }
  return expectedValueDefinition;
}

function assertExpectation(expectation, expectedValue, expectedOperator) {
  switch (expectedOperator) {
    case "toStartWith":
      expectation.toStartWith(expectedValue);
      break;
    case "toContain":
      expectation.toContain(expectedValue);
      break;
    case "toEqual":
      expectation.toEqual(expectedValue);
      break;
    case "toBe":
    default:
      expectation.toBe(expectedValue);/*      if (promise){        promise.then(function (opResult) {          //expect(opResult).toEqual(expectedValue);          expect(opResult).toBe(expectedValue);        });      }      else {        expectation.toBe(expectedValue);      }*/
      break;
  }
}

function isString(ob) {
  return typeof ob == 'string' || ob instanceof String;
}

function logger(tgJson) {
  return {log: function (message) {
    console.log((tgJson.msg ? tgJson.msg + (message ? ": " + message : "") : (message ? message : "")));
  }};
}
/*
// const scribe = require('scribe-js')({createDefaultConsole : false});
const logFolder = '../logs/TestsLogs';//don't pass a logWriter config, but a custom LogWriter instead
const config = {console : {colors : 'inverse'}};
const logWriter = new scribe.LogWriter(logFolder);
const cons = scribe.console(config, logWriter);
function logger(tgJson) {return cons.tag(tgJson).time().file();}
const tagJson = {msg : 'TESTS', colors : ['green', 'inverse']};//black red green yellow blue magenta cyan white gray grey
logger(tagJson).log("flokitest.js Start Up");*/

