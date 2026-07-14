# Playwright Automation Demo

This project contains a Playwright + TypeScript automation framework for testing the Automation Exercise website.

## Overview

The current test coverage focuses on login validations, including:
- invalid login flow
- valid login flow

## Project Structure

- tests/ - Playwright test specs
- src/fixtures/ - custom test fixtures
- src/pages/ - page object classes
- Data/ - test data files
- storage/ - saved authentication state

## Prerequisites

- Node.js
- npm

## Installation

Install dependencies:

```bash
npm install
```

## Running Tests

Run the login validation test:

```bash
npx playwright test tests/login-flow.spec.ts
```

## Login Validation Coverage

The login validation flow includes:
1. Entering invalid credentials
2. Verifying the incorrect credentials message appears
3. Entering valid credentials
4. Verifying the user is logged in successfully

## Notes

- Test credentials are stored in Data/credentials.json
- Authentication state is saved in storage/user_auth.json
