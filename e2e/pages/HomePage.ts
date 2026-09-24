import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export type StatCardTitle = "Customers" | "Conversions" | "Revenue" | "Orders";

export class HomePage extends BasePage {
  readonly pageContent: Locator;
  readonly pageHeading: Locator;
  readonly notificationsButton: Locator;
  readonly quickCreateButton: Locator;
  readonly newMailMenuItem: Locator;
  readonly newCustomerMenuItem: Locator;
  readonly dateRangePickerButton: Locator;
  readonly periodSelect: Locator;
  readonly customersStatCard: Locator;
  readonly conversionsStatCard: Locator;
  readonly revenueStatCard: Locator;
  readonly ordersStatCard: Locator;
  readonly revenueChartLabel: Locator;
  readonly revenueChartTotal: Locator;
  readonly revenueChart: Locator;
  readonly salesTable: Locator;
  readonly salesTableHeaders: Locator;
  readonly salesTableRows: Locator;

  constructor(page: Page) {
    super(page);

    // Scope content locators to the home dashboard panel to avoid clashing
    // with the sidebar navigation (e.g. "Customers" link, quick create menu)
    this.pageContent = page.locator("#dashboard-panel-home");

    this.pageHeading = this.pageContent.getByRole("heading", {
      name: "Home",
      level: 1,
    });

    // Header actions (no accessible name, identified by their icon)
    this.notificationsButton = page
      .locator("button")
      .filter({ has: page.locator('[class*="i-lucide:bell"]') });
    this.quickCreateButton = page
      .locator("button")
      .filter({ has: page.locator('[class*="i-lucide:plus"]') });
    this.newMailMenuItem = page.getByRole("menuitem", { name: "New mail" });
    this.newCustomerMenuItem = page.getByRole("menuitem", {
      name: "New customer",
    });

    // Toolbar
    this.dateRangePickerButton = page.getByRole("button", {
      name: /\d{1,2}, \d{4}/,
    });
    this.periodSelect = page.getByRole("combobox");

    // Stats cards
    this.customersStatCard = this.pageContent.getByRole("link", {
      name: "Customers",
      exact: true,
    });
    this.conversionsStatCard = this.pageContent.getByRole("link", {
      name: "Conversions",
      exact: true,
    });
    this.revenueStatCard = this.pageContent.getByRole("link", {
      name: "Revenue",
      exact: true,
    });
    this.ordersStatCard = this.pageContent.getByRole("link", {
      name: "Orders",
      exact: true,
    });

    // Revenue chart
    this.revenueChartLabel = this.pageContent.locator("p.uppercase", {
      hasText: "Revenue",
    });
    this.revenueChartTotal = this.pageContent.locator(
      "p.text-3xl.text-highlighted.font-semibold",
    );
    this.revenueChart = page.locator(".unovis-xy-container");

    // Recent sales table
    this.salesTable = page.getByRole("table");
    this.salesTableHeaders = this.salesTable.locator("thead th");
    this.salesTableRows = this.salesTable.locator("tbody tr");
  }

  async goto() {
    await super.goto("/");
  }

  async verifyPageLoaded() {
    await expect(this.pageHeading).toBeVisible();
    await expect(this.customersStatCard).toBeVisible();
    await expect(this.salesTable).toBeVisible();
  }

  async openNotifications() {
    await this.notificationsButton.click();
  }

  async openQuickCreateMenu() {
    await this.quickCreateButton.click();
  }

  async clickNewMail() {
    await this.openQuickCreateMenu();
    await this.newMailMenuItem.click();
  }

  async clickNewCustomer() {
    await this.openQuickCreateMenu();
    await this.newCustomerMenuItem.click();
  }

  async openDateRangePicker() {
    await this.dateRangePickerButton.click();
  }

  async getDateRangeLabel(): Promise<string> {
    return (await this.dateRangePickerButton.textContent()) || "";
  }

  async selectPeriod(period: string) {
    await this.periodSelect.click();
    await this.page.getByRole("option", { name: period }).click();
  }

  getStatCard(title: StatCardTitle): Locator {
    return this.pageContent.getByRole("link", { name: title, exact: true });
  }

  async clickStatCard(title: StatCardTitle) {
    await this.getStatCard(title).click();
  }

  async verifyStatsCardsVisible() {
    await expect(this.customersStatCard).toBeVisible();
    await expect(this.conversionsStatCard).toBeVisible();
    await expect(this.revenueStatCard).toBeVisible();
    await expect(this.ordersStatCard).toBeVisible();
  }

  async verifyRevenueChartVisible() {
    await expect(this.revenueChartLabel).toBeVisible();
    await expect(this.revenueChartTotal).toBeVisible();
    await expect(this.revenueChart).toBeVisible();
  }

  async getSalesTableRowCount(): Promise<number> {
    return await this.salesTableRows.count();
  }

  async verifySalesTableStructure() {
    await expect(this.salesTable).toBeVisible();
    await expect(this.salesTableHeaders).toHaveCount(5);

    const expectedHeaders = ["ID", "Date", "Status", "Email", "Amount"];
    for (let i = 0; i < expectedHeaders.length; i++) {
      await expect(this.salesTableHeaders.nth(i)).toContainText(
        expectedHeaders[i],
      );
    }
  }
}
