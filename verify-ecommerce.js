const http = require('http');

const PORT = 3000;
const HOST = 'localhost';

const TEST_USER = {
  name: 'Ecommerce Tester',
  email: `ecom${Date.now()}@example.com`,
  password: 'password123'
};

let token = '';
let userId = '';
let productId = '';

function request(method, path, data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: HOST,
      port: PORT,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const json = body ? JSON.parse(body) : {};
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (e) => reject(e));

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🚀 Starting E-commerce Functionality Verification (Native HTTP)...\n');

  try {
    // 1. Register User
    console.log('1️⃣  Registering User...');
    const regRes = await request('POST', '/api/auth/register', TEST_USER);
    if (regRes.status === 201) {
      token = regRes.data.token;
      userId = regRes.data.user.id;
      console.log('✅ Registered successfully. Token:', token.substring(0, 15) + '...');
    } else {
      throw new Error(`Registration failed: ${JSON.stringify(regRes.data)}`);
    }

    // 2. Create Product
    console.log('\n2️⃣  Creating Test Product...');
    const prodRes = await request('POST', '/products', {
      title: 'Test Product',
      description: 'A great product',
      price: 99.99,
      stock: 10,
      imageUrl: 'http://example.com/image.png'
    });
    if (prodRes.status === 201) {
      productId = prodRes.data._id;
      console.log('✅ Product created. ID:', productId);
    } else {
      throw new Error(`Product creation failed: ${JSON.stringify(prodRes.data)}`);
    }

    // 3. Add to Cart
    console.log('\n3️⃣  Testing Add to Cart...');
    const cartRes = await request('POST', '/api/cart', { productId, quantity: 2 }, { 'Authorization': `Bearer ${token}` });
    if (cartRes.status === 200 && cartRes.data.items.length > 0) {
      console.log('✅ Added to cart. Items:', cartRes.data.items.length);
    } else {
      throw new Error(`Add to cart failed: ${JSON.stringify(cartRes.data)}`);
    }

    // 4. Get Cart
    console.log('\n4️⃣  Testing Get Cart...');
    const getCartRes = await request('GET', '/api/cart', null, { 'Authorization': `Bearer ${token}` });
    if (getCartRes.status === 200 && getCartRes.data.items[0].product._id === productId) {
        console.log('✅ Cart retrieved correctly. Product Title:', getCartRes.data.items[0].product.title);
    } else {
        throw new Error(`Get cart failed: ${JSON.stringify(getCartRes.data)}`);
    }

    // 5. Add to Wishlist
    console.log('\n5️⃣  Testing Add to Wishlist...');
    const wishRes = await request('POST', '/api/wishlist', { productId }, { 'Authorization': `Bearer ${token}` });
    if (wishRes.status === 200 && wishRes.data.products.length > 0) {
      console.log('✅ Added to wishlist. Products:', wishRes.data.products.length);
    } else {
      throw new Error(`Add to wishlist failed: ${JSON.stringify(wishRes.data)}`);
    }

    // 6. Remove from Cart
    console.log('\n6️⃣  Testing Remove from Cart...');
    const delCartRes = await request('DELETE', `/api/cart/${productId}`, null, { 'Authorization': `Bearer ${token}` });
    if (delCartRes.status === 200 && delCartRes.data.items.length === 0) {
      console.log('✅ Removed from cart. Items remaining:', delCartRes.data.items.length);
    } else {
      throw new Error(`Remove from cart failed: ${JSON.stringify(delCartRes.data)}`);
    }

    console.log('\n🎉 All E-commerce Tests Passed!');

  } catch (err) {
    console.error('\n❌ Test Failed:', err.message);
    if (err.code === 'ECONNREFUSED') {
      console.error('⚠️  Server is not running on port 3000. Please start the server.');
    }
  }
}

runTests();
