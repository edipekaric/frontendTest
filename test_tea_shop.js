import { Builder, By, until } from "selenium-webdriver";

(async function testWorkflow() {
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    // Step 1: Open the website
    await driver.get("http://localhost:5173");
    await driver.manage().window().maximize();

    // Step 2: Navigate to SHOP
    let shopLink = await driver.findElement(By.linkText("SHOP"));
    await shopLink.click();
    await driver.wait(until.urlContains("/shop"), 5000);

    // Step 3: Add two items of the first product to the cart
    let firstProductQuantityInput = await driver.wait(
      until.elementLocated(By.css("input.quantity-input")),
      10000
    );
    await driver.wait(until.elementIsVisible(firstProductQuantityInput), 5000);
    await firstProductQuantityInput.clear();
    await firstProductQuantityInput.sendKeys("2");

    let firstProductAddButton = await driver.wait(
      until.elementLocated(By.xpath("(//button[contains(text(), 'Add to Cart')])[1]")),
      5000
    );
    await firstProductAddButton.click();

    // Handle the alert for the first product
    await driver.wait(until.alertIsPresent(), 5000);
    let alert = await driver.switchTo().alert();
    console.log(`Alert text: ${await alert.getText()}`);
    await alert.accept();

    // Step 4: Add three items of the second product to the cart
    let secondProductQuantityInput = await driver.findElement(By.xpath("(//input[@type='number'])[2]"));
    await driver.wait(until.elementIsVisible(secondProductQuantityInput), 5000);
    await secondProductQuantityInput.clear();
    await secondProductQuantityInput.sendKeys("3");

    let secondProductAddButton = await driver.wait(
      until.elementLocated(By.xpath("(//button[contains(text(), 'Add to Cart')])[2]")),
      5000
    );
    await secondProductAddButton.click();

    // Handle the alert for the second product
    await driver.wait(until.alertIsPresent(), 5000);
    alert = await driver.switchTo().alert();
    console.log(`Alert text: ${await alert.getText()}`);
    await alert.accept();

    // Step 5: Navigate to the CART page
    let cartLink = await driver.findElement(By.linkText("CART"));
    await cartLink.click();
    await driver.wait(until.urlContains("/cart"), 5000);

    // Step 6: Enter shipping and payment details
    let enterDetailsButton = await driver.findElement(By.xpath("//button[contains(text(), 'Enter Shipping and Payment Details')]"));
    await enterDetailsButton.click();

    await driver.wait(until.elementLocated(By.id("name")), 5000);
    await driver.findElement(By.id("name")).sendKeys("John Doe");
    await driver.findElement(By.id("address")).sendKeys("123 Elm Street");
    await driver.findElement(By.id("city")).sendKeys("Somewhere");
    await driver.findElement(By.id("postalCode")).sendKeys("12345");
    await driver.findElement(By.id("country")).sendKeys("Wonderland");

    // New: Enter card details
    await driver.findElement(By.id("cardNumber")).sendKeys("4111111111111111");
    await driver.findElement(By.id("expirationDate")).sendKeys("12/25");
    await driver.findElement(By.id("ccv")).sendKeys("123");

    // Wait for the modal content
    let modalContent = await driver.findElement(By.className("modal-content"));
    await driver.wait(until.elementIsVisible(modalContent), 10000);

    // Scroll to the Save button
    let saveButton = await driver.findElement(By.className("btn-save"));
    await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", saveButton);
    await driver.sleep(500);

    // Debug Save button state
    let isDisplayed = await saveButton.isDisplayed();
    let isEnabled = await saveButton.isEnabled();
    console.log("Save button displayed:", isDisplayed, "Enabled:", isEnabled);

    // Try clicking the Save button
    try {
      await saveButton.click();
      console.log("Save button clicked successfully.");
    } catch (error) {
      console.log("Standard click failed. Attempting JavaScript click...");
      await driver.executeScript("arguments[0].click();", saveButton);
      console.log("Save button clicked using JavaScript.");
    }

    // Ensure the modal overlay becomes invisible
    let modalOverlay = await driver.findElement(By.className("modal-overlay"));
    console.log("Waiting for modal overlay to become invisible...");
    await driver.wait(until.elementIsNotVisible(modalOverlay), 10000);

    // Step 7: Scroll to Confirm Order button
    let confirmButton = await driver.findElement(By.xpath("//button[contains(text(), 'Confirm Order')]"));
    await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", confirmButton);

    // Ensure the button is interactable
    await driver.wait(until.elementIsVisible(confirmButton), 5000);
    let isDisabled = await confirmButton.getAttribute("disabled");
    while (isDisabled) {
      console.log("Confirm Order button is disabled. Retrying...");
      await driver.sleep(500);
      isDisabled = await confirmButton.getAttribute("disabled");
    }

    // Click Confirm Order
    await confirmButton.click();
    console.log("Clicked Confirm Order button.");

    // Step 8: Check confirmation popup
    await driver.wait(until.alertIsPresent(), 5000);
    alert = await driver.switchTo().alert();
    let alertText = await alert.getText();

    // Verify the confirmation message
    const expectedMessage = "Order confirmed! Thank you for your purchase.";
    if (alertText === expectedMessage) {
      console.log("Test passed: Confirmation popup appeared with the correct message.");
    } else {
      throw new Error(`Test failed: Expected "${expectedMessage}", but got "${alertText}"`);
    }

    await alert.accept();
  } catch (error) {
    console.error(`Test failed: ${error}`);
  } finally {
    await driver.quit();
  }
})();
