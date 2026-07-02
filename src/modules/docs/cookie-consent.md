# Cookie Consent Banner

GDPR-compliant cookie consent banner with Accept, Decline, and Customize buttons. Features slide-up animation, localStorage persistence, and customizable links to privacy/cookie policy pages.

## Exports

**Components:** CookieConsent

## Usage

```tsx
import { CookieConsent } from '@/modules/cookie-consent';

// Add to your App or Layout component
<CookieConsent
  onAccept={() => console.log('Accepted')}
  onDecline={() => console.log('Declined')}
  onCustomize={() => openPreferencesModal()}
/>

• Auto-hides after user decision
• localStorage persistence
• Customizable policy URLs
```

