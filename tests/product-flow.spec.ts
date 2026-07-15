import { test, expect } from '../src/fixtures/base-fixture'

test.use({ storageState: 'storage/user_auth.json' })

test.describe('Product cart flows @regression', () => {
    test.beforeEach(async ({ Base }) => {
        await Base.navigate('/')
    })

    test('add products and proceed to checkout', async ({ Products }) => {
        const productsToAdd = ['Blue Top']

        await Products.select_product_and_Add_to_cart(productsToAdd)
    })

    test('add products and remove from cart', async ({ Products }) => {
        const productsToAdd = ['Blue Top']

        await Products.Add_Producs_to_cart_and_Delete(productsToAdd)
    })

    test('logout',async({Products})=>{
        await Products.logout()
    })
})
