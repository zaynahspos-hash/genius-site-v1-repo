import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 12;
  const page = Number(req.query.page) || 1;

  // Search Logic
  const keyword = req.query.search
    ? {
        title: {
          $regex: req.query.search,
          $options: 'i',
        },
      }
    : {};

  // Filters
  const statusFilter = req.query.status && req.query.status !== 'all' 
    ? { status: req.query.status } 
    : {};
    
  const categoryFilter = req.query.category 
    ? { categoryId: req.query.category }
    : {};

  const query = { ...keyword, ...statusFilter, ...categoryFilter };

  const count = await Product.countDocuments(query);
  const products = await Product.find(query)
    .sort(req.query.sort ? { [req.query.sort.split('-')[0]]: req.query.sort.split('-')[1] === 'desc' ? -1 : 1 } : { createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize), count });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  // Support fetching by ID or Slug
  let product;
  if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(req.params.id);
  } else {
      product = await Product.findOne({ slug: req.params.id });
  }

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    title: 'Sample Product ' + Date.now(),
    slug: 'sample-product-' + Date.now(),
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    images: ['/images/sample.jpg'],
    description: 'Sample description',
    category: 'Uncategorized',
    stock: 0,
    numReviews: 0,
    status: 'draft'
  });

  // Support direct creation with body data
  if (Object.keys(req.body).length > 0) {
      Object.assign(product, req.body);
      if(!product.slug) product.slug = product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
  }

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { title, price, description, image, images, category, categoryId, stock, status, variants, tags, sku, comparePrice, slug } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.title = title || product.title;
    product.price = price !== undefined ? price : product.price;
    product.comparePrice = comparePrice !== undefined ? comparePrice : product.comparePrice;
    product.description = description || product.description;
    product.image = image || product.image;
    product.images = images || product.images;
    product.category = category || product.category;
    product.categoryId = categoryId || product.categoryId;
    product.stock = stock !== undefined ? stock : product.stock;
    product.status = status || product.status;
    product.variants = variants || product.variants;
    product.tags = tags || product.tags;
    product.sku = sku || product.sku;
    if (slug) product.slug = slug;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

export { getProducts, getProductById, createProduct, updateProduct, deleteProduct };