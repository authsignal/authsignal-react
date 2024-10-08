🚧 Work in progress: Not intended for production use. 🚧 

## Installation
Add `@authsignal/react` to your `package.json` dependencies.

### NPM
```bash
npm install @authsignal/react
```

### Yarn
```bash
yarn add @authsignal/react
```

## Usage
Add the `Authsignal` component to your app. Generally, this should be placed at the root of your app.

```jsx
import { Authsignal } from '@authsignal/react';

function App() {
  return (
    <div>
      <Checkout />
      <Authsignal tenantId="YOUR_TENANT_ID" baseUrl="YOUR_BASE_URL" />
    </div>
  );
}
```
Import the `useAuthsignal` hook in your component.

Then pass the `challengeOptions` returned from your server to the `startChallenge` function.

```jsx
import { useAuthsignal } from '@authsignal/react';

export function Checkout() {
  const { startChallenge } = useAuthsignal();

  const handlePayment = async () => {
    const response = await fetch('/api/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (data.challengeOptions) {
       startChallenge({
        ...challengeOptions,
          onChallengeSuccess: ({ token }) => {
            // Challenge was successful
          },
          onCancel: () => {
            // User cancelled the challenge
          },
          onTokenExpired: () => {
            // Token expired
          },
        });
    }
  };

  return (
    <div>
      <button type="button" onClick={handlePayment}>Pay</button>
    </div>
  );
}
```

Alternatively, you can use the `startChallengeAsync` function to work with promises.

```jsx
import { useAuthsignal } from '@authsignal/react';

export function Checkout() {
  const { startChallengeAsync } = useAuthsignal();

  const handlePayment = async () => {
    setIsLoading(true);

    const response = await fetch('/api/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (data.challengeOptions) {
      try {
        const { token } = await startChallengeAsync({
          ...challengeOptions,
        });

        // Challenge was successful
      } catch (e) {
        if (e instanceof ChallengeError) {
          console.error(e);
          if (e.code === "USER_CANCELLED") {
            // User cancelled the challenge
          } else if (e.code === "TOKEN_EXPIRED") {
            // Token expired
          }
        }
      }
    }

    setIsLoading(false);
  };

  return (
    <div>
      <button type="button" onClick={handlePayment}>Pay</button>
    </div>
  );
}
```

