import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

// Use your TEST secret key from Stripe dashboard
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export const createCheckoutSession = async (cartItems: any[], db: any) => {
    // Look up the actual prices in SQLite to prevent price tampering
    const lineItems = cartItems.map((item) => {
        const dbProduct: any = db.prepare('SELECT * FROM clothes WHERE id = ?').get(item.id);

        if (!dbProduct) throw new Error(`Product ${item.id} not found`);

        return {
            price_data: {
                currency: 'aud',
                product_data: {
                    name: dbProduct.name,
                    description: `${dbProduct.color} - ${dbProduct.size}`,
                },
                unit_amount: Math.round(dbProduct.price * 100), // Stripe expects cents
            },
            quantity: item.quantity,
        };
    });

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        // Make sure this matches your local URL + the success flag
        success_url: 'http://localhost:5173/?success=true',
        cancel_url: 'http://localhost:5173/?canceled=true',
    });

    return session;
};
