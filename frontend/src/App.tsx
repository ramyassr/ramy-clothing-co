import React, { useState, useEffect } from 'react';

interface ClothingItem {
    id: number;
    name: string;
    color: string;
    size: string;
    price: number;
    quantity?: number;
}

export default function App() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', color: 'Black', size: 'Medium', price: 0 });
    const [items, setItems] = useState<ClothingItem[]>([]);
    const [cart, setCart] = useState<ClothingItem[]>([]);
    const [filters, setFilters] = useState({ color: '', size: '' });
    
    // User Details for Checkout
    const [customer, setCustomer] = useState({ name: '', email: '', address: '' });

    useEffect(() => {
        const params = new URLSearchParams(filters).toString();
        fetch(`http://localhost:5000/api/clothes?${params}`)
            .then(res => res.json())
            .then(data => setItems(data));
    }, [filters]);

    // --- Math Logic ---
    const subtotal = cart.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
    const totalItems = cart.reduce((acc, item) => acc + (item.quantity || 0), 0);

    // --- Cart Functions ---
    const addToCart = (item: ClothingItem) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i);
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const updateQuantity = (id: number, delta: number) => {
        setCart(prev => prev.map(item =>
            item.id === id ? { ...item, quantity: Math.max(1, (item.quantity || 1) + delta) } : item
        ));
    };

    const removeFromCart = (id: number) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    // --- Database Functions ---
    const handleAdminSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/api/admin/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newItem)
        });

        if (response.ok) {
            alert("Item added!");
            setFilters({ ...filters });
        }
    };

    const deleteItem = async (id: number) => {
        if (!window.confirm("Delete this item from database?")) return;
        await fetch(`http://localhost:5000/api/admin/delete/${id}`, { method: 'DELETE' });
        setFilters({ ...filters });
    };

    const handleCheckout = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Order Data:", { customer, cart, total: subtotal });
        alert(`Thank you ${customer.name}! Order for $${subtotal.toFixed(2)} placed (Simulation).`);
        setCart([]);
        setShowCheckout(false);
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', fontFamily: 'Arial', paddingBottom: '100px' }}>
            {/* Welcome Widget */}
            <header style={{ padding: '40px 20px', textAlign: 'center', borderBottom: '1px solid #eee' }}>
                <h1>Ramy Clothing Co.</h1>
                <p>Premium basics in Black, Grey, and White.</p>
            </header>

            {!showCheckout ? (
                <>
                    {/* Filters & Navigation */}
                    <nav style={{ padding: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        <select onChange={e => setFilters({ ...filters, color: e.target.value })}>
                            <option value="">All Colors</option>
                            <option value="Black">Black</option>
                            <option value="Grey">Grey</option>
                            <option value="White">White</option>
                        </select>
                        <select onChange={e => setFilters({ ...filters, size: e.target.value })}>
                            <option value="">All Sizes</option>
                            <option value="Small">Small</option>
                            <option value="Medium">Medium</option>
                            <option value="Large">Large</option>
                        </select>
                    </nav>

                    {/* Main Display Area */}
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <section style={{ flex: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            {items.map(item => (
                                <div key={item.id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '4px' }}>
                                    <h3>{item.name}</h3>
                                    <p>{item.color} | {item.size}</p>
                                    <p><strong>${item.price.toFixed(2)}</strong></p>
                                    <button onClick={() => addToCart(item)} style={btnStyle}>Add to Cart</button>
                                </div>
                            ))}
                        </section>

                        {/* Shopping Cart Sidebar */}
                        <aside style={{ flex: 1, background: '#fafafa', padding: '20px', borderRadius: '8px', height: 'fit-content' }}>
                            <h2>Your Cart ({totalItems})</h2>
                            {cart.map(item => (
                                <div key={item.id} style={{ marginBottom: '10px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <h4 style={{ margin: 0 }}>{item.name}</h4>
                                        <span>${((item.price) * (item.quantity || 1)).toFixed(2)}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                                        <div>
                                            <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                                            <span style={{ margin: '0 10px' }}>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                                        </div>
                                        <button onClick={() => removeFromCart(item.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Remove</button>
                                    </div>
                                </div>
                            ))}
                            
                            {cart.length > 0 ? (
                                <div style={{ marginTop: '20px', borderTop: '2px solid #000', paddingTop: '10px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                        <span>Total:</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <button 
                                        onClick={() => setShowCheckout(true)}
                                        style={{ width: '100%', marginTop: '20px', padding: '10px', background: '#000', color: '#fff', cursor: 'pointer' }}
                                    >
                                        Proceed to Checkout
                                    </button>
                                </div>
                            ) : <p>Empty cart</p>}
                        </aside>
                    </div>
                </>
            ) : (
                /* Checkout Form View */
                <div style={{ maxWidth: '500px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
                    <button onClick={() => setShowCheckout(false)} style={{ marginBottom: '10px', cursor: 'pointer' }}>← Back</button>
                    <h2>Checkout</h2>
                    <p>Total Amount: <strong>${subtotal.toFixed(2)}</strong></p>
                    <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <input type="text" placeholder="Full Name" required onChange={e => setCustomer({...customer, name: e.target.value})} style={inputStyle} />
                        <input type="email" placeholder="Email" required onChange={e => setCustomer({...customer, email: e.target.value})} style={inputStyle} />
                        <textarea placeholder="Shipping Address" required onChange={e => setCustomer({...customer, address: e.target.value})} style={{...inputStyle, height: '80px'}} />
                        <button type="submit" style={{ padding: '15px', background: '#000', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>
                            Complete Order
                        </button>
                    </form>
                </div>
            )}

            {/* Admin Section */}
            <div style={{ marginTop: '50px', borderTop: '1px dotted #ccc', paddingTop: '20px' }}>
                <button onClick={() => setIsAdmin(!isAdmin)} style={{ cursor: 'pointer' }}>
                    {isAdmin ? "Close Admin" : "Open Admin Panel"}
                </button>
                {isAdmin && (
                    <div style={{ marginTop: '30px', border: '2px solid #000', padding: '20px' }}>
                        <h2>Database Management</h2>
                        <form onSubmit={handleAdminSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
                            <input type="text" placeholder="Name" required onChange={e => setNewItem({ ...newItem, name: e.target.value })} style={inputStyle} />
                            <input type="number" placeholder="Price" required onChange={e => setNewItem({ ...newItem, price: parseFloat(e.target.value) })} style={inputStyle} />
                            <select onChange={e => setNewItem({ ...newItem, color: e.target.value })} style={inputStyle}>
                                <option value="Black">Black</option>
                                <option value="Grey">Grey</option>
                                <option value="White">White</option>
                            </select>
                            <select onChange={e => setNewItem({ ...newItem, size: e.target.value })} style={inputStyle}>
                                <option value="Small">Small</option>
                                <option value="Medium">Medium</option>
                                <option value="Large">Large</option>
                            </select>
                            <button type="submit" style={{ padding: '0 20px', cursor: 'pointer' }}>Add to DB</button>
                        </form>

                        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #eee' }}>
                                    <th>ID</th><th>Name</th><th>Color</th><th>Size</th><th>Price</th><th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(item => (
                                    <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td>{item.id}</td>
                                        <td>{item.name}</td>
                                        <td>{item.color}</td>
                                        <td>{item.size}</td>
                                        <td>${item.price.toFixed(2)}</td>
                                        <td>
                                            <button onClick={() => deleteItem(item.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

const btnStyle = { padding: '8px 12px', cursor: 'pointer', background: '#fff', border: '1px solid #333' };
const inputStyle = { padding: '8px', border: '1px solid #ccc', borderRadius: '4px' };