import { Locator, Page,expect } from '@playwright/test'
import winston from 'winston';
// import { logger as log }  from '../utils/custom-logger'

export class BasePage {
    private readonly page:Page;
    private readonly log:winston.Logger;

    constructor(page:Page,log:winston.Logger){
        this.page = page,
        this.log = log
    }

    async navigate(url:string,retries=3,delay=1000):Promise<void>{
        for (let retry=1;retry<=retries;retry++){    
            try{
                this.log.debug(`Navigating to url - ${url}`)
                await this.page.goto(url,{waitUntil:'domcontentloaded'})
                this.log.info(`successfully navigated to url -${url}`)
                return
            }
            catch (error){
                this.log.debug(`Navigation to url-${url} failed in attempt - ${retry} due to exception - ${error} `);
                if (retry === retries){
                    this.log.error(`Navigation to url - ${url} failed with exception - ${error} in ${retries} attempts`)
                    throw new Error(`Navigation to url - ${url} failed with exception - ${error} in ${retries} attempts`)
                }
                this.log.debug(`trying to navigate to url-${url} again after ${delay} milli seconds`)
                await new Promise((resolve)=> setTimeout(resolve,delay))

            }
        }
    }

    async clickElement(ele:Locator,retries=3,delay=1000):Promise<void>{
        for (let retry=1;retry<=retries;retry++){
            try{
                this.log.debug(`trying to click an element - ${ele}`)
                await ele.click({timeout:3000,button:'left'})
                this.log.info(`element - ${ele} clicked successfully`)
                return
            }
            catch (error){
                this.log.debug(`clicking element - ${ele} failed in attempt - ${retry} due to exception - ${error}`)
                if (retry === retries) {
                    this.log.error(`clicking element - ${ele} failed in ${retries} attempts with exception - ${error}`)
                    throw new Error(`clicking element - ${ele} failed in ${retries} attempts with exception - ${error}`)
                }
                this.log.debug(`waiting for ${delay} milli seconds to perform click on element - ${ele}`)
                await new Promise((resolve)=> setTimeout(resolve,delay))
                this.log.debug(`trying to locate element - ${ele} again after ${delay} milli seconds`)
            }
        }
    }

    async inputText(ele:Locator,text:string,retries=3,delay=1000):Promise<void>{
        for (let retry=1;retry<=retries;retry++){
            try{
                this.log.debug(`trying to enter text - ${text} into element - ${ele} attempt - ${retry}`)
                await ele.fill(text)
                this.log.info(`successfully entered text - ******* into element - ${ele}`)
                return
            }
            catch(error){
                this.log.debug(`failed enetering text - ${text} into element - ${ele} in attempt - ${retry} due to exception - ${error} `)
                if (retry === retries){
                    this.log.error(`failed enetering text - ${text} into element - ${ele} after ${retries} attempts due to exception - ${error} `)
                    throw new Error(`failed enetering text - ${text} into element - ${ele} after ${retries} attempts due to exception - ${error} `)
                }
                this.log.debug(`waiting for ${delay} milli seconds to perform filling text - ${text} into element - ${ele}`)
                await new Promise((resolve)=>setTimeout(resolve,delay))
                this.log.debug(`trying to locate element - ${ele} again after ${delay} milli seconds`)
            }
        }
    }

    async isElementFound(ele:Locator,retries=3,delay=1000):Promise<void>{

        for (let retry=1;retry<=retries;retry++){
            try{
                this.log.debug(`trying to locate element - ${ele} in DOM attempt - ${retry}`)
                await expect(ele).toBeVisible()
                this.log.info(`element - ${ele} found and it is in visible state`)
                return
            }
            catch(error){
                this.log.debug(`failed to locate element - ${ele} in DOM attempt - ${retry} due to exception - ${error}`)
                if (retry === retries) {
                    this.log.error(`failed to locate element - ${ele} in DOM after ${retries} retries due to exception - ${error}`)
                    throw new Error(`failed to locate element - ${ele} in DOM after ${retries} retries due to exception - ${error}`)
                }
                this.log.debug(`waiting for ${delay} milli seconds to find element - ${ele} in DOM`)
                await new Promise((resolve)=>setTimeout(resolve,delay))
                this.log.debug(`trying to locate element - ${ele} again after ${delay} milli seconds`)
            }
        }

    }
    async uploadFile(ele:Locator,filepath:string,retries=3,delay=1000):Promise<void>{
        for (let retry=1;retry<=retries;retry++){
            try{
                this.log.debug(`trying to insert file from - ${filepath} into element - ${ele}`)
                await ele.setInputFiles([filepath])
                this.log.info(`file from ${filepath} uploaded successfully into element - ${ele}`)
                return
            }
            catch (error){
                this.log.debug(`failed to upload file from ${filepath} into element - ${ele} in attempt - ${retry} due to exception - ${error}`)
                if (retry === retries) {
                    this.log.error(`failed to upload file from ${filepath} into element - ${ele} after ${retries} retries due to exception - ${error}`)
                    throw new Error(`failed to upload file from ${filepath} into element - ${ele} after ${retries} retries due to exception - ${error}`)
                    
                }
                this.log.debug(`waiting for ${delay} milli seconds to upload file from ${filepath} into element - ${ele}`)
                await new Promise((resolve)=>setTimeout(resolve,delay))
                this.log.debug(`trying to locate element - ${ele} again for uploading file after ${delay} milli seconds`)
            }
        }

    }

    async fetch_element(selector:string,retries=3,delay=1000):Promise<Locator>{
        for (let retry=1;retry<=retries;retry++){
            try{
                this.log.debug(`trying to fetch element using selector - ${selector} attempt - ${retry}`)
                const ele = this.page.locator(selector)
                await ele.first().waitFor({state:'visible', timeout:3000})
                this.log.info(`element fetched successfully using selector - ${selector}`)
                return ele
            }
            catch (error){
                this.log.debug(`failed to fetch element using selector - ${selector} in attempt - ${retry} due to exception - ${error}`)
                if (retry === retries) {
                    this.log.error(`failed to fetch element using selector - ${selector} after ${retries} attempts due to exception - ${error}`)
                    throw new Error(`failed to fetch element using selector - ${selector} after ${retries} attempts due to exception - ${error}`)
                }
                this.log.debug(`waiting for ${delay} milli seconds before retrying selector - ${selector}`)
                await new Promise((resolve)=>setTimeout(resolve,delay))
            }
        }
        throw new Error(`failed to fetch element using selector - ${selector}`)
    }

    async hover_element(ele:Locator,retries=3,delay=1000):Promise<void>{
        for (let retry=1;retry<=retries;retry++){
            try{
                this.log.debug(`trying to hover over element - ${ele} attempt - ${retry}`)
                await ele.hover({timeout:3000})
                this.log.info(`hovered successfully over element - ${ele}`)
                return
            }
            catch (error){
                this.log.debug(`hovering over element - ${ele} failed in attempt - ${retry} due to exception - ${error}`)
                if (retry === retries) {
                    this.log.error(`hovering over element - ${ele} failed after ${retries} attempts due to exception - ${error}`)
                    throw new Error(`hovering over element - ${ele} failed after ${retries} attempts due to exception - ${error}`)
                }
                this.log.debug(`waiting for ${delay} milli seconds before retrying hover on element - ${ele}`)
                await new Promise((resolve)=>setTimeout(resolve,delay))
            }
        }
    }

    async getText(ele:Locator):Promise<string[]>{
        return await ele.allTextContents()
    }


    async pauseExecution(delay=5000){
        this.log.info(`timeout of ${delay} milliseconds added due to DOM rendering issue`)
        await this.page.waitForTimeout(delay)
        this.log.info(`execution started now`)
    }

}