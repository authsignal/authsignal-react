// Inspired by https://github.com/adobe/react-spectrum/blob/93c26d8bd2dfe48a815f08c58925a977b94d6fdd/packages/%40react-aria/utils/src/platform.ts

function testUserAgent(re: RegExp) {
  if (typeof window === "undefined" || window.navigator == null) {
    return false;
  }
  return (
    // @ts-expect-error userAgentData is not supported in all browsers
    window.navigator["userAgentData"]?.brands.some(
      (brand: { brand: string; version: string }) => re.test(brand.brand),
    ) || re.test(window.navigator.userAgent)
  );
}

function isChrome() {
  return testUserAgent(/Chrome/i);
}

function isWebKit() {
  return testUserAgent(/AppleWebKit/i) && !isChrome();
}

export function isIframeInSafari() {
  return window.self !== window.top && isWebKit();
}
