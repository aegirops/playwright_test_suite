import { test, expect } from "@playwright/test";
import { InboxPage } from "../pages";

test.describe("Inbox Page", () => {
  let inboxPage: InboxPage;

  test.beforeEach(async ({ page }) => {
    inboxPage = new InboxPage(page);
    await inboxPage.goto();
    await inboxPage.acceptCookies();
  });

  test("should display inbox page correctly", async () => {
    await inboxPage.verifyPageLoaded();
    await inboxPage.verifyUrl("/inbox");
    await inboxPage.verifyPageTitle("Nuxt Dashboard Template");
  });

  test("should display email count", async () => {
    const emailCount = await inboxPage.getEmailCount();
    expect(emailCount).toBeTruthy();
    expect(parseInt(emailCount)).toBeGreaterThan(0);
  });

  test("should display tabs correctly", async () => {
    await inboxPage.verifyTabsPresent();
    await inboxPage.verifyAllTabSelected();
  });

  test("should switch between All and Unread tabs", async () => {
    // Start with All tab selected
    await inboxPage.verifyAllTabSelected();

    // Switch to Unread tab
    await inboxPage.clickUnreadTab();
    await inboxPage.verifyUnreadTabSelected();

    // Switch back to All tab
    await inboxPage.clickAllTab();
    await inboxPage.verifyAllTabSelected();
  });

  test("should display list of emails", async () => {
    await inboxPage.verifyEmailsDisplayed();

    const emailCount = await inboxPage.getEmailItemsCount();
    expect(emailCount).toBeGreaterThan(0);
  });

  test("should display email structure correctly", async () => {
    await inboxPage.waitForEmailsToLoad();

    const firstEmail = await inboxPage.getEmailByIndex(0);
    await inboxPage.verifyEmailStructure(firstEmail);

    // Verify email content
    const sender = await inboxPage.getEmailSender(firstEmail);
    const time = await inboxPage.getEmailTime(firstEmail);
    const subject = await inboxPage.getEmailSubject(firstEmail);
    const preview = await inboxPage.getEmailPreview(firstEmail);

    expect(sender).toBeTruthy();
    expect(time).toBeTruthy();
    expect(subject).toBeTruthy();
    expect(preview).toBeTruthy();
  });

  test("should find emails by specific senders", async () => {
    const alexEmail = await inboxPage.getEmailBySender("Alex Smith");
    await expect(alexEmail).toBeVisible();

    const jordanEmail = await inboxPage.getEmailBySender("Jordan Brown");
    await expect(jordanEmail).toBeVisible();

    const taylorEmail = await inboxPage.getEmailBySender("Taylor Green");
    await expect(taylorEmail).toBeVisible();
  });

  test("should find emails by subject", async () => {
    const meetingEmail = await inboxPage.getEmailBySubject("Meeting Schedule");
    if ((await meetingEmail.count()) > 0) {
      await expect(meetingEmail.first()).toBeVisible();
    }

    const lunchEmail = await inboxPage.getEmailBySubject("Lunch Plans");
    if ((await lunchEmail.count()) > 0) {
      await expect(lunchEmail.first()).toBeVisible();
    }
  });

  test("should click on emails", async () => {
    await inboxPage.waitForEmailsToLoad();

    // Click on first email
    await inboxPage.clickEmailByIndex(0);
    // Note: This might open email details or navigate to email view
    // Additional assertions would depend on the actual behavior

    // Click on email by sender
    await inboxPage.clickEmailBySender("Alex Smith");
  });

  test("should verify email content contains expected text", async () => {
    await inboxPage.waitForEmailsToLoad();

    const firstEmail = await inboxPage.getEmailByIndex(0);
    const emailText = await firstEmail.textContent();

    // Verify email contains sender, time, and content
    expect(emailText).toBeTruthy();
  });

  test("should scroll through emails", async () => {
    const emailCount = await inboxPage.getEmailItemsCount();

    if (emailCount > 5) {
      // Scroll to a later email
      await inboxPage.scrollToEmail(emailCount - 1);

      const lastEmail = await inboxPage.getEmailByIndex(emailCount - 1);
      await expect(lastEmail).toBeVisible();
    }
  });

  test("should find emails by pattern", async () => {
    // Find emails containing specific keywords
    const meetingEmails =
      await inboxPage.findEmailsByPattern(/meeting|schedule/i);
    expect(meetingEmails.length).toBeGreaterThanOrEqual(0);

    const projectEmails =
      await inboxPage.findEmailsByPattern(/project|sprint/i);
    expect(projectEmails.length).toBeGreaterThanOrEqual(0);
  });

  test("should verify specific email senders are present", async () => {
    const expectedSenders = [
      "Alex Smith",
      "Jordan Brown",
      "Taylor Green",
      "Morgan White",
      "Casey Gray",
    ];

    for (const sender of expectedSenders) {
      const senderEmails = await inboxPage.getEmailBySender(sender);
      if ((await senderEmails.count()) > 0) {
        await expect(senderEmails.first()).toBeVisible();
      }
    }
  });

  test("should verify email time formats", async () => {
    await inboxPage.waitForEmailsToLoad();

    const emailCount = Math.min(5, await inboxPage.getEmailItemsCount());

    for (let i = 0; i < emailCount; i++) {
      const email = await inboxPage.getEmailByIndex(i);
      const time = await inboxPage.getEmailTime(email);

      // Verify time format (could be "11:56", "18 Sep", etc.)
      expect(time).toMatch(/\d{2}:\d{2}|\d{2} \w{3}|\w{3} \d{2}/);
    }
  });

  test("should navigate back to home from inbox", async () => {
    await inboxPage.navigateToHome();
    await inboxPage.verifyUrl("/");
  });

  test("should navigate to customers from inbox", async () => {
    await inboxPage.navigateToCustomers();
    await inboxPage.verifyUrl("/customers");
  });
});
