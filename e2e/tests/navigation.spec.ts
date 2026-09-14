import { test, expect } from "@playwright/test";
import { HomePage, InboxPage, CustomersPage, SettingsPage } from "../pages";

test.describe("Navigation Integration Tests", () => {
  test("should navigate through all main pages", async ({ page }) => {
    // Start with HomePage
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.acceptCookies();
    await homePage.verifyPageLoaded();

    // Navigate to Inbox
    await homePage.navigateToInbox();
    const inboxPage = new InboxPage(page);
    await inboxPage.verifyPageLoaded();
    await inboxPage.verifyUrl("/inbox");

    // Navigate to Customers
    await inboxPage.navigateToCustomers();
    const customersPage = new CustomersPage(page);
    await customersPage.verifyPageLoaded();
    await customersPage.verifyUrl("/customers");

    // Navigate to Settings
    await customersPage.navigateToSettings();
    const settingsPage = new SettingsPage(page);
    await settingsPage.verifyPageLoaded();
    await settingsPage.verifyUrl("/settings");

    // Navigate back to Home
    await settingsPage.navigateToHome();
    await homePage.verifyPageLoaded();
    await homePage.verifyUrl("/");
  });

  test("should navigate through all settings subsections", async ({ page }) => {
    const settingsPage = new SettingsPage(page);
    await settingsPage.goto();
    await settingsPage.acceptCookies();

    // Start at General settings
    await settingsPage.verifyPageLoaded();
    await settingsPage.verifyUrl("/settings");

    // Navigate to Members
    await settingsPage.navigateToMembers();
    await settingsPage.verifyUrl("/settings/members");

    // Navigate to Notifications
    await settingsPage.navigateToNotifications();
    await settingsPage.verifyUrl("/settings/notifications");

    // Navigate to Security
    await settingsPage.navigateToSecurity();
    await settingsPage.verifyUrl("/settings/security");

    // Navigate back to General
    await settingsPage.navigateToGeneral();
    await settingsPage.verifyUrl("/settings");
  });

  test("should maintain sidebar navigation consistency across pages", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.acceptCookies();

    // Verify navigation elements are present on Home page
    await expect(homePage.homeLink).toBeVisible();
    await expect(homePage.inboxLink).toBeVisible();
    await expect(homePage.customersLink).toBeVisible();
    await expect(homePage.settingsButton).toBeVisible();

    // Navigate to Inbox and verify navigation is still present
    await homePage.navigateToInbox();
    const inboxPage = new InboxPage(page);
    await expect(inboxPage.homeLink).toBeVisible();
    await expect(inboxPage.inboxLink).toBeVisible();
    await expect(inboxPage.customersLink).toBeVisible();
    await expect(inboxPage.settingsButton).toBeVisible();

    // Navigate to Customers and verify navigation is still present
    await inboxPage.navigateToCustomers();
    const customersPage = new CustomersPage(page);
    await expect(customersPage.homeLink).toBeVisible();
    await expect(customersPage.inboxLink).toBeVisible();
    await expect(customersPage.customersLink).toBeVisible();
    await expect(customersPage.settingsButton).toBeVisible();

    // Navigate to Settings and verify navigation is still present
    await customersPage.navigateToSettings();
    const settingsPage = new SettingsPage(page);
    await expect(settingsPage.homeLink).toBeVisible();
    await expect(settingsPage.inboxLink).toBeVisible();
    await expect(settingsPage.customersLink).toBeVisible();
    await expect(settingsPage.settingsButton).toBeVisible();
  });

  test("should verify active states in navigation", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.acceptCookies();

    // Navigate to Inbox and verify it's marked as active
    await homePage.navigateToInbox();
    const inboxPage = new InboxPage(page);
    await expect(inboxPage.inboxLink).toHaveAttribute("aria-current", "page");

    // Navigate to Customers and verify it's marked as active
    await inboxPage.navigateToCustomers();
    const customersPage = new CustomersPage(page);
    await expect(customersPage.customersLink).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  test("should handle breadcrumb navigation in complex scenarios", async ({
    page,
  }) => {
    // Start from Home
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.acceptCookies();

    // Go to Customers via stats card link
    await homePage.clickStatsCardLink("customers");
    const customersPage = new CustomersPage(page);
    await customersPage.verifyPageLoaded();

    // Select a customer and navigate to settings
    await customersPage.waitForTableToLoad();
    await customersPage.selectCustomerByIndex(0);
    await customersPage.navigateToSettings();

    // Navigate through settings subsections
    const settingsPage = new SettingsPage(page);
    await settingsPage.navigateToMembers();
    await settingsPage.navigateToSecurity();

    // Navigate back to Home via sidebar
    await settingsPage.navigateToHome();
    await homePage.verifyPageLoaded();
  });

  test("should verify search functionality across pages", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.acceptCookies();

    // Test search from Home page
    await homePage.openSearch();

    // Navigate to Customers and test search
    await homePage.navigateToCustomers();
    const customersPage = new CustomersPage(page);
    await customersPage.searchCustomers("Alex");
    await customersPage.clearSearch();

    // Navigate to Inbox
    await customersPage.navigateToInbox();
    const inboxPage = new InboxPage(page);
    await inboxPage.verifyPageLoaded();
  });

  test("should verify user menu accessibility across pages", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.acceptCookies();

    // Test user menu from Home
    await homePage.openUserMenu();

    // Navigate to different pages and test user menu
    const pages = [
      { navigate: () => homePage.navigateToInbox(), page: new InboxPage(page) },
      {
        navigate: () => homePage.navigateToCustomers(),
        page: new CustomersPage(page),
      },
      {
        navigate: () => homePage.navigateToSettings(),
        page: new SettingsPage(page),
      },
    ];

    for (const { navigate, page: currentPage } of pages) {
      await navigate();
      await expect(currentPage.userMenuButton).toBeVisible();
      await currentPage.openUserMenu();
    }
  });

  test("should handle page refresh and maintain navigation state", async ({
    page,
  }) => {
    // Start at Customers page
    const customersPage = new CustomersPage(page);
    await customersPage.goto();
    await customersPage.acceptCookies();
    await customersPage.verifyPageLoaded();

    // Refresh the page
    await page.reload();
    await customersPage.verifyPageLoaded();

    // Verify navigation still works after refresh
    await customersPage.navigateToHome();
    const homePage = new HomePage(page);
    await homePage.verifyPageLoaded();
  });

  test("should verify external link handling", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.acceptCookies();

    // Test feedback link (external)
    const feedbackLinkPromise = page.waitForEvent("popup");
    await homePage.feedbackLink.click();
    const feedbackPage = await feedbackLinkPromise;
    expect(feedbackPage.url()).toContain("github.com");
    await feedbackPage.close();

    // Test help & support link (external)
    const helpLinkPromise = page.waitForEvent("popup");
    await homePage.helpSupportLink.click();
    const helpPage = await helpLinkPromise;
    expect(helpPage.url()).toContain("github.com");
    await helpPage.close();
  });

  test("should verify cookie banner handling across navigation", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Accept cookies on home page
    await homePage.acceptCookies();

    // Navigate to other pages and verify cookie banner doesn't reappear
    await homePage.navigateToInbox();
    const inboxPage = new InboxPage(page);
    await expect(inboxPage.cookieAcceptButton).not.toBeVisible();

    await inboxPage.navigateToCustomers();
    const customersPage = new CustomersPage(page);
    await expect(customersPage.cookieAcceptButton).not.toBeVisible();

    await customersPage.navigateToSettings();
    const settingsPage = new SettingsPage(page);
    await expect(settingsPage.cookieAcceptButton).not.toBeVisible();
  });
});
