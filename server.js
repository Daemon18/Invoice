
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = 5000;


mongoose.connect("mongodb://127.0.0.1:27017/invoice")
.then(()=>console.log("MongoDb Connected"))
.catch((err)=>console.log(err));

app.use(cors());  
app.use(express.json());  


const invoiceSchema = new mongoose.Schema({
  clientName: String,
  clientEmail: String,
  items: [
    {
      description: String,
      quantity: Number,
      price: Number,
    }
  ],
  taxRate: Number,
});

// const Invoice = mongoose.model('Invoice', invoiceSchema);
const Invoice = mongoose.model('Invoice', invoiceSchema, 'Invoice');



app.post('/create-invoice', async (req, res) => {
  const invoiceData = req.body;  

  try {
   
    const newInvoice = new Invoice(invoiceData);
    await newInvoice.save();

    res.status(200).json({ message: 'Invoice successfully submitted', invoice: newInvoice });
  } catch (error) {
    console.error('Error saving invoice:', error);
    res.status(500).json({ message: 'Error saving invoice' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
