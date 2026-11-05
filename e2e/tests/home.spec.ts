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

    test("should display stats cards", async () => {
        await homePage.verifyStatsCardsVisible();
    });

    test("should display revenue chart", async () => {
        await homePage.verifyRevenueChartVisible();
    });

    test("should display sales table with correct structure", async () => {
        await homePage.verifySalesTableStructure();

        const rowCount = await homePage.getSalesTableRowCount();
        expect(rowCount).toBeGreaterThan(0);
    });

    test("should display date range picker and period select", async () => {
        await expect(homePage.dateRangePickerButton).toBeVisible();
        await expect(homePage.periodSelect).toBeVisible();

        const label = await homePage.getDateRangeLabel();
        expect(label).toMatch(/\d{1,2}, \d{4}/);
    });

    test("should open and select a period from the period select", async () => {
        await homePage.selectPeriod("weekly");
        await expect(homePage.periodSelect).toContainText("weekly");
    });

    test("should open quick create menu with new mail and new customer options", async () => {
        await homePage.openQuickCreateMenu();
        await expect(homePage.newMailMenuItem).toBeVisible();
        await expect(homePage.newCustomerMenuItem).toBeVisible();
    });

    test("should navigate to customers page when clicking a stat card", async () => {
        await homePage.clickStatCard("Customers");
        await homePage.verifyUrl("/customers");
    });
});
