import { test, expect } from "@playwright/test";
import { HomePage } from "../pages";

test.describe("Home Page", () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
    await homePage.acceptCookies();
  });

  test("should display home page correctly", async () => {
    await homePage.verifyPageLoaded();
    await homePage.verifyUrl("/");
    await homePage.verifyPageTitle("Nuxt Dashboard Template");
  });

  test("should display all stats cards", async () => {
    await homePage.verifyStatsCards();

    // Verify each stat card has values
    const customersValue = await homePage.getCustomersValue();
    const customersChange = await homePage.getCustomersChange();
    const conversionsValue = await homePage.getConversionsValue();
    const conversionsChange = await homePage.getConversionsChange();
    const revenueValue = await homePage.getRevenueValue();
    const revenueChange = await homePage.getRevenueChange();
    const ordersValue = await homePage.getOrdersValue();
    const ordersChange = await homePage.getOrdersChange();

    // Verify values are not empty
    expect(customersValue).toBeTruthy();
    expect(customersChange).toBeTruthy();
    expect(conversionsValue).toBeTruthy();
    expect(conversionsChange).toBeTruthy();
    expect(revenueValue).toBeTruthy();
    expect(revenueChange).toBeTruthy();
    expect(ordersValue).toBeTruthy();
    expect(ordersChange).toBeTruthy();

    // Verify change indicators contain + or -
    expect(customersChange).toMatch(/[+-]\d+%/);
    expect(conversionsChange).toMatch(/[+-]\d+%/);
    expect(revenueChange).toMatch(/[+-]\d+%/);
    expect(ordersChange).toMatch(/[+-]\d+%/);
  });

  test("should display revenue chart", async () => {
    await homePage.verifyRevenueChart();
  });

  test("should display orders table with correct structure", async () => {
    await homePage.verifyOrdersTable();

    const rowCount = await homePage.getOrdersTableRowCount();
    expect(rowCount).toBeGreaterThan(0);
  });

  test("should allow date range selection", async () => {
    await homePage.clickDateRangePicker();
    // Note: This would typically open a date picker modal
    // Additional assertions would depend on the actual date picker implementation
  });

  test("should allow period selection", async () => {
    // This test assumes the period selector has options like 'daily', 'weekly', etc.
    // The actual implementation might need adjustment based on available options
    await homePage.selectPeriod("daily");
  });

  test("should navigate to customers page when clicking stats card links", async () => {
    await homePage.clickStatsCardLink("customers");
    await homePage.verifyUrl("/customers");
  });

  test("should display specific order by ID", async () => {
    const orderRow = await homePage.getOrderById("#4600");
    await expect(orderRow).toBeVisible();
  });

  test("should verify navigation elements", async () => {
    // Test sidebar navigation
    await expect(homePage.homeLink).toBeVisible();
    await expect(homePage.inboxLink).toBeVisible();
    await expect(homePage.customersLink).toBeVisible();
    await expect(homePage.settingsButton).toBeVisible();

    // Test header elements
    await expect(homePage.searchButton).toBeVisible();
    await expect(homePage.userMenuButton).toBeVisible();
  });

  test("should navigate between pages using sidebar", async () => {
    // Navigate to inbox
    await homePage.navigateToInbox();
    await homePage.verifyUrl("/inbox");

    // Navigate back to home
    await homePage.navigateToHome();
    await homePage.verifyUrl("/");
  });

  test("should collapse and expand sidebar", async () => {
    await homePage.collapseSidebar();
    // Additional assertions would depend on visual changes when sidebar is collapsed
  });

  test("should open search functionality", async () => {
    await homePage.openSearch();
    // Additional assertions would depend on the search modal implementation
  });

  test("should open user menu", async () => {
    await homePage.openUserMenu();
    // Additional assertions would depend on the user menu implementation
  });
});
