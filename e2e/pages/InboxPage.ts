import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class InboxPage extends BasePage {
  readonly pageHeading: Locator;
  readonly emailCount: Locator;
  readonly allTab: Locator;
  readonly unreadTab: Locator;
  readonly emailList: Locator;
  readonly emailItems: Locator;

  constructor(page: Page) {
    super(page);

    this.pageHeading = page.getByRole("heading", { name: "Inbox", level: 1 });
    this.emailCount = page.locator("div").filter({ hasText: /^\d+$/ }).first();

    // Tabs
    this.allTab = page.getByRole("tab", { name: "All" });
    this.unreadTab = page.getByRole("tab", { name: "Unread" });

    // Email list
    this.emailList = page
      .locator("div")
      .filter({ hasText: /Alex Smith|Jordan Brown|Taylor Green/ })
      .first()
      .locator("..");
    this.emailItems = page.locator('div[cursor="pointer"]').filter({
      hasText:
        /Alex Smith|Jordan Brown|Taylor Green|Morgan White|Casey Gray|Jamie Johnson|Riley Davis|Kelly Wilson|Drew Moore|Jordan Taylor|Morgan Anderson|Casey Thomas|Jamie Jackson|Riley White|Kelly Harris|Drew Martin|Alex Thompson|Jordan Garcia|Taylor Rodriguez|Morgan Lopez/,
    });
  }

  async goto() {
    await super.goto("/inbox");
  }

  async verifyPageLoaded() {
    await expect(this.pageHeading).toBeVisible();
    await expect(this.emailCount).toBeVisible();
    await expect(this.allTab).toBeVisible();
    await expect(this.unreadTab).toBeVisible();
  }

  async verifyTabsPresent() {
    await expect(this.allTab).toBeVisible();
    await expect(this.unreadTab).toBeVisible();
  }

  async clickAllTab() {
    await this.allTab.click();
  }

  async clickUnreadTab() {
    await this.unreadTab.click();
  }

  async verifyAllTabSelected() {
    await expect(this.allTab).toHaveAttribute("aria-selected", "true");
  }

  async verifyUnreadTabSelected() {
    await expect(this.unreadTab).toHaveAttribute("aria-selected", "true");
  }

  async getEmailCount(): Promise<string> {
    return (await this.emailCount.textContent()) || "";
  }

  async getEmailItemsCount(): Promise<number> {
    return await this.emailItems.count();
  }

  async verifyEmailsDisplayed() {
    await expect(this.emailItems.first()).toBeVisible();
  }

  async getEmailByIndex(index: number): Promise<Locator> {
    return this.emailItems.nth(index);
  }

  getEmailBySender(senderName: string): Locator {
    return this.emailItems.filter({ hasText: senderName });
  }

  getEmailBySubject(subject: string): Locator {
    return this.emailItems.filter({ hasText: subject });
  }

  async clickEmailByIndex(index: number) {
    await this.emailItems.nth(index).click();
  }

  async clickEmailBySender(senderName: string) {
    const email = this.getEmailBySender(senderName);
    await email.click();
  }

  async clickEmailBySubject(subject: string) {
    const email = this.getEmailBySubject(subject);
    await email.click();
  }

  async getEmailSender(emailElement: Locator): Promise<string> {
    const senderElement = emailElement
      .locator("div")
      .first()
      .locator("div")
      .first();
    return (await senderElement.textContent()) || "";
  }

  async getEmailTime(emailElement: Locator): Promise<string> {
    const timeElement = emailElement
      .locator("div")
      .first()
      .locator("div")
      .last();
    return (await timeElement.textContent()) || "";
  }

  async getEmailSubject(emailElement: Locator): Promise<string> {
    const subjectElement = emailElement.locator("p").first();
    return (await subjectElement.textContent()) || "";
  }

  async getEmailPreview(emailElement: Locator): Promise<string> {
    const previewElement = emailElement.locator("p").last();
    return (await previewElement.textContent()) || "";
  }

  async verifyEmailContainsText(emailElement: Locator, text: string) {
    await expect(emailElement).toContainText(text);
  }

  async scrollToEmail(index: number) {
    await this.emailItems.nth(index).scrollIntoViewIfNeeded();
  }

  async waitForEmailsToLoad() {
    await expect(this.emailItems.first()).toBeVisible();
  }

  // Helper method to search for specific email patterns
  async findEmailsByPattern(pattern: RegExp): Promise<Locator[]> {
    const count = await this.emailItems.count();
    const matchingEmails: Locator[] = [];

    for (let i = 0; i < count; i++) {
      const email = this.emailItems.nth(i);
      const text = (await email.textContent()) || "";
      if (pattern.test(text)) {
        matchingEmails.push(email);
      }
    }

    return matchingEmails;
  }

  // Verify specific email content structure
  async verifyEmailStructure(emailElement: Locator) {
    // Each email should have sender info, subject, and preview
    const senderSection = emailElement.locator("div").first();
    const subjectElement = emailElement.locator("p").first();
    const previewElement = emailElement.locator("p").last();

    await expect(senderSection).toBeVisible();
    await expect(subjectElement).toBeVisible();
    await expect(previewElement).toBeVisible();
  }
}
