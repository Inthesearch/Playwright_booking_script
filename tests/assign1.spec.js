import { test, expect } from '@playwright/test';
import { text } from 'node:stream/consumers';

const email = 'abcx123@gmail.com';
const pass = 'Abc@1234';
const testEvent = `Test Event ${Date.now()}`;
let seatBeforeBooking;
let refNo;
let seatAfterBooking;
let bookedEvent;
test('booking verification', async ({page}, testInfo) => {
    await page.goto('/');
    await page.locator('#email').fill(email);
    await page.locator('#password').fill(pass);
    await page.locator('#login-btn').click();
    await expect(page.locator('a').filter({hasText: 'Browse Events'}).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Browse Events' }).first()).toBeVisible();
    await page.goto('/admin/events');
    await page.locator('#event-title-input').fill(testEvent);
    await page.locator('#admin-event-form textarea').fill('event for assignemnt no. 1');
    await page.getByLabel('City').fill('Calgary');
    await page.getByLabel('Venue').fill('Scotia arena');
    await page.getByLabel('Event Date & Time').fill('2027-12-31T10:00');
    await page.locator('#price-\\(\\$\\)').fill('100');
    await page.getByLabel('Total Seats').fill('50');
    await page.locator('#add-event-btn').click();
    await expect(page.getByText('Event created!')).toBeVisible();

    // Step 3

    await page.goto('/events');
    const cardList = await page.locator('article');
    await expect(cardList.nth(1)).toBeVisible();
    const bookedEventCard = cardList.filter({hasText: testEvent})
    await expect(bookedEventCard).toBeVisible({timeout:5000});
    seatBeforeBooking = parseInt(await bookedEventCard.getByText('seat').first().innerText());
    console.log(`seats before booking: ${seatBeforeBooking}`);


    // Step 4

    await bookedEventCard.locator('#book-now-btn').click();

    // Step 5 — Fill booking form

    await expect(page.locator('#ticket-count')).toHaveText('1');
    await page.getByLabel('Full Name').fill('Romeo red');
    await page.locator('#customer-email').fill('abc@abc.com');
    await page.getByPlaceholder('+91 98765 43210').fill('+91 99999 99999');
    await page.locator('.confirm-booking-btn').click();

    // Step 6 — Verify booking confirmation
    const refNoLocator = await page.locator('.booking-ref').first()
    await expect(refNoLocator).toBeVisible();
    refNo = (await refNoLocator.innerText()).trim();

    // Step 7 — Verify in My Bookings

    await page.getByRole('link', {name: 'View my bookings'}).click();
    await expect(page).toHaveURL(`${testInfo.project.use.baseURL}/bookings`);
    const allBookings = await page.locator('#booking-card');
    await expect(allBookings.first()).toBeVisible();
    bookedEvent = allBookings.filter({hasText: refNo});
    await expect(bookedEvent).toBeVisible();
    await expect(bookedEvent.locator('h3')).toHaveText(testEvent);

    // Step 8 — Verify seat reduction

    await page.goto('/events');
    const cardListAfter = await page.locator('article');
    const bookedEventCardAfter = cardListAfter.filter({hasText: testEvent});
    await expect(bookedEventCard).toBeVisible({timeout:5000});
    seatAfterBooking = parseInt(await bookedEventCard.getByText('seat').first().innerText());
    console.log(`seats before booking: ${seatAfterBooking}`);
    await expect(seatAfterBooking).toBe(seatBeforeBooking - 1);
    

}
)
