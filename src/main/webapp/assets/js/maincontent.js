var app = angular.module("BillingApp", []);

app.directive('qrCode', function() {
    return {
        restrict: 'E',
        scope: {
            data: '='
        },
        link: function(scope, element, attrs) {
            scope.$watch('data', function(newVal) {
                if (newVal) {
                    element.empty();
                    
                    if (typeof QRCode === 'undefined') {
                        console.error("QRCode library not found. Please ensure <script src='https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js'></script> is included.");
                        return;
                    }

                    new QRCode(element[0], {
                        text: newVal,
                        width: 150,
                        height: 150,
                        colorDark: "#000000",
                        colorLight: "#ffffff",
                        correctLevel: QRCode.CorrectLevel.H
                    });
                }
            });
        }
    };
});


app.controller("BillingController", function($scope, $http) {

    $scope.products = [];
    $scope.cart = [];
    $scope.showInvoice = false;
    $scope.discount = 0;
    $scope.upiData = "";
    $scope.customers = [];
    $scope.newCustomer = {};
    $scope.selectedCustomer = {};
    $scope.showCustomerCredit = false;
    // New variable to hold the Date object for locale display
    $scope.billDateTime = null; 

    const VPA = "9326981878@amazonpay";
    const PAYEE_NAME = "Yashwanti Kirana Store";

    console.log("BillingController initialized");

    // 🛑 NEW: Helper function to format date for MySQL
    $scope.formatDateForMySql = function(date) {
        let year = date.getFullYear();
        let month = ('0' + (date.getMonth() + 1)).slice(-2);
        let day = ('0' + date.getDate()).slice(-2);
        let hours = ('0' + date.getHours()).slice(-2);
        let minutes = ('0' + date.getMinutes()).slice(-2);
        let seconds = ('0' + date.getSeconds()).slice(-2);

        // MySQL/SQL Standard Format: YYYY-MM-DD HH:MM:SS
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    $scope.generateUpiString = function(amount) {
        const grandTotal = amount;
        const nameEncoded = encodeURIComponent(PAYEE_NAME);
        
        let upiUri = `upi://pay?pa=${VPA}&pn=${nameEncoded}&am=${grandTotal.toFixed(2)}&cu=INR`;
        return upiUri;
    };


    $scope.getNextBillNo = function() {
        let lastNo = localStorage.getItem('lastBillNumber');
        let currentNo = (lastNo === null) ? 1 : (parseInt(lastNo) + 1);

        localStorage.setItem('lastBillNumber', currentNo);
        
        return currentNo;
    };


    $scope.loadProducts = function() {
        $http.get("ProductController?action=list")
            .then(function(response) {
                $scope.products = response.data;
            })
            .catch(function(error) {
                console.error("Error loading products:", error);
            });
    };

    // 🛑 FIX: Added 'id' and 'amount' property
    $scope.addToCart = function(p) {
        let existing = $scope.cart.find(item => item.id === p.id); 
        if (existing) {
            existing.qty += 1;
            existing.amount = existing.qty * existing.price;
        } else {
            $scope.cart.push({
                id: p.id,
                name: p.name,
                price: p.sellingPrice,
                image: p.imagePath,
                qty: 1,
                amount: p.sellingPrice
            });
        }
    };

    $scope.removeFromCart = function(item) {
        let index = $scope.cart.indexOf(item);
        if (index !== -1) {
            $scope.cart.splice(index, 1);
        }
    };

    $scope.incrementQty = function(item) {
        item.qty += 1;
        item.amount = item.qty * item.price; 
    };

    $scope.decrementQty = function(item) {
        if (item.qty > 1) {
            item.qty -= 1;
            item.amount = item.qty * item.price;
        }
    };

    $scope.getTotal = function() {
        return $scope.cart.reduce((total, item) => total + (item.price * item.qty), 0);
    };

    $scope.clearCart = function() {
        $scope.cart = [];
    };
    
    // 🔹 UPDATE STOCK AFTER BILL (Made promise-based for clean flow)
    $scope.updateStock = function() {
        if ($scope.cart.length === 0) return Promise.resolve();
        let stockUpdateList = $scope.cart.map(item => ({ id: item.id, qty: item.qty }));
        
        return $http({
            method: 'POST',
            url: 'ProductController?action=updateStock',
            data: stockUpdateList,
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            // 🛑 FIX: Parse response data to handle potential string return
            let data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
            
            if (data.status === "success") {
                stockUpdateList.forEach(update => {
                    let prod = $scope.products.find(p => p.id === update.id);
                    if (prod) prod.stock -= update.qty;
                });
                return Promise.resolve();
            } else {
                alert("Failed to update stock! Bill was saved, but inventory needs manual adjustment.");
                return Promise.reject(new Error("Stock update failed"));
            }
        }).catch(error => {
             console.error("Error updating stock:", error);
             alert("Error updating stock!");
             return Promise.reject(error);
        });
    };

    $scope.generateBill = function() {
        $scope.billNo = $scope.getNextBillNo();
        
        // 🛑 FIX: Store Date object for print/UI, and MySQL format for DB
        const now = new Date();
        $scope.billDateTime = now; 
        $scope.billDate = $scope.formatDateForMySql(now); // DB format
        
        $scope.showInvoice = true;
        
        const grandTotal = $scope.getTotal() - $scope.discount;
        $scope.upiData = $scope.generateUpiString(grandTotal);
    };

    $scope.closeInvoice = function() {
        $scope.showInvoice = false;
    };

    const formatCurrency = (num) => {
        return "₹" + num.toFixed(2);
    };
    
    // SAVE BILL TO DATABASE (Made promise-based for clean flow)
    $scope.saveBillToDatabase = function(paymentMethod, customerId) {
        const billData = {
            billNo: $scope.billNo,
            billDate: $scope.billDate, // ✅ This is now YYYY-MM-DD HH:MM:SS
            subtotal: $scope.getTotal(),
            discount: $scope.discount,
            grandTotal: $scope.getTotal() - $scope.discount,
            paymentMethod: paymentMethod,
            customerId: customerId || null,
            items: $scope.cart.map(item => ({
                productId: item.id,
                productName: item.name,
                qty: item.qty,
                price: item.price,
                totalPrice: item.price * item.qty
            }))
        };
        
        return $http.post("BillingController?action=save", billData)
            .then(() => {
                alert("Bill Saved to Database");
                return Promise.resolve();
            })
            .catch(error => {
                console.error("Error saving bill:", error);
                alert("Error saving bill to database!");
                return Promise.reject(error);
            });
    };

    // 🔹 MODIFIED PAYMENT FLOW: Use promises to sequence Save, Stock Update, and UI Clear
    $scope.finalizeTransaction = function(paymentMethod, customerId) {
        if ($scope.cart.length === 0) return;
        
        // 1. Save Bill -> 2. Update Stock -> 3. Clear UI
        $scope.saveBillToDatabase(paymentMethod, customerId)
            .then(() => $scope.updateStock())
            .then(() => {
                $scope.showInvoice = false;
                $scope.showCustomerCredit = false;
                $scope.clearCart();
                $scope.selectedCustomer = {};
                $scope.closeModal();
            })
            .catch(error => {
                console.error("Transaction failed:", error);
            });
    };
    
    // Payment functions now use the new finalizeTransaction
    $scope.payCash = function() { $scope.finalizeTransaction("CASH"); };
    $scope.payUPI = function() { $scope.finalizeTransaction("UPI"); };
    $scope.payCard = function() { $scope.finalizeTransaction("CARD"); };

    // CUSTOMER MANAGEMENT
    $scope.loadCustomers = function() {
        $http.get('CustomerServlet?action=getAll')
            .then(response => $scope.customers = response.data)
            .catch(error => console.error('Error fetching customers', error));
    };
    $scope.addCustomer = function() {
        $http.post('CustomerServlet?action=add', $scope.newCustomer)
            .then(() => { alert("Customer added!"); $scope.closeModal(); $scope.loadCustomers(); })
            .catch(() => alert("Error adding customer."));
    };
    $scope.openModal = function() { $scope.newCustomer = {}; $scope.showModal = true; };
    $scope.closeModal = function() { $scope.showModal = false; };

    // CUSTOMER CREDIT
    $scope.addToCredit = function() { $scope.showCustomerCredit = true; $scope.loadCustomers(); };
    $scope.showCustomerCreditBack = function() { $scope.showCustomerCredit = false; };
    
    // MODIFIED confirmCredit to use finalizeTransaction
    $scope.confirmCredit = function() {
        if (!$scope.selectedCustomer.id) {
            alert("Please select a customer.");
            return;
        }
        
        const grandTotal = $scope.getTotal() - $scope.discount;

        // 1. Update Customer Outstanding
        $http({
            method: 'POST',
            url: 'CustomerServlet?action=updateOutstanding',
            params: { customerId: $scope.selectedCustomer.id, amount: grandTotal }
        }).then(response => {
            let data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
            
            if (data.status === "success") {
                // 2. Finalize Transaction as CREDIT
                $scope.finalizeTransaction("CREDIT", $scope.selectedCustomer.id);
            } else {
                alert("Failed to update outstanding balance.");
            }
        }).catch(error => {
            console.error("HTTP request failed:", error);
            alert("Something went wrong!");
        });
    };

    const generateQrCodeBase64 = function(text) {
        if (typeof QRCode === 'undefined') { return ''; }

        const tempDiv = document.createElement('div');
        tempDiv.style.display = 'none';
        document.body.appendChild(tempDiv);

        const qr = new QRCode(tempDiv, {
            text: text,
            width: 150,
            height: 150,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });

        let dataURL = '';
        const canvas = tempDiv.querySelector('canvas');
        if (canvas) {
             dataURL = canvas.toDataURL("image/png");
        }
        
        document.body.removeChild(tempDiv);
        
        return dataURL;
    };

	$scope.printInvoice = function() {
	    let billNo = $scope.billNo;
	    let billDate = $scope.billDateTime ? $scope.billDateTime.toLocaleString() : 'N/A'; // Use locale string for print
	    let cart = $scope.cart;
	    let discount = $scope.discount;
	    let total = $scope.getTotal();
        const grandTotal = total - discount;
        const upiString = $scope.generateUpiString(grandTotal);
        const qrCodeDataUrl = generateQrCodeBase64(upiString);

	    const formatCurrency = num => "₹" + num.toFixed(2);

		let invoiceHtml = `
		    <!DOCTYPE html>
		    <html>
		    <head>
		        <meta charset="UTF-8">
		        <title>Invoice #INV-${billNo}</title>
		        <style>
		            /* ... (your print styles) ... */
                    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 10pt; margin: 0; padding: 0; color: #333; }
                    .container { width: 90%; max-width: 800px; margin: 20px auto; padding: 20px; box-sizing: border-box; }
                    .company-name { font-size: 1.8em; text-align: center; margin-bottom: 5px; color: #2c3e50; }
                    .invoice-title { font-size: 1.2em; text-align: center; margin-bottom: 20px; color: #34495e; border-bottom: 1px solid #bdc3c7; padding-bottom: 5px; }
                    .invoice-details { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 1em; }
                    .invoice-details p { margin: 2px 0; }
                    .invoice-details strong { font-weight: 600; color: #34495e; }
                    table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 1em; }
                    th, td { padding: 10px 15px; border-bottom: 1px solid #ecf0f1; }
                    th { background-color: #3498db; color: white; text-align: left; font-weight: 600; }
                    td { text-align: left; }
                    td.numeric { text-align: right; }
                    .payment-layout { display: flex; justify-content: space-between; align-items: flex-start; margin-top: 30px; }
                    .qr-section-print { width: 45%; text-align: center; padding: 15px; border: 1px dashed #bdc3c7; border-radius: 8px; background-color: #f7f9fb; }
                    .qr-section-print strong { color: #2c3e50; font-size: 1.1em; display: block; margin-bottom: 5px; }
                    .qr-section-print img { width: 150px; height: 150px; margin: 10px auto; display: block; }
                    .totals-container { width: 50%; padding: 15px; border: 1px solid #bdc3c7; border-radius: 8px; background-color: #fdfefe; }
                    .totals-container p { display: flex; justify-content: space-between; margin: 8px 0; font-weight: normal; font-size: 1.1em; }
                    .totals-container strong { font-weight: bold; color: #2c3e50; }
                    .grand-total { margin-top: 10px !important; padding-top: 10px; border-top: 2px solid #3498db; }
                    .grand-total span:last-child { font-size: 1.4em; color: #0d6efd; font-weight: 900; }
                    .clear { clear: both; }
                    .footer { text-align: center; margin-top: 60px; font-size: 0.9em; color: #7f8c8d; font-style: italic; }
		        </style>
		    </head>
		    <body>
		        <div class="container">
		            <h1 class="company-name">Kirana Store</h1>
		            <h2 class="invoice-title">Invoice</h2>
		            
		            <div class="invoice-details">
		                <p><strong>Bill No:</strong>Invoice No: ${billNo}</p>
		                <p><strong>Date:</strong> ${billDate}</p>
		            </div>
		            
		            <table>
		                <thead>
		                    <tr>
		                        <th>Item</th>
		                        <th class="numeric">Qty</th>
		                        <th class="numeric">Price</th>
		                        <th class="numeric">Total</th>
		                    </tr>
		                </thead>
		                <tbody>
		                    ${cart.map(item => `
		                        <tr>
		                            <td>${item.name}</td>
		                            <td class="numeric">${item.qty}</td>
		                            <td class="numeric">${formatCurrency(item.price)}</td>
		                            <td class="numeric">${formatCurrency(item.price * item.qty)}</td>
		                        </tr>
		                    `).join('')}
		                </tbody>
		            </table>

                    <div class="payment-layout">
                        <div class="qr-section-print">
                            <strong>Scan to Pay (UPI)</strong>
                            <img src="${qrCodeDataUrl}" alt="UPI QR Code" onerror="this.style.display='none'">
                            <p>Amount: ${formatCurrency(grandTotal)}</p>
                            <p style="font-size: 0.8em; margin-top: 10px;">VPA: ${VPA}</p>
                        </div>

                        <div class="totals-container">
                            <p><span>Subtotal:</span> <span>${formatCurrency(total)}</span></p>
                            <p><span>Discount:</span> <span>- ${formatCurrency(discount)}</span></p>
                            <p class="grand-total"><strong><span>Grand Total:</span></strong> <span>${formatCurrency(grandTotal)}</span></p>
                        </div>
                    </div>

		            <div class="clear"></div>

		            <div class="footer">
		                Thank you for shopping with us! Please come again.
		            </div>
		        </div>
		    </body>
		    </html>
		`;

		    let printWindow = window.open('', '', 'height=1000,width=1200');
		    if (printWindow) {
		        printWindow.document.write(invoiceHtml);
		        printWindow.document.close();
		        printWindow.focus();
		        printWindow.print();
		    }
	};

    $scope.loadProducts();
    $scope.loadCustomers();
});