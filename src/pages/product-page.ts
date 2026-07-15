import {Page,Locator,expect} from "@playwright/test";
import { BasePage } from "./base-page";
import winston from 'winston'

export class Add_Products extends BasePage{
    private readonly productstab;
    private readonly continueShoppingbutton;
    private readonly carttab;
    private readonly cartproductlist;
    private readonly proceedtocheckout;
    private readonly placeorderbutton;
    private readonly PaymentHeader;
    private readonly logoutbutton

    constructor(page:Page,log:winston.Logger){
        super(page,log)
        this.productstab = page.locator('//a[@href="/products"]')
        this.carttab = page.locator('(//a[@href="/view_cart"])[1]')
        this.continueShoppingbutton = page.locator('//button[text()="Continue Shopping"]')
        this.cartproductlist = page.locator('//table//tbody/tr/td[@class="cart_description"]//a')
        this.proceedtocheckout = page.locator('//a[text()="Proceed To Checkout"]')
        this.placeorderbutton = page.locator('//a[text()="Place Order"]')
        this.PaymentHeader = page.locator('//h2[text()="Payment"]') 
        this.logoutbutton = page.locator('//a[@href="/logout"]')
    }


    async select_product_and_Add_to_cart(products:string[]){
        await this.isElementFound(this.productstab)
        await this.clickElement(this.productstab)
        for (let i=0;i<products.length;i++){
            const product = products[i]
            let addToCart = await this.fetch_element(`(//p[text()="${product}"]/parent::div)[1]/a`)
            await this.hover_element(addToCart)
            await this.clickElement(addToCart)
            await this.clickElement(this.continueShoppingbutton)
            
        }
        await this.clickElement(this.carttab)
        let productsAdded:string[] = await this.getText(this.cartproductlist)
        expect(productsAdded).toEqual(products);
        await this.clickElement(this.proceedtocheckout)
        await this.clickElement(this.placeorderbutton)
        await this.isElementFound(this.PaymentHeader)
    }

    async Add_Producs_to_cart_and_Delete(products:string[]){
        await this.isElementFound(this.productstab)
        await this.clickElement(this.productstab)
        for (let i=0;i<products.length;i++){
            const product = products[i]
            let addToCart = await this.fetch_element(`(//p[text()="${product}"]/parent::div)[1]/a`)
            await this.hover_element(addToCart)
            await this.clickElement(addToCart)
            await this.clickElement(this.continueShoppingbutton)
            
        }
        await this.clickElement(this.carttab)
        let productsAdded:string[] = await this.getText(this.cartproductlist)
        expect(productsAdded).toEqual(products);
        
        for (let i=1;i<=products.length;i++){
            let deleteEle = await this.fetch_element(`(//a[@class="cart_quantity_delete"])[${i}]`)
            await this.clickElement(deleteEle)
            
        }

    }
    async logout(){
        await this.clickElement(this.logoutbutton)
    }
}

