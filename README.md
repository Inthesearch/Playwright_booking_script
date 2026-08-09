# Playwright Automated Booking & Verification Test

A modern end-to-end automated testing script built with **Playwright (JavaScript)** that validates an online event booking pipeline. The test handles user navigation, extracts dynamic state data before booking, completes the booking flow, and asserts real-time data accuracy post-transaction.

## 🚀 Key Features

* **Dynamic State Tracking:** Captures initial seat availability counts before processing requests.
* **Smart Locators:** Implements robust, human-centric accessibility locators (`getByRole`, `filter`).
* **Web-First Assertions:** Utilizes native auto-retrying assertions to prevent flaky tests.
* **E2E Post-Booking Verification:** Filters account history using dynamically captured Reference IDs to confirm success.

## 🛠️ Tech Stack

* **Language:** JavaScript (ES6+)
* **Framework:** [Playwright Test](https://playwright.dev)

## 📋 Core Test Logic Flow

1. **Initialization:** Navigates to the homepage utilizing a unified `baseURL` configured via `playwright.config`.
2. **State Snapshot:** Targets the event item card, reads the text content, and parses the remaining available seat count as an integer.
3. **Transaction:** Executes the checkout actions required to secure the ticket booking.
4. **Data Extraction:** Dynamically reads and sanitizes the unique booking confirmation reference string (`refNo`).
5. **Validation:** Redirects to the account bookings ledger dashboard, filters records by the extracted `refNo`, and verifies that the targeted transaction is visible and accurate.

## 💻 Getting Started

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org) installed on your machine.

### 2. Installation
Clone this repository and install the project dependencies:
```bash
git clone <your-repository-url>
cd <your-project-directory>
npm install
npx playwright install
```

### 3. Running the Tests
To execute the automation test suite, run any of the following commands in your terminal:

```bash
# Run tests in headless mode (Command Line Only)
npx playwright test

# Run tests in UI Mode (Highly recommended for interactive debugging)
npx playwright test --ui

# Run tests in Debug/Headed Mode
npx playwright test --debug
```

---
*Maintained as part of an automated QA testing workflow suite.*
