export function debugCart(subdomain: string) {
  if (typeof window === 'undefined') {
    console.log('🚫 Not in browser environment');
    return;
  }

  const cartKey = `cart_${subdomain}`;
  const savedCart = localStorage.getItem(cartKey);
  
  console.log('🔍 Cart Debug Info:');
  console.log('- Subdomain:', subdomain);
  console.log('- Cart Key:', cartKey);
  console.log('- Raw localStorage value:', savedCart);
  
  if (savedCart) {
    try {
      const parsed = JSON.parse(savedCart);
      console.log('- Parsed cart data:', parsed);
      console.log('- Items count:', Array.isArray(parsed) ? parsed.length : 'Not an array');
    } catch (error) {
      console.error('- Parse error:', error);
    }
  } else {
    console.log('- No cart data found');
  }

  // List all localStorage keys for debugging
  console.log('- All localStorage keys:', Object.keys(localStorage));
}

// Helper to add debug button to window for testing
if (typeof window !== 'undefined') {
  (window as any).debugCart = debugCart;
  console.log('🛠️ Debug function available: window.debugCart("subdomain")');
}