// require('rootpath')();

// TODO fix Tests call to require('dotenv').config() with path to root .env file.
//  Currently it requires the tests folder to contain its own .env file
// require('dotenv').config();

// const _ = require('lodash');

function Defs() {

  this.InitialCountes = {
    publishedDocumentsCount: 1,
    pDocumentsCount: 2,
    pFlowsCount: 1,
    outsourceJobsCount: 1
  };

  this.getAlertPromise = getAlertPromise;
// #######################################################################################################

  // process.env is not working here...
  const userKey = `floydwonderful@gmail.com`;
  this.UserKey = userKey;
  this.OktaUserPassword = `Q1w2e3r4`;

  const SendToOutsourceFlowMetadata = 'SendToOutsourceFlowMetadata';
  this.SendToOutsourceFlowMetadata = SendToOutsourceFlowMetadata;
  const flowName = "Testing " + SendToOutsourceFlowMetadata + " Flow";
  const productDescriptionName = SendToOutsourceFlowMetadata + ' Product Description @@@@';
  this.productDescriptionName = productDescriptionName;

  const CreateTestingList_0 = 'CreateTestingList_0';
  this.CreateTestingList_0 = CreateTestingList_0;

  const CreateDocumentMetadata_0 = 'CreateDocumentMetadata_0';
  this.CreateDocumentMetadata_0 = CreateDocumentMetadata_0;

  const productDescription = 'ProductDescription';
  const outputName = 'Output Document of TSOFM';
  const output = 'Output';

// #######################################################################################################
// ############################################ Operations ###############################################
// #######################################################################################################

  const itemInTableList = "item in tableList";
  this.itemInTableList = itemInTableList;

  const pDocumentsList = "documentData in pDocumentsList";
  // const publishedDocumentsList = "documentData in publishedDocumentsList";
  const progressFlowsList = "flowData in inProgressFlows";
  const outsourceJobsList = "job in outsourceJobs";

  const port = process.env.PORT;
  const serverUrl = "http://localhost:" + port + "/#";
  this.serverUrl = serverUrl;
  const hackSuffix = '?hackuser=' + userKey;
  this.hackSuffix = hackSuffix;
  const flowManagement = '/flow-management';
  const flowManagementHack = flowManagement + hackSuffix;

  const userFlow = '/userflow';
  const userDocument = '/userdocument';
  this.userDocument = userDocument;
  const outsourceJob = '/outsourcejob';

  const serverHack = serverUrl + hackSuffix;
  this.serverHack = serverHack;
  const userFlowHack = serverUrl + userFlow + hackSuffix;
  const processDocumentButtonSuffix = '-ProcessDocument';
  this.processDocumentButtonSuffix = processDocumentButtonSuffix;

  /*const progressDocumentsCount = {
    byRepeater: pDocumentsList, method: "count",
    expectedValue: "$pDocumentsCount", expectedPage: flowManagement
  };*/
  const progressDocumentsCount = {type: 'TableCount', table: 'Progress Documents',
    expectedValue: "$pDocumentsCount", expectedPage: flowManagement};
  /*const publishedDocumentsCount = {
    byRepeater: publishedDocumentsList, method: "count",
    expectedValue: "$publishedDocumentsCount", expectedPage: flowManagement
  };*/
  const publishedDocumentsCount = {type: 'TableCount', table: 'Published Documents',
    expectedValue: "$publishedDocumentsCount", expectedPage: flowManagement};
  /*const pFlowsCount = {
    byRepeater: progressFlowsList, method: "count",
    expectedValue: "$pFlowsCount", expectedPage: flowManagement
  };*/
  const pFlowsCount = {type: 'TableCount', table: 'In Progress Flows',
    expectedValue: "$pFlowsCount", expectedPage: flowManagement};
  /*const outsourceJobsCount = {
    byRepeater: outsourceJobsList, method: "count",
    expectedValue: "$outsourceJobsCount", expectedPage: flowManagement
  };*/
  const outsourceJobsCount = {type: 'TableCount', table: 'Outsource Jobs',
    expectedValue: "$outsourceJobsCount", expectedPage: flowManagement};
  const flowManagementCounts = [progressDocumentsCount, publishedDocumentsCount, pFlowsCount, outsourceJobsCount];
  this.flowManagementCounts = flowManagementCounts;
  flowManagementCounts.name = "Flow Management, Assert Counts";

  this.FlowManagementCounts = flowManagementCounts;
  this.flowManagementPage = {expectedPage: flowManagement};

  // Hack to Management
  const flowManagementHackPage = {expectedPage: flowManagementHack, name: "Flow Management"};
  this.flowManagementHackPage = flowManagementHackPage;
  this.FlowManagementHackPage = flowManagementHackPage;
  const hackToManagementF = function () {
    const pDocumentsCountTransformation = [
      {type: "repeater", value: pDocumentsList, useElementParent: true},
      {method: "count", transformation: {pDocumentsCount: "$"}}];

    /*const publishedDocumentsListCountTransformation = [{
      type: "repeater",
      value: publishedDocumentsList,
      useElementParent: true
    }, {
      method: "count",
      transformation: {publishedDocumentsCount: "$"}
    }];*/
    const publishedDocumentsListCountTransformation = [{
      type: "name",
      value: 'Published Documents'
    },{
      type: "repeater",
      value: itemInTableList,
      useElementParent: true
    },{
      method: "count",
      transformation: {publishedDocumentsCount: "$"}
    }];

    const outsourceJobsListCountTransformation = [{type: "repeater", value: outsourceJobsList, useElementParent: true},
      {method: "count", transformation: {outsourceJobsCount: "$"}}];
    const pFlowsListCountTransformation = [{type: "repeater", value: progressFlowsList, useElementParent: true},
      {method: "count", transformation: {pFlowsCount: "$"}}];
    this.flowManagementCountsInitialization = [
      publishedDocumentsListCountTransformation,
      pDocumentsCountTransformation,
      pFlowsListCountTransformation,
      outsourceJobsListCountTransformation];
  };
  const hackToManagementDef = new hackToManagementF();
  const hackManagementNoCountsInitialization = {name: 'Hack To Management', type: 'Get', link: serverHack};
  const hackManagementOperation = Object.assign({}, hackManagementNoCountsInitialization, {
    by: hackToManagementDef.flowManagementCountsInitialization});
  //this.HackToManagement = [hackManagementOperation, flowManagementHackPage];
  const HackToManagementOperation = {
    name: 'Hack To Management',
    type: 'HackManagementInitializeCounts',
    counts: {
      publishedDocumentsCount: 'Published Documents',
      pDocumentsCount:'Progress Documents',
      pFlowsCount: 'In Progress Flows',
      outsourceJobsCount: 'Outsource Jobs'
    }
  };
  this.HackToManagementOperation = HackToManagementOperation;
  this.HackToManagement = [HackToManagementOperation, flowManagementHackPage];

  this.HackToManagementCheckCounts = [hackManagementOperation, flowManagementCounts];
  this.HackToManagementCheckDefinedCounts = [hackManagementNoCountsInitialization, flowManagementCounts];

  // Go To Management
  const gotoManagementOperation = function () {
    element(by.partialLinkText('flow-management')).click();
  };
  this.goToManagement = [gotoManagementOperation, flowManagementCounts];

// Go To User Flow Page
  this.HackToUserFlow = {name: 'Hack To User Context', type: 'Get', link: userFlowHack};

  // From Management, Go To Progress Product Description
  /*const gotoProgressProductDescriptionByRepeater = [
    {type: "repeater", value: pDocumentsList, useElementParent: true},
    {type: "filter", condition: {method: "getText", operator: "startsWith", target: productDescriptionName}}];
  this.goToProgressProductDescription = {
    name: 'Go To Progress Product Description',
    type: 'Click',
    by: gotoProgressProductDescriptionByRepeater
  };*/
  this.goToProgressProductDescription = {
    name: 'Go To Progress Product Description XXX',
    type: 'ClickTableItem', table: 'Progress Documents', target: productDescriptionName};


  // From Management, Go To Done Job
  /*const gotoDoneJobByRepeater = [
    {type: "repeater", value: outsourceJobsList, useElementParent: true},
    {type: "filter", condition: {method: "getText", operator: "startsWith", target: flowName}}];
  this.goToDoneJob = {
    name: 'Go to Done Job',
    type: "Click",
    by: gotoDoneJobByRepeater
  };*/
  this.goToDoneJob = {
    name: 'Go to Done Job XXX', type: 'ClickTableItem', table: 'Outsource Jobs',
    operator: "startsWith", target: flowName};



  // From Management, Go To Progress Job
  /*const goToProgressJobByRepeater = [
    {type: "repeater", value: progressFlowsList, useElementParent: true},
    {type: "filter", condition: {method: "getText", operator: "endsWith", target: flowName}}
  ];
  this.goToProgressJob = {
    name: 'Go to Progress Job',
    type: "Click",
    by: goToProgressJobByRepeater
  };*/
  this.goToProgressJob = {
    name: 'Go to Progress Job XXX', type: 'ClickTableItem', table: 'In Progress Flows',
    operator: "endsWith", target: flowName};

  // Show Complete View
  const clickShowCompleteView = {
    name: "Click Show Complete View", method: "click", list: [
      {type: "tagName", value: "complete-view-section"},
      {type: "tagName", value: "toggle-header"},
      {type: "tagName", value: "toggle-button"},
      {type: "tagName", value: "button", method: "click"}]
  };
  this.showCompleteView = {
    name: "Show Complete View",
    type: "Click",
    by: {type: 'id', value: 'toggle-complete-view-div'}
  };
// Submit Existing Document
  this.submitOperationExistingDoc = {
    name: "Submit Existing Document",
    type: "Click",
    by: {
      type: "id",
      value: "SubmitDocument",
      transformation: {pDocumentsCount: "decrement"}
    }
  };

  // Click Output Document
  const processOutputByName = {type: 'name', value: output + processDocumentButtonSuffix};
  this.clickOutputDocument = {
    name: "Click Output Document",
    type: 'Click',
    by: processOutputByName
  };
  this.clickOutputDocumentIncrementPDocuments = {
    name: "Click Output Document",
    type: 'Click',
    by: Object.assign({}, processOutputByName, {
      transformation: {pDocumentsCount: "increment"}})
  };
  // Process Done Product Description (Server should create a new Product Description document and link it to the Progress Job)
  const processProductDescriptionByName = {type: 'name', value: productDescription + processDocumentButtonSuffix};
  this.clickProductDescriptionDocumentIncrementPDocuments = {
    name: "Click Product Description",
    type: 'Click',
    by: Object.assign({}, processProductDescriptionByName, {transformation: {pDocumentsCount: "increment"}})
  };
  // Edit Document
  const editDocumentById = {type: 'id', value: 'EditDocument'};
  // Edit Done Output
  const editDocumentByIdIncrementPDocuments = Object.assign({}, editDocumentById, {transformation: {pDocumentsCount: "increment"}});
  this.editOutputDocumentShowFirst = {
    name: "Edit Done Output, Show Complete View",
    type: "Click",
    by: [clickShowCompleteView, editDocumentByIdIncrementPDocuments]
  };
  // Edit Done Output, With Existing Progress
  this.editDoneDocument = {
    name:"Edit Done Document",
    type: "Click",
    by: editDocumentById
  };
  const editJobByIdWithExistingProgress = {type: 'id', value: 'EditJob'};
  const editJobById = Object.assign({transformation: {pFlowsCount: "increment"}}, editJobByIdWithExistingProgress);
  this.editDoneJob = {
    name: "Edit Done Job",
    type: "Click",
    by: editJobById
  };
  // Edit Done Job With Existing Progress
  this.editDoneJobWithExistingProgress = {
    name: "Edit Done Job With Existing Progress",
    type: "Click",
    by: editJobByIdWithExistingProgress
  };
  // Get Inner Element Text

  // Submit Document Successfully
  const submitDocumentById = {
    type: "id", value: "SubmitDocument",
    transformation: {pDocumentsCount: "decrement", publishedDocumentsCount: "increment"}
  };
  this.submitOperation = {
    name: "Submit Document",
    type: "Click",
    by: submitDocumentById
  };
// Submit Job Successfully
  const submitOutsourceJobById = {type: "id", value: "SubmitOutsourceJob"};
  const successBySubmitOutsourceJobId = Object.assign({}, submitOutsourceJobById,
    {transformation: {pFlowsCount: "decrement", outsourceJobsCount: "increment"}});
  this.successSubmitOutsourceJob = {
    name:"Submit Job",
    type: "Click",
    by: successBySubmitOutsourceJobId
  };
  this.clickOutputDocumentShowFirst = {
    name: "Process Output",
    type: 'Click',
    by: [clickShowCompleteView, processOutputByName]
  };
  // Delete Job
  const deleteJobById = {type: 'id', value: 'DeleteJob'};
  const deleteJobByIdDecrementJobs = Object.assign({}, deleteJobById, {transformation: {outsourceJobsCount: "decrement"}});
  this.deleteJob = {
    name: "Delete Job",
    type: "Click",
    by: deleteJobByIdDecrementJobs
  };
  // Delete Document
  const deleteDocumentById = {type: 'id', value: 'DeleteDocument'};
  this.deleteDocument = {
    name: 'Delete Document',
    type: 'Click',
    by: Object.assign({}, deleteDocumentById,
      {transformation: {publishedDocumentsCount: "decrement"}})
  };
  // Go To Owner
  this.goToOwner = {
    name: "Go To Owner",
    type: "Click",
    by: {type: "name", value: "GoToOwner"}
  };
  // Go Back
  this.goBack = {
    name: "Go Back",
    type: "Click",
    by: {type: "name", value: "GoBack"}
  };

  const productDescriptionOwnerPath = 'components.ProductDescription';
  const outputOwnerPath = 'components.Output';

  const documentNameById = {type: 'id', value: 'documentNameHeader'};

// Progress ProductDescription Page
  /*this.progressProductDescriptionPage = {
    by: documentNameById,
    expectedPage: userFlow, expectedValue: productDescriptionName,
    name: "Progress " + productDescription
  };*/
  this.progressProductDescriptionPage = function ProgressProductDescriptionPage() {
    expect(element(by.id('documentNameHeader')).getText()).toBe(productDescriptionName);
  };
// Submitted Done ProductDescription Page
  this.submittedProductDescriptionPage = createSubmitExpectation(
    productDescriptionName, userDocument, null,
    "Submitted Done " + productDescription);

  this.doneProductDescriptionPage = {
    by: documentNameById,
    expectedPage: userDocument,
    expectedValue: productDescriptionName,
    name: "Done Product Description"
  };
  // Progress Output Page
  /*this.progressOutputPage = {
    by: documentNameById,
    expectedPage: userFlow, expectedValue: outputName, name: "Progress Output Page"
  };*/
  this.progressOutputPage = function ProgressOutputPage() {
    expect(browser.getCurrentUrl()).toContain(serverUrl + userFlow);
    expect(element(by.id('documentNameHeader')).getText()).toBe(outputName);
  };

  // Done Output Page
  /*this.doneOutputPage = {
    by: documentNameById,
    expectedPage: userDocument, expectedValue: outputName, name: "Done Output Page"
  };*/
  this.doneOutputPage = function DoneOutputPage() {
    expect(browser.getCurrentUrl()).toContain(serverUrl + userDocument);
    expect(element(by.id('documentNameHeader')).getText()).toBe(outputName);
  };

  // Progress Job Page
  /*this.progressJobPage = {
    expectedPage: userFlow,
    by: documentNameById,
    expectedValue: flowName,
    name: "Progress Job Page"
  };*/
  this.progressJobPage = function ProgressJobPage() {
    expect(browser.getCurrentUrl()).toContain(serverUrl + userFlow);
    expect(element(by.id('documentNameHeader')).getText()).toBe(flowName);
  };

  // Done Job Page
  /*const jobNameById = {type: 'id', value: 'job.name'};
  this.doneJobPage = {expectedPage: outsourceJob, by: jobNameById, expectedValue: flowName, name: "Done Job Page"};*/
  this.doneJobPage = function DoneJobPage() {
    expect(browser.getCurrentUrl()).toContain(serverUrl + outsourceJob);
    expect(element(by.id('job.name')).getText()).toBe(flowName);
  };

  // Submit Document Successfully
  this.submitOperationShowFirst = {
    name: "Submit Document (Show Complete View)",
    type: "Click",
    by: [clickShowCompleteView, submitDocumentById]
  };
  // Successful Submitted Output Page
  this.submittedOutputPage = createSubmitExpectation(outputName, userDocument, null, "Success Submit, Done Output");
  // Successful Submitted Job Page
  /*this.submittedJobPage = createSubmitExpectation(flowName, outsourceJob,
    {type: "id", value: "job.name"}, "Success Submit, Done Job");*/
  this.submittedJobPage = function SubmittedJobPage() {
    const alertPromise = getAlertPromise();
    const textPromise = alertPromise.getText();
    textPromise.then(function (txt) {
      expect(txt).toContain("Done Saving " + flowName + "\nRedirect to /#" + outsourceJob);
      //expect(textPromise).toContain("Done Saving " + flowName + "\nRedirect to /#" + outsourceJob);
      alertPromise.accept();
    });
    expect(browser.getCurrentUrl()).toContain(serverUrl + outsourceJob);
    expect(element(by.id('job.name')).getText()).toBe(flowName);
  };

  const sleepInterval = -1;
  function getAlertPromise() {
    const EC = protractor.ExpectedConditions;
    browser.wait(EC.alertIsPresent(), 5000); // Waits for an alert pops up.
    if (sleepInterval > -1) {
      browser.sleep(sleepInterval);
    }
    const alertPromise = browser.switchTo().alert();
    return alertPromise;
  }

  // Confirm Expectations
  const deleteJobDialogueText = 'Delete ' + flowName + ' ?\nChildren will be set witn no Owner:' +
    '\n\t1. ' + outputOwnerPath + ': ' + outputName +
    '\n\t2. ' + productDescriptionOwnerPath + ': ' + productDescriptionName;
  this.confirmDeleteDialogue = {
    name: "Confirm Delete Job",
    expectedDialogue: deleteJobDialogueText,
    expectedDialogueAccept: true
  };
  // Confirm Delete Output
  this.confirmDeleteOutputDialogue = {
    name: "Confirm Delete Output",
    expectedDialogue: 'Delete Output',
    expectedDialogueAccept: true
  };

}

function createSubmitExpectation (expectedName, expectedPage, by, name) {
  const expectedAlert = "Done Saving " + expectedName + "\nRedirect to /#" + expectedPage;
  const expectationDef = {
    expectedAlert: expectedAlert,
    expectedPage: expectedPage
  };
  if (by) {
    expectationDef.by = by;
    expectationDef.expectedValue = expectedName;
  } else {
    expectationDef.expectedName = expectedName;
  }
  if (name) {
    expectationDef.name = name;
  }
  return expectationDef;
}

module.exports = new Defs();
