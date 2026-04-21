const fetch = globalThis.fetch || require('node-fetch');

(async () => {
  try {
    const dataUri = 'data:image/png;base64,' + 'A'.repeat(5000); // ~5KB
    const body = {
      item_name: 'Test Small Image',
      description: 'Testing small base64 payload',
      item_image: dataUri,
      category: 'Test',
      item_condition: 'new',
      brand: 'TestBrand',
      colour: 'Clear',
      listing_type: 'sell',
      availability_status: 'available',
      price: 10.5,
      quantity: 1,
      payment_details: {
        bank_name: 'bank america',
        branch: 'pannala',
        account_name: 'tharushi nethmini',
        account_number: '68768898798890'
      }
    };

    const res = await fetch('http://localhost:5000/api/items/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Response:', data);
  } catch (err) {
    console.error('Request error:', err);
  }
})();
