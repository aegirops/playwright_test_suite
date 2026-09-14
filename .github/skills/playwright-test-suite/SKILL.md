---
name: playwright-test-suite
description: 'Build or extend the Playwright POM (Page Object Model) e2e test suite for this app. Use when asked to write, add, or update e2e tests, Playwright specs, or Page Objects for a page/feature (e.g. "add tests for the settings page", "write a Playwright suite for X", "create a page object for Y").'
---

# Playwright Test Suite Development

Builds on the rules in [playwright.instructions.md](../../instructions/playwright.instructions.md) (POM architecture, locator priority, headless run rule), which auto-apply to any `e2e/**/*.spec.ts` file. This skill adds the end-to-end workflow for producing a new suite or extending an existing one.

## When to Use
- Adding e2e tests for a page/feature that doesn't have coverage yet
- Extending an existing spec file with new test cases
- Creating or updating a Page Object class

## Procedure

1. **Check for an existing Page Object.** Look at [e2e/pages/index.ts](../../../e2e/pages/index.ts) and the target page's component/route under `app/pages/`. Reuse an existing class if one already covers the page.

2. **Create/extend the Page Object** in `e2e/pages/<Name>Page.ts`:
   - Extend `BasePage` (see [BasePage.ts](../../../e2e/pages/BasePage.ts)) to inherit sidebar/header/cookie-banner locators and helpers.
   - Declare all locators as `readonly` fields built in the constructor, following the locator priority from the instructions (role/label first, CSS/id/XPath last).
   - Add a `goto()` override calling `super.goto(<url>)`, plus action/verification methods (`verifyPageLoaded()`, etc.) — mirror the style in [CustomersPage.ts](../../../e2e/pages/CustomersPage.ts).
   - Export the class from `e2e/pages/index.ts`.

3. **Write the spec** in `e2e/tests/<feature>.spec.ts`:
   - Import the Page Object from `"../pages"`.
   - Use `test.describe` with a `beforeEach` that instantiates the page object, calls `goto()`, then `acceptCookies()` (see [customers.spec.ts](../../../e2e/tests/customers.spec.ts) as the reference pattern).
   - Keep test bodies calling Page Object methods only — no raw locators/selectors inside `*.spec.ts` files.

4. **Run the test headless** (no browser UI, per the run rule):
   ```
   npx playwright test e2e/tests/<feature>.spec.ts
   ```

5. **On failure**, inspect `playwright-report/` or `test-results/*/error-context.md`, fix the Page Object locator or test logic, then rerun step 4.

6. **Validate before finishing**:
   ```
   npm run lint
   npm run typecheck
   ```
