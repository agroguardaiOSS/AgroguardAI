const { test, mock } = require('node:test');
const assert = require('node:assert');

const mockBtn = {
  textContent: 'Send',
  disabled: false,
};

const mockForm = {
  querySelector: mock.fn((selector) => {
    if (selector === '[type="submit"]') return mockBtn;
    return null;
  }),
  addEventListener: mock.fn(),
  innerHTML: '',
};

global.document = {
  querySelector: mock.fn((selector) => {
    if (selector === '#contact-form') return mockForm;
    return null;
  }),
  querySelectorAll: () => [],
};

global.window = {
  addEventListener: () => {},
  location: { pathname: '/' },
  scrollY: 0,
};

global.navigator = {};
global.IntersectionObserver = class {
  observe() {}
  unobserve() {}
};

global.alert = mock.fn();

global.fetch = mock.fn();

global.FormData = class {
  constructor() {}
  *[Symbol.iterator]() {
    yield ['name', 'Test'];
  }
};

require('./main.js');

test('initContactForm error handling', async (t) => {
  // Capture submit handler
  const submitCall = mockForm.addEventListener.mock.calls.find(c => c.arguments[0] === 'submit');
  assert.ok(submitCall, 'submit event listener should be added');
  const submitHandler = submitCall.arguments[1];

  await t.test('handles fetch rejection', async () => {
    global.fetch.mock.mockImplementationOnce(() => Promise.reject(new Error('Network error')));

    mockBtn.textContent = 'Send';
    mockBtn.disabled = false;
    global.alert.mock.resetCalls();

    const mockEvent = { preventDefault: mock.fn() };

    await submitHandler(mockEvent);

    assert.strictEqual(mockEvent.preventDefault.mock.callCount(), 1);
    assert.strictEqual(mockBtn.textContent, 'Send', 'button text should be restored');
    assert.strictEqual(mockBtn.disabled, false, 'button should be re-enabled');
    assert.strictEqual(global.alert.mock.callCount(), 1, 'alert should be called');
    assert.strictEqual(global.alert.mock.calls[0].arguments[0], 'Failed to send message. Please try again or contact us directly.');
  });

  await t.test('handles response not ok', async () => {
    global.fetch.mock.mockImplementationOnce(() => Promise.resolve({ ok: false }));

    mockBtn.textContent = 'Send';
    mockBtn.disabled = false;
    global.alert.mock.resetCalls();

    const mockEvent = { preventDefault: mock.fn() };

    await submitHandler(mockEvent);

    assert.strictEqual(mockEvent.preventDefault.mock.callCount(), 1);
    assert.strictEqual(mockBtn.textContent, 'Send', 'button text should be restored');
    assert.strictEqual(mockBtn.disabled, false, 'button should be re-enabled');
    assert.strictEqual(global.alert.mock.callCount(), 1, 'alert should be called');
    assert.strictEqual(global.alert.mock.calls[0].arguments[0], 'Failed to send message. Please try again or contact us directly.');
  });
});
