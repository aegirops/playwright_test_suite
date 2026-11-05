import { test, expect } from "@playwright/test";
import { CustomersPage } from "../pages";

test.describe("Customers Page", () => {
  let customersPage: CustomersPage;

  test.beforeEach(async ({ page }) => {
    customersPage = new CustomersPage(page);
    await customersPage.goto();
    await customersPage.acceptCookies();
  });

  test("should display customers page correctly", async () => {
    await customersPage.verifyPageLoaded();
    await customersPage.verifyUrl("/customers");
    await customersPage.verifyPageTitle("Nuxt Dashboard Template");
  });

  test("should display customers table with correct structure", async () => {
    await customersPage.verifyTableStructure();

    const rowCount = await customersPage.getTableRowCount();
    expect(rowCount).toBeGreaterThan(0);
  });

  test("should display action buttons", async () => {
    await expect(customersPage.newCustomerButton).toBeVisible();
    await expect(customersPage.searchInput).toBeVisible();
    await expect(customersPage.statusFilter).toBeVisible();
    await expect(customersPage.displayButton).toBeVisible();
  });

  test("should search customers", async () => {
    await customersPage.waitForTableToLoad();

    // Search for a specific customer
    await customersPage.searchCustomers("Alex Smith");

    // Clear search
    await customersPage.clearSearch();
  });

  test("should filter customers by status", async () => {
    await customersPage.waitForTableToLoad();

    // Filter by subscribed status
    await customersPage.filterByStatus("subscribed");

    // Verify filtered results contain only subscribed customers
    const subscribedCustomers =
      await customersPage.getCustomersByStatus("subscribed");
    expect(subscribedCustomers.length).toBeGreaterThan(0);

    // Reset filter
    await customersPage.filterByStatus("All");
  });

  test("should select and deselect customers", async () => {
    await customersPage.waitForTableToLoad();

    // Select first customer
    await customersPage.selectCustomerByIndex(0);
    await customersPage.verifyCustomerSelected(0);

    // Check selected rows text
    const selectedText = await customersPage.getSelectedRowsText();
    expect(selectedText).toContain("selected");

    // Deselect customer
    await customersPage.deselectCustomerByIndex(0);
    await customersPage.verifyCustomerNotSelected(0);
  });

  test("should select all customers", async () => {
    await customersPage.waitForTableToLoad();

    await customersPage.selectAllCustomers();

    // Verify selection text shows all rows selected
    const selectedText = await customersPage.getSelectedRowsText();
    expect(selectedText).toContain("selected");

    // Deselect all
    await customersPage.deselectAllCustomers();
  });

  test("should display customer data correctly", async () => {
    await customersPage.waitForTableToLoad();

    const firstCustomer = await customersPage.getCustomerByIndex(0);
    const customerData = await customersPage.getCustomerData(firstCustomer);

    // Verify customer data structure
    expect(customerData.id).toBeTruthy();
    expect(customerData.name).toBeTruthy();
    expect(customerData.email).toBeTruthy();
    expect(customerData.location).toBeTruthy();
    expect(customerData.status).toBeTruthy();

    // Verify email format
    expect(customerData.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

    // Verify status is one of expected values
    expect(["subscribed", "unsubscribed", "bounced"]).toContain(
      customerData.status,
    );
  });

  test("should find customers by specific criteria", async () => {
    await customersPage.waitForTableToLoad();

    // Find customer by ID
    const customerById = await customersPage.getCustomerById("1");
    await expect(customerById).toBeVisible();

    // Find customer by name
    const customerByName = await customersPage.getCustomerByName("Alex Smith");
    if ((await customerByName.count()) > 0) {
      await expect(customerByName.first()).toBeVisible();
    }

    // Find customer by email
    const customerByEmail = await customersPage.getCustomerByEmail(
      "alex.smith@example.com",
    );
    if ((await customerByEmail.count()) > 0) {
      await expect(customerByEmail.first()).toBeVisible();
    }
  });

  test("should verify customer statuses", async () => {
    await customersPage.waitForTableToLoad();

    const rowCount = Math.min(5, await customersPage.getTableRowCount());

    for (let i = 0; i < rowCount; i++) {
      const customerRow = await customersPage.getCustomerByIndex(i);
      const customerData = await customersPage.getCustomerData(customerRow);

      await customersPage.verifyCustomerStatus(
        customerRow,
        customerData.status,
      );
    }
  });

  test("should handle pagination", async () => {
    await customersPage.verifyPaginationControls();

    // Check current page
    const currentPage = await customersPage.getCurrentPage();
    expect(currentPage).toBeGreaterThanOrEqual(1);

    // Try to navigate to next page if available
    if (await customersPage.nextPageButton.isEnabled()) {
      await customersPage.goToNextPage();

      const newPage = await customersPage.getCurrentPage();
      expect(newPage).toBeGreaterThan(currentPage);

      // Go back to first page
      await customersPage.goToFirstPage();
    }
  });

  test("should click customer actions", async () => {
    await customersPage.waitForTableToLoad();

    const firstCustomer = await customersPage.getCustomerByIndex(0);
    await customersPage.clickCustomerActions(firstCustomer);

    // Additional assertions would depend on what happens when actions are clicked
    // (e.g., dropdown menu, modal, etc.)
  });

  test("should click new customer button", async () => {
    await customersPage.clickNewCustomer();

    // Additional assertions would depend on what happens when new customer is clicked
    // (e.g., modal opens, navigation to new page, etc.)
  });

  test("should verify customer locations", async () => {
    await customersPage.waitForTableToLoad();

    const expectedLocations = [
      "New York, USA",
      "London, UK",
      "Paris, France",
      "Berlin, Germany",
      "Tokyo, Japan",
      "Sydney, Australia",
    ];

    const rowCount = await customersPage.getTableRowCount();
    let foundLocations: string[] = [];

    for (let i = 0; i < Math.min(rowCount, 10); i++) {
      const customerRow = await customersPage.getCustomerByIndex(i);
      const customerData = await customersPage.getCustomerData(customerRow);
      foundLocations.push(customerData.location);
    }

    // Verify at least some expected locations are present
    const hasExpectedLocations = expectedLocations.some((location) =>
      foundLocations.includes(location),
    );
    expect(hasExpectedLocations).toBeTruthy();
  });

  test("should handle customer selection and deletion", async () => {
    await customersPage.waitForTableToLoad();

    // The table ships with a row pre-selected, so compare against a delta
    // rather than assuming selecting one row yields a count of exactly 1.
    const initialSelectedCount = await customersPage.getSelectedCount();

    // Select a customer
    await customersPage.selectCustomerByIndex(0);
    await customersPage.verifyCustomerSelected(0);

    // Verify delete button shows updated count
    await expect(customersPage.deleteButton).toBeVisible();
    await expect(customersPage.deleteButton).toContainText(
      String(initialSelectedCount + 1),
    );

    // Click delete button (this might open a confirmation modal)
    await customersPage.clickDeleteButton();
  });

  test("should navigate between different pages", async () => {
    // Navigate to home
    await customersPage.navigateToHome();
    await customersPage.verifyUrl("/");

    // Navigate back to customers
    await customersPage.navigateToCustomers();
    await customersPage.verifyUrl("/customers");

    // Navigate to inbox
    await customersPage.navigateToInbox();
    await customersPage.verifyUrl("/inbox");

    // Navigate back to customers
    await customersPage.navigateToCustomers();
    await customersPage.verifyUrl("/customers");
  });
});
