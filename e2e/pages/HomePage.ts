import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage {
  readonly pageHeading: Locator;
  readonly dateRangePicker: Locator;
  readonly periodSelector: Locator;

  // Stats cards
  readonly customersCard: Locator;
  readonly customersValue: Locator;
  readonly customersChange: Locator;
  readonly conversionsCard: Locator;
  readonly conversionsValue: Locator;
  readonly conversionsChange: Locator;
  readonly revenueCard: Locator;
  readonly revenueValue: Locator;
  readonly revenueChange: Locator;
  readonly ordersCard: Locator;
  readonly ordersValue: Locator;
  readonly ordersChange: Locator;

  // Revenue chart
  readonly revenueChartTitle: Locator;
  readonly revenueChartValue: Locator;
  readonly revenueChart: Locator;

  // Orders table
  readonly ordersTable: Locator;
  readonly tableHeaders: Locator;
  readonly tableRows: Locator;

  constructor(page: Page) {
    super(page);

    this.pageHeading = page.getByRole("heading", { name: "Home", level: 1 });
    this.dateRangePicker = page.getByRole("button", {
      name: /\w+ \d+, \d+ - \w+ \d+, \d+/,
    });
    this.periodSelector = page
      .getByRole("combobox")
      .filter({ hasText: "daily" });

    // Stats cards: each card is a clickable link with an accessible name
    // matching its title, so scope from that link to its card root instead
    // of relying on fragile text/DOM-position traversal.
    const mainContent = page.locator("[id^='dashboard-panel']");
    const statsCard = (title: string) =>
      mainContent.getByRole("link", { name: title, exact: true }).locator("..");

    this.customersCard = statsCard("Customers");
    this.customersValue = this.customersCard.locator("span.text-2xl");
    this.customersChange = this.customersCard
      .locator("span")
      .filter({ hasText: /%$/ });

    this.conversionsCard = statsCard("Conversions");
    this.conversionsValue = this.conversionsCard.locator("span.text-2xl");
    this.conversionsChange = this.conversionsCard
      .locator("span")
      .filter({ hasText: /%$/ });

    this.revenueCard = statsCard("Revenue");
    this.revenueValue = this.revenueCard.locator("span.text-2xl");
    this.revenueChange = this.revenueCard
      .locator("span")
      .filter({ hasText: /%$/ });

    this.ordersCard = statsCard("Orders");
    this.ordersValue = this.ordersCard.locator("span.text-2xl");
    this.ordersChange = this.ordersCard
      .locator("span")
      .filter({ hasText: /%$/ });

    // Revenue chart
    this.revenueChartTitle = page
      .locator("p")
      .filter({ hasText: "Revenue" })
      .first();
    this.revenueChartValue = page
      .locator("p")
      .filter({ hasText: /^\$[\d,]+$/ })
      .first();
    this.revenueChart = page.locator("figure").first();

    // Orders table
    this.ordersTable = page.getByRole("table");
    this.tableHeaders = this.ordersTable.locator("thead th");
    this.tableRows = this.ordersTable.locator("tbody tr");
  }

  async goto() {
    await super.goto("/");
  }

  async verifyPageLoaded() {
    await expect(this.pageHeading).toBeVisible();
    await expect(this.dateRangePicker).toBeVisible();
    await expect(this.periodSelector).toBeVisible();
    await this.waitForPageLoad();
  }

  async verifyStatsCards() {
    await expect(this.customersCard).toBeVisible();
    await expect(this.conversionsCard).toBeVisible();
    await expect(this.revenueCard).toBeVisible();
    await expect(this.ordersCard).toBeVisible();
  }

  async getCustomersValue(): Promise<string> {
    return (await this.customersValue.textContent()) || "";
  }

  async getCustomersChange(): Promise<string> {
    return (await this.customersChange.textContent()) || "";
  }

  async getConversionsValue(): Promise<string> {
    return (await this.conversionsValue.textContent()) || "";
  }

  async getConversionsChange(): Promise<string> {
    return (await this.conversionsChange.textContent()) || "";
  }

  async getRevenueValue(): Promise<string> {
    return (await this.revenueValue.textContent()) || "";
  }

  async getRevenueChange(): Promise<string> {
    return (await this.revenueChange.textContent()) || "";
  }

  async getOrdersValue(): Promise<string> {
    return (await this.ordersValue.textContent()) || "";
  }

  async getOrdersChange(): Promise<string> {
    return (await this.ordersChange.textContent()) || "";
  }

  async verifyRevenueChart() {
    await expect(this.revenueChartTitle).toBeVisible();
    await expect(this.revenueChartValue).toBeVisible();
    // The chart renders client-side after data fetch, so allow extra time.
    await expect(this.revenueChart).toBeVisible({ timeout: 15000 });
  }

  async verifyOrdersTable() {
    await expect(this.ordersTable).toBeVisible();
    await expect(this.tableHeaders).toHaveCount(5); // ID, Date, Status, Email, Amount

    // Verify table headers
    const headers = ["ID", "Date", "Status", "Email", "Amount"];
    for (let i = 0; i < headers.length; i++) {
      await expect(this.tableHeaders.nth(i)).toContainText(headers[i]);
    }
  }

  async getOrdersTableRowCount(): Promise<number> {
    return await this.tableRows.count();
  }

  async getOrderById(orderId: string): Promise<Locator> {
    return this.ordersTable.locator(`tr:has-text("${orderId}")`);
  }

  async clickDateRangePicker() {
    await this.dateRangePicker.click();
  }

  async selectPeriod(period: string) {
    // A plain click sometimes fails to open this popover in headless Chromium.
    await this.periodSelector.click({ force: true });
    await this.page.getByRole("option", { name: period }).click();
  }

  async clickStatsCardLink(
    cardType: "customers" | "conversions" | "revenue" | "orders",
  ) {
    const cards = {
      customers: this.customersCard,
      conversions: this.conversionsCard,
      revenue: this.revenueCard,
      orders: this.ordersCard,
    };

    await cards[cardType].getByRole("link").click();
  }
}
