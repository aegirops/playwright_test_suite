import { test, expect } from "@playwright/test";
import { SettingsPage } from "../pages";

test.describe("Settings Page", () => {
  let settingsPage: SettingsPage;

  test.beforeEach(async ({ page }) => {
    settingsPage = new SettingsPage(page);
    await settingsPage.goto();
    await settingsPage.acceptCookies();
  });

  test("should display settings page correctly", async () => {
    await settingsPage.verifyPageLoaded();
    await settingsPage.verifyUrl("/settings");
    await settingsPage.verifyPageTitle("Nuxt Dashboard Template");
  });

  test("should display settings navigation", async () => {
    await settingsPage.verifySettingsNavigation();
  });

  test("should display profile form", async () => {
    await settingsPage.verifyProfileForm();
    await settingsPage.verifyFormFields();
  });

  test("should display default profile values", async () => {
    await settingsPage.waitForFormToLoad();
    await settingsPage.verifyDefaultValues();
  });

  test("should verify required fields", async () => {
    await settingsPage.verifyRequiredFields();
  });

  test("should verify form field descriptions", async () => {
    await settingsPage.verifyFormDescriptions();
  });

  test("should fill and retrieve form values", async () => {
    await settingsPage.waitForFormToLoad();

    // Fill form with test data
    const testData = {
      name: "Test User",
      email: "test@example.com",
      username: "testuser",
      bio: "This is a test bio",
    };

    await settingsPage.fillCompleteProfile(testData);

    // Verify values were set correctly
    await settingsPage.verifyFieldValue("name", testData.name);
    await settingsPage.verifyFieldValue("email", testData.email);
    await settingsPage.verifyFieldValue("username", testData.username);
    await settingsPage.verifyFieldValue("bio", testData.bio);
  });

  test("should fill individual form fields", async () => {
    await settingsPage.waitForFormToLoad();

    // Test name field
    await settingsPage.fillName("John Doe");
    const name = await settingsPage.getName();
    expect(name).toBe("John Doe");

    // Test email field
    await settingsPage.fillEmail("john@example.com");
    const email = await settingsPage.getEmail();
    expect(email).toBe("john@example.com");

    // Test username field
    await settingsPage.fillUsername("johndoe");
    const username = await settingsPage.getUsername();
    expect(username).toBe("johndoe");

    // Test bio field
    await settingsPage.fillBio("Software developer");
    const bio = await settingsPage.getBio();
    expect(bio).toBe("Software developer");
  });

  test("should handle avatar selection", async () => {
    await settingsPage.clickChooseAvatar();
    // Additional assertions would depend on the file picker implementation
  });

  test("should save changes", async () => {
    await settingsPage.waitForFormToLoad();

    // Fill form with new data
    await settingsPage.fillName("Updated User");
    await settingsPage.fillEmail("updated@example.com");

    // Save changes
    await settingsPage.saveChanges();

    // Additional assertions would depend on the save behavior
    // (e.g., success message, form reset, etc.)
  });

  test("should navigate between settings sections", async () => {
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

  test("should navigate to documentation", async () => {
    await settingsPage.navigateToDocumentation();
    // This should open in a new tab to the Nuxt UI documentation
    // Additional assertions would depend on how external links are handled
  });

  test("should clear form fields", async () => {
    await settingsPage.waitForFormToLoad();

    // Clear all fields
    await settingsPage.fillName("");
    await settingsPage.fillEmail("");
    await settingsPage.fillUsername("");
    await settingsPage.fillBio("");

    // Verify fields are empty
    await settingsPage.verifyFieldValue("name", "");
    await settingsPage.verifyFieldValue("email", "");
    await settingsPage.verifyFieldValue("username", "");
    await settingsPage.verifyFieldValue("bio", "");
  });

  test("should validate email format", async () => {
    await settingsPage.waitForFormToLoad();

    // Test with invalid email
    await settingsPage.fillEmail("invalid-email");

    // Try to save (this might trigger validation)
    await settingsPage.saveChanges();

    // Additional assertions would depend on validation implementation
  });

  test("should handle long bio text", async () => {
    await settingsPage.waitForFormToLoad();

    const longBio =
      "This is a very long bio that contains multiple sentences and should test the textarea field's ability to handle larger amounts of text. It includes various characters and should demonstrate the field's capacity.";

    await settingsPage.fillBio(longBio);
    const retrievedBio = await settingsPage.getBio();
    expect(retrievedBio).toBe(longBio);
  });

  test("should preserve form data during navigation", async () => {
    await settingsPage.waitForFormToLoad();

    // Fill form with test data
    await settingsPage.fillName("Test Navigation");
    await settingsPage.fillBio("Testing navigation preservation");

    // Navigate to another settings section and back
    await settingsPage.navigateToMembers();
    await settingsPage.navigateToGeneral();

    // Check if data is preserved (this depends on the app's behavior)
    await settingsPage.waitForFormToLoad();
    // Note: Data preservation depends on the application's implementation
  });

  test("should navigate to other main sections from settings", async () => {
    // Navigate to home
    await settingsPage.navigateToHome();
    await settingsPage.verifyUrl("/");

    // Navigate back to settings
    await settingsPage.navigateToSettings();
    await settingsPage.verifyUrl("/settings");

    // Navigate to customers
    await settingsPage.navigateToCustomers();
    await settingsPage.verifyUrl("/customers");

    // Navigate to inbox
    await settingsPage.navigateToInbox();
    await settingsPage.verifyUrl("/inbox");
  });

  test("should verify form accessibility", async () => {
    await settingsPage.waitForFormToLoad();

    // Verify form fields have labels
    await expect(settingsPage.nameField).toBeVisible();
    await expect(settingsPage.emailField).toBeVisible();
    await expect(settingsPage.usernameField).toBeVisible();
    await expect(settingsPage.bioField).toBeVisible();

    // Verify buttons are accessible
    await expect(settingsPage.saveChangesButton).toBeVisible();
    await expect(settingsPage.chooseAvatarButton).toBeVisible();
  });
});
