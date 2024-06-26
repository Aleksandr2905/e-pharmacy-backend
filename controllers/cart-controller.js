import { ctrlWrapper } from "../decorators/index.js";
import HttpError from "../helpers/HttpError.js";
import sendEmail from "../helpers/sendEmail.js";
import Cart from "../models/Cart.js";
import Products from "../models/Products.js";
import User from "../models/User.js";

const getCartItems = async (req, res) => {
  const { _id: userId } = req.user;

  if (!userId) {
    throw HttpError(400, "User id is required");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw HttpError(404, "User not found");
  }

  let cart = await Cart.findOne({ userId }).populate({
    path: "products.productId",
    model: "product",
  });

  if (!cart) {
    cart = await Cart.create({ userId, products: [] });
    user.cart = cart._id;
    await user.save();
  }

  const cartProducts = cart && cart.products ? cart.products : [];

  let total = 0;
  for (const item of cartProducts) {
    const product = item.productId;
    if (!product) {
      continue;
    }
    total += product.price * item.quantity;
  }

  await Cart.findOneAndUpdate(
    { userId },
    { total: total.toFixed(2) },
    { new: true }
  );

  res.json({ cartProducts, total });
};

const updateCart = async (req, res) => {
  const { _id: userId } = req.user;

  if (!userId) {
    throw HttpError(400, "User id is required");
  }

  const { products } = req.body;
  if (!products || !Array.isArray(products)) {
    throw HttpError(400, "Products array is required");
  }

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    throw HttpError(404, "Cart not found");
  }

  if (products.length === 0) {
    cart = await Cart.findOneAndUpdate(
      { userId },
      { products: [], total: "0.00" },
      { new: true }
    );
    return res.status(200).json(cart);
  }

  let total = 0;
  const updatedProducts = [];

  for (const item of products) {
    const { productId, quantity } = item;
    const product = await Products.findById(productId);
    if (!product) {
      throw HttpError(404, `Product with id ${productId} not found`);
    }
    updatedProducts.push({ productId, quantity });
    total += product.price * quantity;
  }

  cart = await Cart.findOneAndUpdate(
    { userId },
    { products: updatedProducts, total: total.toFixed(2) },
    { new: true }
  );

  if (!cart) {
    throw HttpError(404, "Cart not found");
  }

  await User.findByIdAndUpdate(userId, { cart: cart._id }, { new: true });

  res.status(200).json(cart);
};

const cartCheckout = async (req, res) => {
  const { _id: userId } = req.user;
  const { username, email, phone, address, payment } = req.body;
  const result = await Cart.findOneAndUpdate(
    { userId },
    { username, email, phone, address, payment, isOrdered: true },
    { new: true }
  ).populate("products.productId");

  if (!result) {
    throw HttpError(404, "Cart not found");
  }

  const cartProducts = result.products.map((item) => ({
    name: item.productId.name,
    quantity: item.quantity,
    price: item.productId.price,
  }));

  const total = result.total;
  const orderDetails = cartProducts
    .map(
      (item) =>
        `<tr>
         <td>${item.name}</td>
         <td>${item.quantity}</td>
         <td>৳${item.price}</td>
       </tr>`
    )
    .join("");

  const emailText = `
    <p>Dear, ${username},</p>
    <p>Thank you for your order. Here are the details:</p>
    <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">
    <thead>
      <tr>
        <th>Product</th>
        <th>Quantity</th>
        <th>Price</th>
      </tr>
    </thead>
    <tbody>
      ${orderDetails}
    </tbody>
  </table>
    <p>TOTAL: ৳${total}</p>
    <p>We will contact you shortly to confirm your order.</p>
    <p>Best regards,<br>E-Pharmacy</p>
  `;

  await sendEmail({
    to: email,
    subject: "Your order confirmation E-Pharmacy",
    html: emailText,
  });

  res.status(200).json(result);
};

const addToCart = async (req, res) => {
  const { _id: userId } = req.user;
  const { productId, quantity } = req.body;

  if (!userId) {
    throw HttpError(400, "User id is required");
  }

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({
      userId,
      products: [{ productId, quantity }],
    });
  } else {
    const existingProduct = cart.products.find(
      (product) => product.productId.toString() === productId
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({
        productId,
        quantity,
      });
    }
  }

  await cart.save();

  res.status(200).json(cart);
};

const decreaseQuantity = async (req, res) => {
  const { _id: userId } = req.user;
  const { productId, quantity } = req.body;

  if (!userId) {
    throw HttpError(400, "User id is required");
  }

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({
      userId,
      products: [{ productId, quantity }],
    });
  } else {
    const existingProduct = cart.products.find(
      (product) => product.productId.toString() === productId
    );

    if (existingProduct.quantity === 1) {
      const updatedProducts = cart.products.filter(
        (product) => product.productId.toString() !== productId
      );
      cart.products = updatedProducts;
    } else {
      existingProduct.quantity -= 1;
    }
  }

  await cart.save();

  res.status(200).json(cart);
};

const deleteFromCart = async (req, res) => {
  const { _id: userId } = req.user;
  const { productId } = req.params;

  if (!userId) {
    throw HttpError(400, "User id is required");
  }

  if (!productId) {
    throw HttpError(400, "Product id is required");
  }

  let cart = await Cart.findOne({ userId });

  const searchedProduct = cart.products.find(
    (product) => product.productId.toString() === productId
  );

  if (!searchedProduct) {
    throw HttpError(404, "There is no product with this id in the cart");
  }

  const newProducts = cart.products.filter(
    (product) => product.productId.toString() !== productId
  );

  cart = await Cart.findOneAndUpdate(
    { userId },
    { products: newProducts },
    { new: true }
  );

  res.status(200).json(cart);
};

export default {
  getCartItems: ctrlWrapper(getCartItems),
  updateCart: ctrlWrapper(updateCart),
  cartCheckout: ctrlWrapper(cartCheckout),
  addToCart: ctrlWrapper(addToCart),
  decreaseQuantity: ctrlWrapper(decreaseQuantity),
  deleteFromCart: ctrlWrapper(deleteFromCart),
};
