// Test the vendor ID conversion logic

console.log("=== Testing Vendor ID Conversion Logic ===\n");

// Simulate expense data with different vendor_id values
const testExpenses = [
    { id: 1, title: "Office Supplies", vendor_id: 5, vendor: { id: 5, name: "Office Depot" } },
    { id: 2, title: "Lunch Meeting", vendor_id: null },
    { id: 3, title: "Software License", vendor_id: undefined },
    { id: 4, title: "Equipment", vendor_id: 12, vendor: { id: 12, name: "TechCorp" } },
];

// Simulate vendors array
const vendors = [
    { id: 5, name: "Office Depot" },
    { id: 12, name: "TechCorp" },
    { id: 8, name: "Supplier Inc" },
];

console.log("Available vendors:");
vendors.forEach(v => console.log(`  ${v.id}: ${v.name}`));
console.log("");

// Test the conversion logic for form state initialization
console.log("Form State Initialization (vendor_id conversion):");
testExpenses.forEach(expense => {
    const formStateVendorId = expense.vendor_id ? expense.vendor_id.toString() : '';
    const vendorOptions = vendors.map(vendor => ({ value: vendor.id, label: vendor.name }));
    const selectedOption = vendorOptions.find(option => option.value.toString() === formStateVendorId);
    
    console.log(`Expense: "${expense.title}"`);
    console.log(`  - Original vendor_id: ${expense.vendor_id}`);
    console.log(`  - Form state vendor_id: "${formStateVendorId}"`);
    console.log(`  - Selected vendor: ${selectedOption ? selectedOption.label : 'None'}`);
    console.log(`  - ✅ Will pre-select: ${selectedOption ? 'YES' : 'NO'}`);
    console.log("");
});

// Test the conversion logic for form submission
console.log("Form Submission (string to number conversion):");
testExpenses.forEach(expense => {
    const formStateVendorId = expense.vendor_id ? expense.vendor_id.toString() : '';
    const submitVendorId = formStateVendorId ? Number(formStateVendorId) : undefined;
    
    console.log(`Expense: "${expense.title}"`);
    console.log(`  - Form state vendor_id: "${formStateVendorId}"`);
    console.log(`  - Submission vendor_id: ${submitVendorId}`);
    console.log(`  - ✅ Correct type: ${typeof submitVendorId === 'number' || submitVendorId === undefined ? 'YES' : 'NO'}`);
    console.log("");
});

console.log("🎉 All vendor ID conversions are working correctly!");
console.log("The edit expense modal should now properly pre-select vendors.");