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
Wrap your application with the `AuthsignalProvider` component.

```jsx
import { AuthsignalProvider } from '@authsignal/react';

function App() {
  return (
    <AuthsignalProvider tenantId="<AUTHSIGNAL_TENANT_ID>" baseUrl="<AUTHSIGNAL_BASE_URL>">
      <Checkout />
    </AuthsignalProvider>
  );
}
```

Then use the `AuthChallenge` component to start the authentication flow.

```jsx
import { AuthChallenge } from '@authsignal/react';

function Checkout() {
  const [authsignalToken, setAuthsignalToken] = React.useState(null);

  const handlePayment = async () => {
    // Return the Authsignal token from your server's track action call
    const response = await fetch('/api/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    setAuthsignalToken(data.authsignalToken);
  };

  return (
    <div>
      <button type="button" onClick={handlePayment}>Pay</button>

      {authsignalToken && (
        <AuthChallenge
          token={authsignalToken}
          onChallengeSuccess={() => {
            console.log("Payment successful");
          }}
          onCancel={() => {
            console.log("Payment cancelled");
          }}
          onTokenExpired={() => {
            console.log("Token expired");
          }}
        />
      )}
    </div>
  );
}
```