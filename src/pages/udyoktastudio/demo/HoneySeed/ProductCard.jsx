export default function ProductCard({ product, onAdd }) {
  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <img
        src={product.image}
        alt={product.name}
        className="h-40 w-full object-cover rounded-lg"
      />
      <h3 className="mt-3 font-semibold">{product.name}</h3>
      <p className="text-sm text-gray-500">{product.unit}</p>
      <p className="mt-1 font-bold">৳ {product.price}</p>

      <button
        onClick={() => onAdd(product)}
        className="mt-3 w-full rounded-lg bg-purple-600 py-2 text-white"
      >
        Add to Cart
      </button>
    </div>
  );
}
