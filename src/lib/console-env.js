'use strict';

const DEV = 'DEV';
const PRODUCTION = 'PRODUCTION';
const TEST = 'TEST';
const LOCAL = 'LOCAL';
const PRE = 'PRE';
const OTHER = 'OTHER';

class env {
  static get() {
    const { href } = window.location;
    const url = new URL(href);
    let domain = url.hostname.replace(/^(.*?)\./, '.');
    let envType = '';

    if (/cy-platform-dev\.svc\.cydata\.com\.cn/.test(url.hostname)) {
      domain = '.cy-platform-dev.svc.cydata.com.cn';
      envType = 'DEV';
    }

    if (/cy-platform\.svc\.cydata\.com\.cn/.test(url.hostname)) {
      domain = '.cy-platform.svc.cydata.com.cn';
      envType = 'TEST';
    }

    if (/daily-cy-platform-dev\.daily-svc\.cydata\.com\.cn/.test(url.hostname)) {
      domain = '.daily-cy-platform-dev.daily-svc.cydata.com.cn';
      envType = 'DEV';
    }

    if (/daily-cy-platform\.daily-svc\.cydata\.com\.cn/.test(url.hostname)) {
      domain = '.daily-cy-platform.daily-svc.cydata.com.cn';
      envType = 'TEST';
    }

    if (/^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/.test(url.hostname)) {
      domain = '';
      envType = 'LOCAL';
    }

    if (/cy-data\.com/.test(url.hostname)) {
      if (/\.pre\.cy-data\.com/.test(url.hostname)) {
        domain = '.pre.cy-data.com';
        envType = 'PRE';
      } else {
        domain = '.cy-data.com';
        envType = 'PRODUCTION';
      }
    }
    return {
      env: envType,
      domain,
    };
  }
}
env.TYPE = {
  DEV,
  TEST,
  PRODUCTION,
  PRE,
  LOCAL,
  OTHER,
};

export default env;
