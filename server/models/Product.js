import mongoose from 'mongoose';

/**
 * Product Schema
 * Defines the structure for cosmetic and baby products in the store
 */
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Cosmetics', 'Baby Products'],
        message: 'Category must be either Cosmetics or Baby Products',
      },
    },
    imageURL: {
      type: String,
      required: [true, 'Product image is required'],
      default: '',
    },
    stockStatus: {
      type: Number,
      required: [true, 'Stock status is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Index for search functionality
productSchema.index({ name: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product;
