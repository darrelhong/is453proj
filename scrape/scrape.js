const ppt = require('puppeteer');

const { tickers } = require('./tickers');

(async () => {
    const browser = await ppt.launch({ headless: false });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 })
    await page.goto('https://www.ortex.com/login')

    const email = await page.waitForSelector('input[type=username]')
    await email.type('darrel.hong.2021@smu.edu.sg')

    const pw = await page.waitForSelector('input[type=password]')
    await pw.type('P@assword1')

    await page.click('button[type=submit]')
    await page.waitForTimeout(10000);

    for (const ticker of tickers) {

        const search = await page.waitForSelector('#search')
        await search.click({ clickCount: 3 })
        await search.type(ticker, { delay: 200 })
        await page.waitForTimeout(3000)
        await page.keyboard.press('Enter')
        try {
            await page.waitForRequest(() => true, { timeout: 2000 })

            const shortInterest = await page.waitForXPath("//h3[contains(., 'Short Interest for')]", { timeout: 2000 })
            await shortInterest.click()
            await page.waitForNavigation()

            const costToBorrow = await page.waitForXPath("//*[name()='tspan'][contains(., 'Cost To Borrow')]", { timeout: 2000 })
            await costToBorrow.click()
            const estimatedSi = await page.waitForXPath("//*[name()='tspan'][contains(., 'Estimated Short Interest')]", { timeout: 2000 })
            await estimatedSi.click()

            const exportButton = await page.waitForXPath("//div[contains(text(), 'Export Short interest data for') and contains(@class, 'chart_v5_options')]", { timeout: 2000 })
            await exportButton.click()

            const exportCSV = await page.waitForXPath("//button[contains(text(), 'CSV')]", { timeout: 2000 })
            await exportCSV.click()

            await page.waitForTimeout(1000)
            await page.keyboard.press('Escape')
            await page.waitForTimeout(500)

        }
        catch (err) {
            console.log(ticker)
            await page.goto('https://www.ortex.com/view/main')
            await page.waitForTimeout(10000);
            continue
        }
    }
    // await browser.close();
})();