import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function InvoiceGenerator() {
  const [invoice, setInvoice] = useState({
    clientName: '',
    clientEmail: '',
    items: [{ description: '', quantity: 1, price: 0 }],
    taxRate: 0,
  });

  const handleChange = (e, index, field) => {
    if (field === 'items') {
      const updatedItems = [...invoice.items];
      updatedItems[index][e.target.name] = e.target.value;
      setInvoice({ ...invoice, items: updatedItems });
    } else {
      setInvoice({ ...invoice, [e.target.name]: e.target.value });
    }
  };

  const addItem = () => {
    setInvoice({
      ...invoice,
      items: [...invoice.items, { description: '', quantity: 1, price: 0 }],
    });
  };

  const calculateTotal = () => {
    const subtotal = invoice.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
    const tax = (subtotal * invoice.taxRate) / 100;
    return subtotal + tax;
  };

  const submitInvoice = async () => {
    try {
      const response = await fetch('http://localhost:5000/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoice),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Invoice submitted:', data);
      } else {
        console.error('Error submitting invoice:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting invoice:', error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h1 className="text-center mb-4">Invoice Generator</h1>

        <div className="mb-3">
          <input
            type="text"
            name="clientName"
            placeholder="Client Name"
            value={invoice.clientName}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <input
            type="email"
            name="clientEmail"
            placeholder="Client Email"
            value={invoice.clientEmail}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        {invoice.items.map((item, index) => (
          <div key={index} className="row g-3 align-items-center mb-2">
            <div className="col-md-5">
              <input
                type="text"
                name="description"
                placeholder="Item Description"
                value={item.description}
                onChange={(e) => handleChange(e, index, 'items')}
                className="form-control"
              />
            </div>
            <div className="col-md-3">
              <input
                type="number"
                name="quantity"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) => handleChange(e, index, 'items')}
                className="form-control"
              />
            </div>
            <div className="col-md-3">
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={item.price}
                onChange={(e) => handleChange(e, index, 'items')}
                className="form-control"
              />
            </div>
            <div className="col-md-1">
              <button onClick={addItem} className="btn btn-primary">+</button>
            </div>
          </div>
        ))}

        <div className="mb-3">
          <input
            type="number"
            name="taxRate"
            placeholder="Tax Rate (%)"
            value={invoice.taxRate}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <h2 className="text-center">Total: ₹{calculateTotal().toFixed(2)}</h2>

        <button onClick={submitInvoice} className="btn btn-success w-100 mt-3">Submit Invoice</button>
      </div>
    </div>
  );
}
