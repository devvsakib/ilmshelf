export default function Cart({ cart }) {
    const total = cart.reduce((s, p) => s + p.price * p.qty, 0);

    const orderText = cart
        .map(p => `${p.name} x ${p.qty}`)
        .join("%0A");

    const whatsappLink = `https://wa.me/8801XXXXXXXXX?text=Order:%0A${orderText}%0ATotal: ৳${total}`;

    return (
        <div className="fixed bottom-4 right-4 bg-white p-4 rounded-xl shadow-lg w-72">
            <h4 className="font-bold mb-2">Your Cart</h4>

            {cart.length === 0 && (
                <p className="text-sm text-gray-500">No items</p>
            )}

            {cart.map(p => (
                <div key={p.id} className="flex justify-between text-sm">
                    <span>{p.name} × {p.qty}</span>
                    <span>৳{p.price * p.qty}</span>
                </div>
            ))}

            <div className="mt-2 font-bold">Total: ৳{total}</div>

            <a
                href={whatsappLink}
                target="_blank"
                className="mt-3 block text-center rounded-lg bg-green-500 py-2 text-white"
            >
                Order via WhatsApp
            </a>
        </div>
    );
}
