const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ===== Middleware =====
app.use(cors());
app.use(express.json());
app.use(express.static(".")); // يخلي index.html يشتغل من السيرفر


// ===== تخزين الطلبات مؤقتاً =====
// لو الكلام اتطور نحطها في MongoDB
const orders = [];


// ===== Routes =====

// GET - تأكد إن السيرفر شغال
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});


// POST - استقبال الطلب
app.post("/order", (req, res) => {
    const { name, phone, city, address, variant, date } = req.body;

    // Validation في السيرفر كمان
    if (!name || !phone || !city || !address) {
        return res.status(400).json({
            success: false,
            message: "بيانات ناقصة"
        });
    }

    // احفظ الطلب
    const newOrder = {
        id: orders.length + 1,
        name,
        phone,
        city,
        address,
        variant,
        date,
        createdAt: new Date()
    };

    orders.push(newOrder);

    console.log("✅ طلب جديد:", newOrder);

    // رد على الفرونت
    res.status(201).json({
        success: true,
        message: "تم استقبال الطلبك",
        orderId: newOrder.id
    });
});


// GET - مشاهدة الطلبات كلها (للتيست)
app.get("/orders", (req, res) => {
    res.json({
        total: orders.length,
        orders
    });
});


// ===== Start Server =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 السيرفر شغال على http://localhost:${PORT}`);
});