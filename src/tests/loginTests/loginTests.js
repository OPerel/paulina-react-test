const packageName = 'Okta Authentication';

const testFlow = [1, 2, 3, 4];
// const justOne = [2];
const TestsDescribeList = testFlow;

// require('rootpath')();
const Flokitest = require('../flokitest');
const defs = require('../definitions');
const flokitest = new Flokitest(defs.InitialCountes);

const rootUrl = 'http://localhost:3000/';
const loginPage = rootUrl + 'login';
const flowManagementPage = rootUrl + 'flow-management';

const loginSleepTime = 5000;

const newUserName = 'TestUser_' + new Date().getTime();
const newUserEmail = newUserName + '@test.com';

// Not sure why this is needed. synctractor is suppose to tkae care of this.
// Maybe we need to make calls to Okta using synctractor.
browser.ignoreSynchronization = true; 

// Operations
function GoToHomePage() {
  console.log("Go To Home Page");
  browser.get(rootUrl);
}

function GoToOktaLoginPageViaButton() {
  console.log("Go To Okta Login Page via Button");
  element(by.id('login')).click();
}

function GoToOktaLoginPageViaUrl() {
  console.log("Go To Okta Login Page via URL");
  browser.get(loginPage);
}

function FillFalseUserData() {
  element(by.name('username')).sendKeys('john@dow.com');
  element(by.name('password')).sendKeys('qwertyuiop');
  // Press the Sign In Button.
  element(by.id('okta-signin-submit')).click();
  // Wait 3 seconds for Failure sign-in response
  browser.sleep(loginSleepTime);
}

function GoToFlowManagementPage() {
  console.log('Go to flow management page');
  browser.get(flowManagementPage);
  browser.sleep(2000);
}

function SuccessLogin() {
  element(by.name('username')).sendKeys(defs.UserKey);
  element(by.name('password')).sendKeys(defs.OktaUserPassword);
  // Press the Sign In Button.
  element(by.id('okta-signin-submit')).click();
  browser.sleep(14000);
}

function ClickLogOut() {
  console.log('Click Log Out and Expect Login Elements After logging Out')
  element(by.id('logout')).click();
  browser.sleep(3000);
}

function ClickSignUp() {
  console.log('Click Sign up and Expect Registration Elements')
  element(by.className('registration-link')).click();
  browser.sleep(2000);
}

function RegisterNewUser() {
  element(by.name('email')).sendKeys(newUserEmail);
  element(by.name('password')).sendKeys('Qwertyui1');
  element(by.name('firstName')).sendKeys(newUserName);
  element(by.name('lastName')).sendKeys('Paulina');
  element(by.buttonText('Register')).click();
  browser.sleep(14000);
}

// Expectations
function HomePageTitle() {
  console.log("Expect Home Page Title Elements");
  expect(element(by.tagName('h1')).getText()).toBe('Welcome to FlowBiz!');
}

function LoginButton() {
  console.log("Expect Login Button Elements");
  expect(element(by.id('login')).getText()).toBe('Log In');
}

function LoginElements() {
  console.log("Expect Login Elements");
  // Get the sign-in label text by its class name (okta-form-title o-form-head)
  // and check that the label text equals to 'Sign in to WonderFlow'
  expect(element(by.className('okta-form-title o-form-head')).getText())
    .toBe('Sign in to WonderFlow');
}

function HomePageLink() {
  console.log("Expect Home Page Link Elements");
  expect(element(by.id('home-link')).getText()).toBe('Home');
}

function SignInFailureAlert() {
  expect(element(by.className('okta-form-infobox-error infobox infobox-error')).getText())
    .toBe('Sign in failed!');
}

function LogOutButton() {
  // check for logout button element after login.
  console.log('Expect log out button')
  expect(element(by.id('logout')).getText()).toBe('Log Out');
}

function FloydUserEmail() {
  console.log('Expect Floyd\'s user email')
  expect(element(by.id('email')).getText()).toBe(defs.UserKey);
}

function NewUserEmail() {
  console.log('Expect test user email')
  expect(element(by.id('email')).getText()).toBe(newUserEmail);
}

function FlowManagementTitle() {
  console.log('Expect Flow Management header');
  expect(element(by.tagName('h2')).getText()).toBe('Flow Management!');
}

function SignUpButton() {
  console.log('Expect sign up button')
  expect(element(by.className('registration-link')).getText()).toBe('Sign up');
}

function RegistrationElements() {
  console.log("Expect Registration Elements");
  expect(element(by.className('okta-form-title o-form-head')).getText())
    .toBe('Create Account');
}

function FailureLogin() {
  flokitest.itOperationPairs(packageName, 'Home and Login Pages', [
    // 1. Go to Home Page, Expect home page title and login button elements
    [GoToHomePage, [HomePageTitle, LoginButton]],
    // 2. Click login button, Expect Okta login and home link elements
    [GoToOktaLoginPageViaButton, [LoginElements, HomePageLink]],
    // 3. Try to Login as False user and Fail
    [FillFalseUserData, SignInFailureAlert]
  ]);
}

function SuccessfulLogin() {
  flokitest.itOperationPairs(packageName, 'Success Login', [
    // 1. Try flow-management without login
    // TODO unmark httpUtil.js handleResponse() alert in case of an error and this SessionNotFoundAlert expectation and assert that test still passes
    [GoToFlowManagementPage, [/*SessionNotFoundAlert, */LoginElements]],
    // 2. Login as Valid User, Expect flow management header
    // TODO: for next 3 tests, implement FlowManagementCounts that works with new paulina
    [SuccessLogin, [LogOutButton, FlowManagementTitle, FloydUserEmail]],
    // 3. Go to Flow Management page (Reload), Expect flow-management page
    [GoToFlowManagementPage, [LogOutButton/*, defs.FlowManagementCounts*/]],
    // 5. Go to Login Page when user is already logged-in, Expect logout button 
    [GoToOktaLoginPageViaUrl, [LogOutButton, FlowManagementTitle, FloydUserEmail]],
    // 6. Click logout button and expect okta login page.
    [ClickLogOut, LoginElements]
  ]);
}

function NewUserRegistration() {
  flokitest.itOperationPairs(packageName, 'Register User', [
    // 1. Go To Okta Login Page, Expect login page elements
    [GoToOktaLoginPageViaUrl, SignUpButton],
    // 2. Click sign up button, Expect Registration elements
    [ClickSignUp, RegistrationElements],
    // 3. Register new user, Expect logput button and user email ,Should also expect flow-management page
    // TODO: fix login and registration and uncomment check for flow-management page
    [RegisterNewUser, [LogOutButton, NewUserEmail/*, FlowManagementTitle */]]
  ]);
}

const describeArray = [
  FailureLogin,//1
  SuccessfulLogin,//2
  NewUserRegistration,//3
];

flokitest.runDescribes(packageName, describeArray, TestsDescribeList);