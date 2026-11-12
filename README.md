# My SAS — Module 2: Authentication & User Management

**My SAS** is a multi-tenant fintech SaaS platform tailored for the Bangladesh digital commerce market. It automates customer mobile-banking payment collection, reconciliation, and SMS verification across **bKash**, **Nagad**, **Rocket (DBBL)**, and **Upay**.

This module delivers **Module 2: Authentication & User Management**, covering all 13 core screens with bank-grade security cues, WCAG AA accessibility, bilingual English/Bengali (বাংলা) internationalization, and strict fintech design principles.

---

## 🚀 Key Features & Scope (All 13 Screens)

1. **Business Owner Registration (`/register`)**: Full name, business email, password with live strength meter (score + labels + icons + recommendations), confirm password, terms acceptance, and optional Google Sign-In.
2. **Email Verification (`/verify-email`)**: Masked email (`m***t@mysas.com.bd`), resend button with 60-second cooldown timer, polite screen-reader announcements, simulated verification success flow, and expired link recovery.
3. **Secure Login & Logout (`/login`)**: Generic error handling (preventing email enumeration), password show/hide toggle, "Remember this device", brute-force rate-limiting lockout (locks after 5 failed attempts with visible countdown), and Google OAuth option.
4. **Forgot Password (`/forgot-password`)**: Email submission with neutral anti-enumeration confirmation state.
5. **Password Reset (`/reset-password`)**: Token validity validation on load, password strength meter, password confirmation, session termination, and redirect with toast.
6. **Two-Factor Authentication (2FA)**:
   - **Login Challenge (`/2fa-challenge`)**: 6-box OTP input with auto-advance, paste support, backspace navigation, rate-limit warnings, and single-use backup recovery code fallback.
   - **Setup Wizard (`/settings/security`)**: 3-step modal with QR code, manual key copy, OTP verification, and 8 emergency backup codes with `.txt` download and copy actions.
   - **Disable 2FA**: Requires current password + active OTP code re-authentication.
7. **User Profile Management (`/settings/profile`)**: Name, Bangladesh mobile format validation (`01XXXXXXXXX` or `+880`), language preference (`en` / `bn`), client-side validated avatar uploader (max 2MB, JPG/PNG/WebP, square crop, preview, upload progress), and dirty-form departure protection.
8. **Business Account Creation (`/onboarding/create-business`)**: Post-registration onboarding step with business name, category, and phone fields.
9. **Multiple Business Management & Switching (`/settings/businesses`)**:
   - Header **Business Switcher**: Active store with initials fallback, searchable list when >5 businesses, keyboard-navigable listbox (`aria-selected`), and "Add business" quick action.
   - **Businesses Page**: Responsive card grid (1 col mobile, 2 tablet, 3 desktop) with role badges (Owner, Admin, Staff), verification status badges, and switching transitions.
10. **Account Security Settings (`/settings/security`)**: Security health summary card (email verification, 2FA, password age, active session count with text + icon), change password form, and quick links.
11. **Active Session Management (`/settings/sessions`)**: Lists current and remote devices, device icons (desktop/mobile), IP addresses, Bangladesh locations, relative activity times, single-session revocation, and "Sign out of all other devices" confirmation modal.
12. **Login & Security History (`/settings/history`)**: Desktop table and mobile stacked cards, filters for status (all, success, failed/blocked) and date range (7 days, 30 days, all time), URL query persistence, tabular numerals (`tabular-nums`), and "Not you? Secure your account" alert.
13. **Account Suspension Screen (`/suspended`)**: Full-page blocking screen for restricted accounts, showing compliance reason, 24/7 support email, helpline number, and one-click ticket launch.
14. **Account Deletion Request (`/settings/delete-account`)**: 4-step wizard explaining the 14-day grace period and Bangladesh financial audit data retention rules, typing "DELETE" or email confirmation, password/2FA re-verification, and persistent pending banner with cancellation action.

---

## 🎨 Design System & Visuals

- **Primary Brand Color**: `#14595A` (Deep Teal), hover `#114E4F`, subtle `#CCFBF1`.
- **Secondary / Accent**: `#4F46E5` (Indigo accent) and `#A5B4FC` in dark mode.
- **Neutrals (Light)**: Canvas `#F8FAFC`, Surface `#FFFFFF`, Border `#E2E8F0`, Text `#0F172A`, Text Muted `#475569`.
- **Neutrals (Dark)**: Canvas `#0B1220`, Surface `#111A2E`, Border `#22304A`, Text `#E5EDF9`, Text Muted `#9FB0CC`.
- **Typography**: Latin Inter, Bengali Hind Siliguri (with line-height 1.6+ for conjunct legibility), JetBrains Mono for tabular numbers and codes.
- **Theme**: System-adaptive with manual toggle (`light`/`dark`), flash-free inline bootstrap script, and Tailwind v4 `@custom-variant dark`.
- **Anti-Slop Discipline**: No decorative pulsing dots, zero candy badge sandwiches, single-elevation card surfaces, and all semantic statuses paired with explicit text and icons.

---

## 📂 Folder Map

```
/
├── index.html                           # Entry HTML with typography preconnect & flash prevention
├── metadata.json                        # Applet manifest & server capabilities
├── package.json                         # Dependencies & scripts (dev, build, lint, test)
├── tsconfig.json                        # Strict TypeScript configuration
├── vite.config.ts                       # Vite build configuration
├── vitest.config.ts                     # Vitest testing configuration
└── src/
    ├── main.tsx                         # Client DOM render root
    ├── App.tsx                          # App root with Providers & Router
    ├── index.css                        # Tailwind v4 theme, tokens & accessibility styles
    ├── app/
    │   ├── router.tsx                   # React Router with code-splitting lazy routes
    │   ├── RouteGuards.tsx              # ProtectedRoute & PublicOnlyRoute guards
    │   └── ThemeContext.tsx             # Theme provider with system preference detection
    ├── components/
    │   ├── DevSimulationBar.tsx         # Interactive state simulator (switch any of 13 screens)
    │   └── ui/                          # Reusable UI primitives
    │       ├── Button.tsx               # Accessible button with loading and variants
    │       ├── TextField.tsx            # Form field with programmatic label association
    │       ├── PasswordField.tsx        # Password input with visibility toggle & strength hook
    │       ├── OtpInput.tsx             # 6-box auto-advancing numeric OTP input
    │       ├── Select.tsx               # Styled accessible select
    │       ├── Checkbox.tsx             # Accessible checkbox
    │       ├── Dialog.tsx               # Accessible modal with focus trap & mobile sheet animation
    │       ├── Toast.tsx                # Accessible toast provider with hover pause
    │       ├── Badge.tsx                # Status badge with text + icon
    │       ├── Skeleton.tsx             # Layout-matched skeleton loaders
    │       ├── EmptyState.tsx           # Minimal illustration-free empty state
    │       ├── ErrorState.tsx           # Assertive live error state with retry action
    │       ├── Spinner.tsx              # Accessible loader
    │       ├── CopyButton.tsx           # Clipboard copy with visual confirmation
    │       ├── ThemeToggle.tsx          # Theme switcher button
    │       ├── LanguageToggle.tsx       # EN / বাংলা language switcher
    │       └── FormError.tsx            # Assertive form error banner
    ├── features/
    │   ├── auth/                        # Registration, Login, Recovery, 2FA, Suspension
    │   ├── profile/                     # Profile form & Avatar uploader
    │   ├── business/                    # Business creation, switcher, and list
    │   ├── security/                    # Security health, password change, 2FA dialogs
    │   ├── sessions/                    # Active sessions & Paginated login history
    │   └── account-deletion/            # Deletion wizard & grace period management
    ├── locales/
    │   ├── en.json                      # Comprehensive English dictionary
    │   ├── bn.json                      # Comprehensive Bengali (বাংলা) dictionary
    │   └── I18nContext.tsx              # Localization provider with Intl formatters
    ├── lib/
    │   ├── constants.ts                 # Constants (OTP_LENGTH, BANGLADESH_PHONE_REGEX, etc.)
    │   ├── types.ts                     # Core TypeScript interfaces
    │   ├── schemas.ts                   # Zod form validation schemas
    │   ├── passwordStrength.ts          # Password strength calculator
    │   ├── mockData.ts                  # Realistic Bangladesh MFS mock data
    │   ├── devSimulator.ts              # Simulated network latency and error toggles
    │   └── supabaseAdapter.ts           # Typed Supabase Auth adapter contract
    └── test/                            # Unit tests for schemas, strength, OTP, and hooks
```

---

## 🧪 Testing

Run unit tests via Vitest:
```bash
npm run test
```
Covers:
- `passwordStrength.test.ts`: Evaluation of length, common passwords, character sets, and score thresholds.
- `schemas.test.ts`: Zod validation for registration, login, Bangladesh phone numbers (`01XXXXXXXXX`), and password changes.
- `useResendCooldown.test.ts`: 60-second cooldown decrement, timer state, and reset functionality.
- `OtpInput.test.tsx`: Auto-advancing digit inputs, paste handling, and single-digit parsing.
- `routeGuards.test.tsx`: Route redirection behavior for authenticated, unauthenticated, and suspended accounts.

---

## 🛠️ Non-Obvious Architecture Decisions

1. **Anti-Enumeration Neutrality**: Forgot password submissions and invalid login attempts return identical neutral messaging to protect merchants against targeted credential stuffing.
2. **Brute-Force Lockout Defense**: 5 failed login attempts trigger an immediate client & server-side lockout timer with a live countdown to prevent automated brute-force attacks.
3. **MFS Compliance Retention Notice**: Account deletion incorporates a 14-day revocable grace period and transparently clarifies that Bangladesh Bank transaction ledger regulations require completed SMS payment records to be retained for auditing.
4. **Interactive Dev State Simulator**: A collapsible bottom bar enables instant previewing of suspended accounts, unverified email states, pending deletion banners, 2FA challenges, network latency, and jumping between all 13 screens.
