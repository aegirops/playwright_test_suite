import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class SettingsPage extends BasePage {
  readonly pageHeading: Locator;
  readonly settingsNavigation: Locator;
  readonly generalNavLink: Locator;
  readonly membersNavLink: Locator;
  readonly notificationsNavLink: Locator;
  readonly securityNavLink: Locator;
  readonly documentationLink: Locator;

  // Profile form elements
  readonly profileSection: Locator;
  readonly profileTitle: Locator;
  readonly profileDescription: Locator;
  readonly saveChangesButton: Locator;

  // Form fields
  readonly nameField: Locator;
  readonly nameLabel: Locator;
  readonly nameDescription: Locator;
  readonly emailField: Locator;
  readonly emailLabel: Locator;
  readonly emailDescription: Locator;
  readonly usernameField: Locator;
  readonly usernameLabel: Locator;
  readonly usernameDescription: Locator;
  readonly avatarSection: Locator;
  readonly avatarLabel: Locator;
  readonly avatarDescription: Locator;
  readonly avatarDisplay: Locator;
  readonly chooseAvatarButton: Locator;
  readonly bioField: Locator;
  readonly bioLabel: Locator;
  readonly bioDescription: Locator;

  constructor(page: Page) {
    super(page);

    this.pageHeading = page.getByRole("heading", {
      name: "Settings",
      level: 1,
    });

    // Settings navigation (secondary nav in main content)
    this.settingsNavigation = page.locator("nav").nth(1); // Second nav element
    this.generalNavLink = this.settingsNavigation.getByRole("link", {
      name: "General",
    });
    this.membersNavLink = this.settingsNavigation.getByRole("link", {
      name: "Members",
    });
    this.notificationsNavLink = this.settingsNavigation.getByRole("link", {
      name: "Notifications",
    });
    this.securityNavLink = this.settingsNavigation.getByRole("link", {
      name: "Security",
    });
    this.documentationLink = this.settingsNavigation.getByRole("link", {
      name: "Documentation",
    });

    // Profile form
    this.profileSection = page
      .locator("div")
      .filter({ hasText: "Profile" })
      .first();
    this.profileTitle = page
      .locator("div")
      .filter({ hasText: "Profile" })
      .first();
    this.profileDescription = page
      .locator("div")
      .filter({ hasText: "These informations will be displayed publicly." });
    this.saveChangesButton = page.getByRole("button", { name: "Save changes" });

    // Form fields
    this.nameField = page.getByRole("textbox", { name: "Name*" });
    this.nameLabel = page.locator("div").filter({ hasText: "Name*" }).first();
    this.nameDescription = page.locator("p").filter({
      hasText: "Will appear on receipts, invoices, and other communication.",
    });

    this.emailField = page.getByRole("textbox", { name: "Email*" });
    this.emailLabel = page.locator("div").filter({ hasText: "Email*" }).first();
    this.emailDescription = page.locator("p").filter({
      hasText: "Used to sign in, for email receipts and product updates.",
    });

    this.usernameField = page.getByRole("textbox", { name: "Username*" });
    this.usernameLabel = page
      .locator("div")
      .filter({ hasText: "Username*" })
      .first();
    this.usernameDescription = page.locator("p").filter({
      hasText: "Your unique username for logging in and your profile URL.",
    });

    this.avatarSection = page
      .locator("div")
      .filter({ hasText: "Avatar" })
      .first();
    this.avatarLabel = page
      .locator("div")
      .filter({ hasText: "Avatar" })
      .first();
    this.avatarDescription = page
      .locator("p")
      .filter({ hasText: "JPG, GIF or PNG. 1MB Max." });
    this.avatarDisplay = page.locator("div").filter({ hasText: "BC" }).first();
    this.chooseAvatarButton = page.getByRole("button", { name: "Choose" });

    this.bioField = page.getByRole("textbox", { name: "Bio" });
    this.bioLabel = page.locator("div").filter({ hasText: "Bio" }).first();
    this.bioDescription = page.locator("p").filter({
      hasText: "Brief description for your profile. URLs are hyperlinked.",
    });
  }

  async goto() {
    await super.goto("/settings");
  }

  async verifyPageLoaded() {
    await expect(this.pageHeading).toBeVisible();
    await expect(this.settingsNavigation).toBeVisible();
    await expect(this.profileSection).toBeVisible();
  }

  async verifySettingsNavigation() {
    await expect(this.generalNavLink).toBeVisible();
    await expect(this.membersNavLink).toBeVisible();
    await expect(this.notificationsNavLink).toBeVisible();
    await expect(this.securityNavLink).toBeVisible();
    await expect(this.documentationLink).toBeVisible();
  }

  async navigateToGeneral() {
    await this.generalNavLink.click();
  }

  async navigateToMembers() {
    await this.membersNavLink.click();
  }

  async navigateToNotifications() {
    await this.notificationsNavLink.click();
  }

  async navigateToSecurity() {
    await this.securityNavLink.click();
  }

  async navigateToDocumentation() {
    await this.documentationLink.click();
  }

  async verifyProfileForm() {
    await expect(this.profileTitle).toBeVisible();
    await expect(this.profileDescription).toBeVisible();
    await expect(this.saveChangesButton).toBeVisible();
  }

  async verifyFormFields() {
    // Name field
    await expect(this.nameField).toBeVisible();
    await expect(this.nameLabel).toBeVisible();
    await expect(this.nameDescription).toBeVisible();

    // Email field
    await expect(this.emailField).toBeVisible();
    await expect(this.emailLabel).toBeVisible();
    await expect(this.emailDescription).toBeVisible();

    // Username field
    await expect(this.usernameField).toBeVisible();
    await expect(this.usernameLabel).toBeVisible();
    await expect(this.usernameDescription).toBeVisible();

    // Avatar section
    await expect(this.avatarLabel).toBeVisible();
    await expect(this.avatarDescription).toBeVisible();
    await expect(this.avatarDisplay).toBeVisible();
    await expect(this.chooseAvatarButton).toBeVisible();

    // Bio field
    await expect(this.bioField).toBeVisible();
    await expect(this.bioLabel).toBeVisible();
    await expect(this.bioDescription).toBeVisible();
  }

  async fillName(name: string) {
    await this.nameField.clear();
    await this.nameField.fill(name);
  }

  async fillEmail(email: string) {
    await this.emailField.clear();
    await this.emailField.fill(email);
  }

  async fillUsername(username: string) {
    await this.usernameField.clear();
    await this.usernameField.fill(username);
  }

  async fillBio(bio: string) {
    await this.bioField.clear();
    await this.bioField.fill(bio);
  }

  async getName(): Promise<string> {
    return await this.nameField.inputValue();
  }

  async getEmail(): Promise<string> {
    return await this.emailField.inputValue();
  }

  async getUsername(): Promise<string> {
    return await this.usernameField.inputValue();
  }

  async getBio(): Promise<string> {
    return await this.bioField.inputValue();
  }

  async clickChooseAvatar() {
    await this.chooseAvatarButton.click();
  }

  async saveChanges() {
    await this.saveChangesButton.click();
  }

  async verifyFieldValue(
    field: "name" | "email" | "username" | "bio",
    expectedValue: string,
  ) {
    const fieldLocators = {
      name: this.nameField,
      email: this.emailField,
      username: this.usernameField,
      bio: this.bioField,
    };

    await expect(fieldLocators[field]).toHaveValue(expectedValue);
  }

  async verifyDefaultValues() {
    await expect(this.nameField).toHaveValue("Benjamin Canac");
    await expect(this.emailField).toHaveValue("ben@nuxtlabs.com");
    await expect(this.usernameField).toHaveValue("benjamincanac");
    await expect(this.bioField).toHaveValue("");
  }

  async fillCompleteProfile(profileData: {
    name?: string;
    email?: string;
    username?: string;
    bio?: string;
  }) {
    if (profileData.name) {
      await this.fillName(profileData.name);
    }
    if (profileData.email) {
      await this.fillEmail(profileData.email);
    }
    if (profileData.username) {
      await this.fillUsername(profileData.username);
    }
    if (profileData.bio) {
      await this.fillBio(profileData.bio);
    }
  }

  async verifyRequiredFields() {
    // Check that required fields have the asterisk
    await expect(this.nameLabel).toContainText("*");
    await expect(this.emailLabel).toContainText("*");
    await expect(this.usernameLabel).toContainText("*");

    // Bio should not be required
    await expect(this.bioLabel).not.toContainText("*");
  }

  async verifyFormDescriptions() {
    await expect(this.nameDescription).toContainText(
      "Will appear on receipts, invoices, and other communication.",
    );
    await expect(this.emailDescription).toContainText(
      "Used to sign in, for email receipts and product updates.",
    );
    await expect(this.usernameDescription).toContainText(
      "Your unique username for logging in and your profile URL.",
    );
    await expect(this.avatarDescription).toContainText(
      "JPG, GIF or PNG. 1MB Max.",
    );
    await expect(this.bioDescription).toContainText(
      "Brief description for your profile. URLs are hyperlinked.",
    );
  }

  async waitForFormToLoad() {
    await expect(this.nameField).toBeVisible();
    await expect(this.emailField).toBeVisible();
    await expect(this.usernameField).toBeVisible();
  }
}
