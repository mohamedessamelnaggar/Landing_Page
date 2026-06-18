// ===== اختيار الشكل =====
let selectedVariant = "أحمر"; // الافتراضي

const variantBtns = document.querySelectorAll(".variant-btn");

variantBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        // شيل active من الكل
        variantBtns.forEach(b => b.classList.remove("active"));
        // حط active على اللي اتضغط
        btn.classList.add("active");
        // احفظ الاختيار
        selectedVariant = btn.dataset.value;
    });
});


// ===== Validation =====
function validateForm(name, phone, city, address) {
    if (!name || name.length < 3) {
        alert("من فضلك اكتب اسمك كامل");
        return false;
    }
    if (!phone || phone.length < 10) {
        alert("من فضلك اكتب رقم تليفون صحيح");
        return false;
    }
    if (!city) {
        alert("من فضلك اختار المحافظة");
        return false;
    }
    if (!address || address.length < 5) {
        alert("من فضلك اكتب العنوان بالتفصيل");
        return false;
    }
    return true;
}


// ===== Submit Order =====
async function submitOrder() {

    // جمع البيانات
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const city = document.getElementById("city").value;
    const address = document.getElementById("address").value.trim();

    // Validation
    if (!validateForm(name, phone, city, address)) return;

    // غير شكل الزرار
    const btn = document.getElementById("submit-btn");
    btn.textContent = "جاري الإرسال...";
    btn.disabled = true;

    // البيانات اللي هنبعتها للسيرفر
    const orderData = {
        name,
        phone,
        city,
        address,
        variant: selectedVariant,
        date: new Date().toLocaleString("ar-EG")
    };

    try {
        // ابعت للسيرفر
        const response = await fetch("/order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData)
        });

        const result = await response.json();

        if (result.success) {
            // افتح واتساب
            openWhatsApp(orderData);
        }

    } catch (error) {
        alert("حصل خطأ، حاول تاني");
        btn.textContent = "📲 إرسال الطلب على واتساب";
        btn.disabled = false;
    }
}


function openWhatsApp(order) {
    const message =
        `🛍️ طلب جديد!
──────────────
👤 الاسم: ${order.name}
📱 التليفون: ${order.phone}
🎨 الشكل: ${order.variant}
🏙️ المحافظة: ${order.city}
📍 العنوان: ${order.address}
🕐 الوقت: ${order.date}
──────────────
شكراً لطلبك! ✅`;

    const whatsappNumber = "201000000000";
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");

    // ✅ صلحنا الـ success message وزودنا زرار طلب جديد
    document.querySelector(".form-section").innerHTML = `
    <div style="text-align:center; padding:40px 20px">
      <div style="font-size:60px">✅</div>
      <h2 style="color:#25D366; margin:15px 0 10px">تم إرسال طلبك!</h2>
      <p style="color:#666; margin-bottom:25px">هيتواصل معاك في أقرب وقت</p>
      <button 
        onclick="location.reload()" 
        style="
          background:#25D366; 
          color:white; 
          border:none; 
          padding:15px 40px; 
          border-radius:10px; 
          font-size:1rem;
          font-weight:bold;
          cursor:pointer;
        ">
        🔄 طلب جديد
      </button>
    </div>
  `;
}