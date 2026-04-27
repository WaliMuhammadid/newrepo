import Product from '../models/Product.js';

/**
 * @desc    Get all products with optional filtering
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let query = {};

    // Filter by category
    if (category && ['Cosmetics', 'Baby Products'].includes(category)) {
      query.category = category;
    }

    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      const error = new Error('Product not found');
      error.status = 404;
      throw error;
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private (Admin only)
 */
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, stockStatus } = req.body;

    // Validation
    if (!name || !description || price === undefined || !category || stockStatus === undefined) {
      const error = new Error('Please provide all required fields: name, description, price, category, stockStatus');
      error.status = 400;
      throw error;
    }

    // Handle image - uploaded file or URL
    let imageURL = req.body.imageURL || '';
    if (req.file) {
      // If using local storage, construct the URL
      const protocol = req.protocol;
      const host = req.get('host');
      imageURL = `${protocol}://${host}/uploads/${req.file.filename}`;
    }

    // If no image provided, use a default placeholder
    if (!imageURL) {
      imageURL = 'https://via.placeholder.com/500?text=No+Image';
    }

    const product = await Product.create({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      category,
      imageURL,
      stockStatus: Number(stockStatus),
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Private (Admin only)
 */
export const updateProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, stockStatus } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      const error = new Error('Product not found');
      error.status = 404;
      throw error;
    }

    // Handle image update
    let imageURL = product.imageURL;
    if (req.file) {
      const protocol = req.protocol;
      const host = req.get('host');
      imageURL = `${protocol}://${host}/uploads/${req.file.filename}`;
    } else if (req.body.imageURL) {
      imageURL = req.body.imageURL;
    }

    // Update fields
    product.name = name !== undefined ? name.trim() : product.name;
    product.description = description !== undefined ? description.trim() : product.description;
    product.price = price !== undefined ? Number(price) : product.price;
    product.category = category || product.category;
    product.imageURL = imageURL;
    product.stockStatus = stockStatus !== undefined ? Number(stockStatus) : product.stockStatus;

    const updatedProduct = await product.save();

    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private (Admin only)
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      const error = new Error('Product not found');
      error.status = 404;
      throw error;
    }

    await product.deleteOne();

    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};
