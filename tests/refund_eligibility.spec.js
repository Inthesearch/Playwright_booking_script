import {test, expect} from  "@playwright/test";

const BASE_URL = 'https://eventhub.rahulshettyacademy.com';
const email = 'abcx123@gmail.com';
const pass = 'Abc@1234';

async function loginAndGoToBooking(page){
    await page.goto(`${BASE_URL}/login`);
    await page.locator('#email').fill(email);
    await page.locator('#password').fill(pass);
    await page.locator('#login-btn').click();
    await expect(page.locator('a').filter({hasText: 'Browse Events'}).first()).toBeVisible();
}

test.describe.configure({ mode: 'serial' });

test('Single ticket booking is eligible for refund', async ({page}) => {
    // Step 1 — Login
    await loginAndGoToBooking(page);
    
    // Step 2 — Book first event with 1 ticket (default)
    await page.goto(`${BASE_URL}/events`);
    const eventList = page.getByTestId('event-card');
    await eventList.first().getByTestId('book-now-btn').click();
    await page.getByLabel('Full Name').fill('Leo Rani');
    await page.getByLabel('Email').fill('abc@abc.com');
    await page.getByLabel('Phone Number').fill('+91 72888 88111'); 
    await page.getByRole('button', {name: 'Confirm Booking'}).click();

    // Step 3 — Navigate to booking detail

    await page.getByRole('button', {name: 'View My Bookings'}).click();
    await expect(page).toHaveURL('/bookings');
    await page.getByRole('button', {name: 'View Details'}).first().click();
    await expect(page.getByText('Booking Information')).toBeVisible();

    // Step 4 — Validate booking ref

    const refNo = await page.locator('span.font-mono.font-bold').innerText();
    const eventName = await page.locator('h1').innerText();
    await expect(refNo.charAt(0)).toBe(eventName.charAt(0));

    // Step 5 — Check refund eligibility

    await page.getByRole('button', {name: 'Check eligibility for refund?'}).click();
    await expect(page.locator('#refund-spinner')).toBeVisible();
    await expect(page.locator('#refund-spinner')).not.toBeVisible({timeout: 6000});

    // Step 6 — Validate result

    const result = page.locator('#refund-result');
    await expect(result).toBeVisible();
    await expect(result).toContainText('Eligible for refund');
    await expect(result).toContainText('Single-ticket bookings qualify for a full refund');

})


// Test 2 — Group ticket booking is NOT eligible for refund

test('Group ticket booking is NOT eligible for refund', async ({page}) => {
    // Step 1 — Login
    await loginAndGoToBooking(page);
    
    // Step 2 — Book first event with 1 ticket (default)
    await page.goto(`${BASE_URL}/events`);
    const eventList = page.getByTestId('event-card');
    await eventList.first().getByTestId('book-now-btn').click();
    await page.locator('button:has-text("+")').click();
    await page.locator('button:has-text("+")').click();
    await page.getByLabel('Full Name').fill('Leo Rani');
    await page.getByLabel('Email').fill('abc@abc.com');
    await page.getByLabel('Phone Number').fill('+91 72888 88111'); 
    await page.getByRole('button', {name: 'Confirm Booking'}).click();

    // Step 3 — Navigate to booking detail

    await page.getByRole('button', {name: 'View My Bookings'}).click();
    await expect(page).toHaveURL('/bookings');
    await page.getByRole('button', {name: 'View Details'}).first().click();
    await expect(page.getByText('Booking Information')).toBeVisible();

    // Step 4 — Validate booking ref

    const refNo = await page.locator('span.font-mono.font-bold').innerText();
    const eventName = await page.locator('h1').innerText();
    await expect(refNo.charAt(0)).toBe(eventName.charAt(0));

    // Step 5 — Check refund eligibility

    await page.getByRole('button', {name: 'Check eligibility for refund?'}).click();
    await expect(page.locator('#refund-spinner')).toBeVisible();
    await expect(page.locator('#refund-spinner')).not.toBeVisible({timeout: 6000});

    // Step 6 — Validate result

    const result = page.locator('#refund-result');
    await expect(result).toBeVisible();
    await expect(result).toContainText('Not eligible for refund');
    await expect(result).toContainText('Group bookings (3 tickets) are non-refundable');

})

