const { test, mock } = require('node:test');
const assert = require('node:assert');

// Mock DOM before requiring main.js
let fileInputChangeCallback = null;
let uploadBtnClickCallback = null;

global.document = {
  querySelector: (selector) => {
    if (selector === '#photo-upload') {
      return {
        addEventListener: (event, callback) => {
          if (event === 'change') {
            fileInputChangeCallback = callback;
          }
        }
      };
    }
    if (selector === '#upload-btn') {
      return {
        addEventListener: (event, callback) => {
          if (event === 'click') {
            uploadBtnClickCallback = callback;
          }
        }
      };
    }
    if (selector === '#upload-preview') {
      return {
        innerHTML: ''
      };
    }
    return null;
  },
  querySelectorAll: () => [],
  addEventListener: () => {},
  createElement: () => ({
    classList: { add: () => {} }
  }),
};

global.window = {
  addEventListener: () => {},
  location: { pathname: '/' },
  scrollY: 0,
};

global.navigator = {
  clipboard: {
    writeText: () => Promise.resolve(),
  },
};

global.IntersectionObserver = class {
  observe() {}
  unobserve() {}
};

global.performance = {
  now: () => Date.now(),
};

global.requestAnimationFrame = (cb) => setTimeout(cb, 0);

// Mock alert
global.alert = mock.fn();

// Mock FileReader
global.FileReader = class {
  constructor() {
    this.onload = null;
  }
  readAsDataURL() {
    setTimeout(() => {
      if (this.onload) {
        this.onload({ target: { result: 'data:image/png;base64,mock' } });
      }
    }, 0);
  }
};

// Require main.js which executes the IIFEs
require('./main.js');

test('Photo Upload Handler', async (t) => {
  t.beforeEach(() => {
    global.alert.mock.resetCalls();
  });

  await t.test('Should accept valid image type', () => {
    assert.ok(fileInputChangeCallback, 'Event listener should be registered');

    // Simulate valid image file
    const mockEvent = {
      target: {
        files: [
          {
            type: 'image/jpeg',
            size: 1024
          }
        ]
      }
    };

    fileInputChangeCallback(mockEvent);
    assert.strictEqual(global.alert.mock.callCount(), 0);
  });

  await t.test('Should reject non-image file type', () => {
    assert.ok(fileInputChangeCallback, 'Event listener should be registered');

    // Simulate non-image file
    const mockEvent = {
      target: {
        files: [
          {
            type: 'application/pdf',
            size: 1024
          }
        ]
      }
    };

    fileInputChangeCallback(mockEvent);
    assert.strictEqual(global.alert.mock.callCount(), 1);
    assert.strictEqual(global.alert.mock.calls[0].arguments[0], 'Please select a valid image file');
  });

  await t.test('Should handle file without type', () => {
    assert.ok(fileInputChangeCallback, 'Event listener should be registered');

    // Simulate file without type
    const mockEvent = {
      target: {
        files: [
          {
            type: '',
            size: 1024
          }
        ]
      }
    };

    fileInputChangeCallback(mockEvent);
    assert.strictEqual(global.alert.mock.callCount(), 1);
    assert.strictEqual(global.alert.mock.calls[0].arguments[0], 'Please select a valid image file');
  });

  await t.test('Should accept exactly 5MB file', () => {
    assert.ok(fileInputChangeCallback, 'Event listener should be registered');

    // 5MB exact
    const mockEvent = {
      target: {
        files: [
          {
            type: 'image/png',
            size: 5 * 1024 * 1024
          }
        ]
      }
    };

    fileInputChangeCallback(mockEvent);
    assert.strictEqual(global.alert.mock.callCount(), 0);
  });

  await t.test('Should reject file slightly larger than 5MB', () => {
    assert.ok(fileInputChangeCallback, 'Event listener should be registered');

    // 5MB + 1 byte
    const mockEvent = {
      target: {
        files: [
          {
            type: 'image/png',
            size: 5 * 1024 * 1024 + 1
          }
        ]
      }
    };

    fileInputChangeCallback(mockEvent);
    assert.strictEqual(global.alert.mock.callCount(), 1);
    assert.strictEqual(global.alert.mock.calls[0].arguments[0], 'File size must be less than 5MB');
  });
});
