import mongoose from 'mongoose';

const ProductsSchema = new mongoose.Schema({
    pname: { type: String, required: true },
    price: { type: String, required: true },
});

export default mongoose.models.products || mongoose.model('products', ProductsSchema);
