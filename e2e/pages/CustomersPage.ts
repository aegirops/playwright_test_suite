import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CustomersPage extends BasePage {
  readonly pageHeading: Locator;
  readonly newCustomerButton: Locator;
  readonly searchInput: Locator;
  readonly deleteButton: Locator;
  readonly statusFilter: Locator;
  readonly displayButton: Locator;
  readonly customersTable: Locator;
  readonly tableHeaders: Locator;
  readonly tableRows: Locator;
  readonly selectAllCheckbox: Locator;
  readonly rowCheckboxes: Locator;
  readonly selectedRowsText: Locator;
  readonly pagination: Locator;
  readonly firstPageButton: Locator;
  readonly previousPageButton: Locator;
  readonly nextPageButton: Locator;
  readonly lastPageButton: Locator;
  readonly pageButtons: Locator;

  constructor(page: Page) {
    super(page);

    this.pageHeading = page.getByRole("heading", {
      name: "Customers",
      level: 1,
    });
    this.newCustomerButton = page.getByRole("button", { name: "New customer" });

    // Filters and actions
    this.searchInput = page.getByPlaceholder("Filter emails...");
    this.deleteButton = page.getByRole("button", { name: /Delete \d+/ });
    this.statusFilter = page.getByRole("combobox").filter({ hasText: "All" });
    this.displayButton = page.getByRole("button", { name: "Display" });

    // Table
    this.customersTable = page.getByRole("table");
    this.tableHeaders = this.customersTable.locator("thead th");
    this.tableRows = this.customersTable.locator("tbody tr");
    // Checkboxes are custom `role=checkbox` buttons, not native `<input>`s.
    this.selectAllCheckbox = this.customersTable
      .locator("thead")
      .getByRole("checkbox");
    this.rowCheckboxes = this.customersTable
      .locator("tbody")
      .getByRole("checkbox");

    // Selection info
    this.selectedRowsText = page
      .locator("div")
      .filter({ hasText: /\d+ of \d+ row\(s\) selected/ });

    // Pagination (scoped past the sidebar's two unrelated "Main" navigations)
    this.pagination = page
      .getByRole("navigation")
      .filter({ has: page.getByRole("button", { name: "Next Page" }) });
    this.firstPageButton = page.getByRole("button", { name: "First Page" });
    this.previousPageButton = page.getByRole("button", {
      name: "Previous Page",
    });
    this.nextPageButton = page.getByRole("button", { name: "Next Page" });
    this.lastPageButton = page.getByRole("button", { name: "Last Page" });
    this.pageButtons = page.getByRole("button", { name: /Page \d+/ });
  }

  async goto() {
    await super.goto("/customers");
  }

  async verifyPageLoaded() {
    await expect(this.pageHeading).toBeVisible();
    await expect(this.newCustomerButton).toBeVisible();
    await expect(this.customersTable).toBeVisible();
  }

  async clickNewCustomer() {
    await this.newCustomerButton.click();
  }

  async searchCustomers(searchTerm: string) {
    await this.searchInput.fill(searchTerm);
    await this.searchInput.press("Enter");
  }

  async clearSearch() {
    await this.searchInput.clear();
  }

  async clickDeleteButton() {
    await this.deleteButton.click();
  }

  async selectStatusFilter(status: string) {
    // Retry the open: right after load the trigger can be clicked before
    // hydration finishes wiring up its handler, swallowing the click.
    await expect(async () => {
      await this.statusFilter.click();
      await expect(
        this.page.getByRole("option", { name: status }),
      ).toBeVisible({ timeout: 1000 });
    }).toPass();
    await this.page.getByRole("option", { name: status }).click();
  }

  async clickDisplayButton() {
    await this.displayButton.click();
  }

  async verifyTableStructure() {
    await expect(this.customersTable).toBeVisible();
    await expect(this.tableHeaders).toHaveCount(7); // Checkbox, ID, Name, Email, Location, Status, Actions

    // Verify table headers
    const expectedHeaders = [
      "",
      "ID",
      "Name",
      "Email",
      "Location",
      "Status",
      "",
    ];
    for (let i = 0; i < expectedHeaders.length; i++) {
      if (expectedHeaders[i] !== "") {
        await expect(this.tableHeaders.nth(i)).toContainText(
          expectedHeaders[i],
        );
      }
    }
  }

  async getTableRowCount(): Promise<number> {
    return await this.tableRows.count();
  }

  async getCustomerByIndex(index: number): Promise<Locator> {
    return this.tableRows.nth(index);
  }

  async getCustomerById(customerId: string): Promise<Locator> {
    // Exact match on the ID cell: a substring match on the row would also
    // catch e.g. id "1" matching row "10".
    return this.tableRows.filter({
      has: this.page.locator(`td:nth-child(2):text-is("${customerId}")`),
    });
  }

  async getCustomerByName(customerName: string): Promise<Locator> {
    return this.customersTable.locator(`tr:has-text("${customerName}")`);
  }

  async getCustomerByEmail(email: string): Promise<Locator> {
    return this.customersTable.locator(`tr:has-text("${email}")`);
  }

  async selectAllCustomers() {
    await this.selectAllCheckbox.check();
  }

  async deselectAllCustomers() {
    await this.selectAllCheckbox.uncheck();
  }

  async selectCustomerByIndex(index: number) {
    await this.rowCheckboxes.nth(index).check();
  }

  async deselectCustomerByIndex(index: number) {
    await this.rowCheckboxes.nth(index).uncheck();
  }

  async selectCustomerById(customerId: string) {
    const row = await this.getCustomerById(customerId);
    await row.locator('input[type="checkbox"]').check();
  }

  async getSelectedRowsText(): Promise<string> {
    return (await this.selectedRowsText.textContent()) || "";
  }

  async verifyCustomerSelected(index: number) {
    await expect(this.rowCheckboxes.nth(index)).toBeChecked();
  }

  async verifyCustomerNotSelected(index: number) {
    await expect(this.rowCheckboxes.nth(index)).not.toBeChecked();
  }

  async getCustomerData(customerRow: Locator) {
    const cells = customerRow.locator("td");

    return {
      id: (await cells.nth(1).textContent()) || "",
      name: (await cells.nth(2).textContent()) || "",
      email: (await cells.nth(3).textContent()) || "",
      location: (await cells.nth(4).textContent()) || "",
      status: (await cells.nth(5).textContent()) || "",
    };
  }

  async clickCustomerActions(customerRow: Locator) {
    const actionsButton = customerRow.locator("td").last().locator("button");
    await actionsButton.click();
  }

  async verifyCustomerStatus(customerRow: Locator, expectedStatus: string) {
    const statusCell = customerRow.locator("td").nth(5);
    await expect(statusCell).toContainText(expectedStatus);
  }

  async filterByStatus(
    status: "subscribed" | "unsubscribed" | "bounced" | "All",
  ) {
    await this.selectStatusFilter(status);
  }

  // Pagination methods
  async goToFirstPage() {
    if (await this.firstPageButton.isEnabled()) {
      await this.firstPageButton.click();
    }
  }

  async goToPreviousPage() {
    if (await this.previousPageButton.isEnabled()) {
      await this.previousPageButton.click();
    }
  }

  async goToNextPage() {
    if (await this.nextPageButton.isEnabled()) {
      await this.nextPageButton.click();
    }
  }

  async goToLastPage() {
    if (await this.lastPageButton.isEnabled()) {
      await this.lastPageButton.click();
    }
  }

  async goToPage(pageNumber: number) {
    const pageButton = this.page.getByRole("button", {
      name: `Page ${pageNumber}`,
    });
    await pageButton.click();
  }

  async getCurrentPage(): Promise<number> {
    // Find the active page button
    const activePageButton = this.pageButtons.filter({ hasText: /^\d+$/ });
    const count = await activePageButton.count();

    for (let i = 0; i < count; i++) {
      const button = activePageButton.nth(i);
      const ariaPressed = await button.getAttribute("aria-pressed");
      if (ariaPressed === "true") {
        const text = await button.textContent();
        return parseInt(text || "1");
      }
    }
    return 1;
  }

  async verifyPaginationControls() {
    await expect(this.pagination).toBeVisible();
    await expect(this.firstPageButton).toBeVisible();
    await expect(this.previousPageButton).toBeVisible();
    await expect(this.nextPageButton).toBeVisible();
    await expect(this.lastPageButton).toBeVisible();
  }

  async waitForTableToLoad() {
    await expect(this.tableRows.first()).toBeVisible();
  }

  // Helper method to find customers by status
  async getCustomersByStatus(status: string): Promise<Locator[]> {
    const rows = await this.tableRows.all();
    const matchingRows: Locator[] = [];

    for (const row of rows) {
      const statusCell = row.locator("td").nth(5);
      const statusText = await statusCell.textContent();
      if (statusText?.includes(status)) {
        matchingRows.push(row);
      }
    }

    return matchingRows;
  }
}
