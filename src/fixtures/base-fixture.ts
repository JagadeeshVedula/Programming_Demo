import {test as base} from '@playwright/test'
import { BasePage } from '../pages/base-page'
import { LoginPage } from '../pages/login-page'
import { ContactUsPage } from '../pages/contactUs-page'
import { APIContext } from '../pages/api-page'
import { Add_Products } from '../pages/product-page'
import { createCustomLogger } from '../utils/custom-logger'
type PageObjects = {
    Base: BasePage;
    Login : LoginPage;
    Contact : ContactUsPage;
    API : APIContext;
    Products: Add_Products
}

export const test = base.extend<PageObjects>({
    Base: async({page},use)=>{
        const log = createCustomLogger(base.info().title)
        return use(new BasePage(page,log))
    },
    Login: async({page},use)=>{
        const log = createCustomLogger(base.info().title)
        return use(new LoginPage(page,log))
    },
    Contact: async({page},use)=>{
        const log = createCustomLogger(base.info().title)
        return use(new ContactUsPage(page,log))
    },
    API: async({request},use)=>{
        const log = createCustomLogger(base.info().title)
        return use(new APIContext(request,log))
    },
    Products: async({page},use)=>{
        const log = createCustomLogger(base.info().title)
        return use(new Add_Products(page,log))
    }
})

export {expect} from '@playwright/test'