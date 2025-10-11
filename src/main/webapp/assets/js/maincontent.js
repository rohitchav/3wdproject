/******************************************************
 * Billing Application - Organized Version
 * Author: Rohit Hanumant Chavan
 * Description: AngularJS-based POS billing app
 ******************************************************/

// ====================================================
// MODULE INITIALIZATION
// ====================================================
var app = angular.module("BillingApp", []);

// ====================================================
// QR CODE DIRECTIVE
// ====================================================
app.directive('qrCode', function() {
    return {
        restrict: 'E',
        scope: { data: '=' },
        link: function(scope, element) {
            let qr = null;

            scope.$watch('data', function(newVal) {
                if (newVal) {
                    element.empty();

                    if (typeof QRCode === 'undefined') {
                        console.error("QRCode library missing. Include: <script src='https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js'></script>");
                        return;
                    }

                    qr = new QRCode(element[0], {
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

// ====================================================
// MAIN CONTROLLER
// ====================================================
app.controller("BillingController", function($scope, $http) {

    // ------------------------------------------------
    // BASIC VARIABLES & CONSTANTS
    // ------------------------------------------------
    $scope.products = [];
    $scope.cart = [];
    $scope.customers = [];
    $scope.showInvoice = false;
    $scope.discount = 5;
    $scope.upiData = "";
    $scope.newCustomer = {};
    $scope.selectedCustomer = {};
    $scope.showCustomerCredit = false;

    const VPA = "9326981878@amazonpay";
    const PAYEE_NAME = "Yashwanti Kirana Store";

    console.log("BillingController initialized");

    // ------------------------------------------------
    // UPI PAYMENT GENERATION
    // ------------------------------------------------
    $scope.generateUpiString = function(amount) {
        const grandTotal = amount;
        const nameEncoded = encodeURIComponent(PAYEE_NAME);
        return `upi://pay?pa=${VPA}&pn=${nameEncoded}&am=${grandTotal.toFixed(2)}&cu=INR`;
    };

    // ------------------------------------------------
    // BILL NUMBER GENERATOR (LOCAL STORAGE BASED)
    // ------------------------------------------------
    $scope.getNextBillNo = function() {
        let lastNo = localStorage.getItem('lastBillNumber');
        let currentNo = (lastNo === null) ? 1 : (parseInt(lastNo) + 1);
        localStorage.setItem('lastBillNumber', currentNo);
        return currentNo;
    };

    // ====================================================
    // PRODUCTS MANAGEMENT
    // ====================================================
    $scope.loadProducts = function() {
        $http.get("ProductController?action=list")
            .then(function(response) {
                $scope.products = response.data;
            })
            .catch(function(error) {
                console.error("Error loading products:", error);
            });
    };

    $scope.addToCart = function(product) {
        let existing = $scope.cart.find(item => item.id === product.id);
        if (existing) {
            existing.qty += 1;
        } else {
            $scope.cart.push({
                id: product.id,
                name: product.name,
                price: product.sellingPrice,
                image: product.imagePath,
                qty: 1
            });
        }
    };
	
	$scope.updateStock = function() {
	    if ($scope.cart.length === 0) return; // nothing to update

	    // Prepare data to send
	    let stockUpdateList = $scope.cart.map(item => ({
	        id: item.id,
	        qty: item.qty
	    }));

	    console.log("Stock Update List:", stockUpdateList);

	    // POST request
	    $http({
	        method: 'POST',
	        url: 'ProductController?action=updateStock',
	        data: stockUpdateList,
	        headers: { 'Content-Type': 'application/json' }
	    })
	    .then(response => {
	        if (response.data.status === "success") {
	            console.log("Stock updated successfully:", response.data);

	            // 1️⃣ Update stock locally for immediate UI feedback
	            stockUpdateList.forEach(update => {
	                let prod = $scope.products.find(p => p.id === update.id);
	                if (prod) prod.stock -= update.qty;
	            });

	            // 2️⃣ Clear cart
	            $scope.clearCart();

	            // 3️⃣ Optionally reload full product list after a short delay
	            // setTimeout(() => { $scope.loadProducts(); }, 100);

	        } else {
	            console.error("Stock update failed:", response.data);
	            alert("Failed to update stock!");
	        }
	    })
	    .catch(error => {
	        console.error("Error updating stock:", error);
	        alert("Error updating stock!");
	    });
	};

    $scope.removeFromCart = function(item) {
        let index = $scope.cart.indexOf(item);
        if (index !== -1) $scope.cart.splice(index, 1);
    };

    $scope.incrementQty = item => item.qty++;
    $scope.decrementQty = item => { if (item.qty > 1) item.qty--; };

    $scope.getTotal = function() {
        return $scope.cart.reduce((total, item) => total + (item.price * item.qty), 0);
    };

    $scope.clearCart = function() {
        $scope.cart = [];
    };

    // ====================================================
    // BILL GENERATION & DATABASE SAVE
    // ====================================================
    $scope.generateBill = function() {
        $scope.billNo = $scope.getNextBillNo();
        $scope.billDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        $scope.showInvoice = true;

        const grandTotal = $scope.getTotal() - $scope.discount;
        $scope.upiData = $scope.generateUpiString(grandTotal);
    };

    $scope.saveBillToDatabase = function(paymentMethod) {
        const billData = {
            billNo: $scope.billNo,
            billDate: $scope.billDate,
            subtotal: $scope.getTotal(),
            discount: $scope.discount,
            grandTotal: $scope.getTotal() - $scope.discount,
            paymentMethod: paymentMethod,
            items: $scope.cart.map(item => ({
                productId: item.id,
                productName: item.name,
                qty: item.qty,
                price: item.price,
                totalPrice: item.price * item.qty
            }))
        };

        $http.post("BillingController?action=save", billData)
            .then(() => alert("Bill Saved"))
            .catch(error => console.error("Error saving bill:", error));
    };

    $scope.closeInvoice = () => { $scope.showInvoice = false; };

    // ====================================================
    // PAYMENT METHODS
    // ====================================================
    $scope.payCash = function() {
        $scope.saveBillToDatabase("CASH");
		$scope.updateStock();
        $scope.showInvoice = false;
		$scope.closeModal();
    };

    $scope.payUPI = function() {
        $scope.saveBillToDatabase("UPI");
		$scope.updateStock();
		$scope.clearCart();
        $scope.showInvoice = false;
		$scope.closeModal();
    };

    $scope.payCard = function() {
        $scope.saveBillToDatabase("CARD");
		$scope.updateStock();
		$scope.clearCart();
        $scope.showInvoice = false;
		$scope.closeModal();
    };

    // ====================================================
    // CUSTOMER MANAGEMENT
    // ====================================================
    $scope.loadCustomers = function() {
        $http.get('CustomerServlet?action=getAll')
            .then(function(response) {
                $scope.customers = response.data;
                console.log($scope.customers);
            })
            .catch(error => console.error('Error fetching customers', error));
    };

    $scope.addCustomer = function() {
        console.log("Customer Added:", $scope.newCustomer);

        $http.post('CustomerServlet?action=add', $scope.newCustomer)
            .then(function(response) {
                alert("Customer added successfully!");
                $scope.closeModal();
                $scope.loadCustomers();
            })
            .catch(function(error) {
                console.error("Error adding customer:", error);
                alert("Error while adding customer.");
            });
    };

    $scope.openModal = function() {
        $scope.newCustomer = {};
        $scope.showModal = true;
    };

    $scope.closeModal = function() {
        $scope.showModal = false;
    };

    // ====================================================
    // CUSTOMER CREDIT HANDLING
    // ====================================================
    $scope.addToCredit = function() {
        $scope.showCustomerCredit = true;
        $scope.loadCustomers();
    };

    $scope.showCustomerCreditBack = function() {
        $scope.showCustomerCredit = false;
    };

    $scope.confirmCredit = function() {
        const grandTotal = $scope.getTotal() - $scope.discount;
        console.log("Selected Customer ID:", $scope.selectedCustomer.id);

        $http({
            method: 'POST',
            url: 'CustomerServlet?action=updateOutstanding',
            params: {
                customerId: $scope.selectedCustomer.id,
                amount: grandTotal
            }
        }).then(function(response) {
            if (response.data.status === "success") {
                let selectedCustomer = $scope.customers.find(c => c.id === $scope.selectedCustomer.id);
                alert("Credit assigned successfully to " + (selectedCustomer ? selectedCustomer.name : 'customer'));
                $scope.showCustomerCredit = false;
                $scope.showInvoice = false;
                $scope.clearCart();
                $scope.selectedCustomer.id = null;
            } else {
                alert("Failed to update outstanding balance.");
            }
        }).catch(function(error) {
            console.error("Error:", error);
            alert("Something went wrong!");
        });
    };

    // ====================================================
    // INVOICE PRINTING
    // ====================================================
    const generateQrCodeBase64 = function(text) {
        if (typeof QRCode === 'undefined') return '';

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
        if (canvas) dataURL = canvas.toDataURL("image/png");

        document.body.removeChild(tempDiv);
        return dataURL;
    };

    $scope.printInvoice = function() {
        let billNo = $scope.billNo;
        let billDate = $scope.billDate;
        let cart = $scope.cart;
        let discount = $scope.discount;
        let total = $scope.getTotal();
        const grandTotal = total - discount;
        const upiString = $scope.generateUpiString(grandTotal);
        const qrCodeDataUrl = generateQrCodeBase64(upiString);

        const formatCurrency = num => "₹" + num.toFixed(2);

        // HTML structure for printable invoice
        let invoiceHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Invoice #INV-${billNo}</title>
                <style>
                    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 10pt; margin: 0; padding: 0; }
                    .container { width: 90%; max-width: 800px; margin: 20px auto; padding: 20px; box-sizing: border-box; }
                    .company-name { font-size: 1.8em; text-align: center; color: #2c3e50; }
                    .invoice-title { font-size: 1.2em; text-align: center; color: #34495e; border-bottom: 1px solid #bdc3c7; padding-bottom: 5px; margin-bottom: 20px; }
                    .invoice-details { display: flex; justify-content: space-between; margin-bottom: 20px; }
                    .invoice-details strong { color: #34495e; }
                    table { width: 100%; border-collapse: collapse; font-size: 1em; }
                    th, td { padding: 10px 15px; border-bottom: 1px solid #ecf0f1; }
                    th { background-color: #3498db; color: white; text-align: left; }
                    td.numeric { text-align: right; }
                    .payment-layout { display: flex; justify-content: space-between; align-items: flex-start; margin-top: 30px; }
                    .qr-section-print { width: 45%; text-align: center; padding: 10px; border: 1px dashed #bdc3c7; }
                    .qr-section-print img { width: 150px; height: 150px; margin: 10px auto; display: block; }
                    .totals-container { width: 50%; padding: 10px; border: 1px solid #bdc3c7; background-color: #fdfefe; }
                    .totals-container p { display: flex; justify-content: space-between; margin: 8px 0; }
                    .grand-total { border-top: 2px solid #3498db; margin-top: 10px; padding-top: 10px; }
                    .footer { text-align: center; margin-top: 60px; font-size: 0.9em; color: #7f8c8d; font-style: italic; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1 class="company-name">Kirana Store</h1>
                    <h2 class="invoice-title">Invoice</h2>
                    <div class="invoice-details">
                        <p><strong>Bill No:</strong> ${billNo}</p>
                        <p><strong>Date:</strong> ${billDate}</p>
                    </div>
                    <table>
                        <thead>
                            <tr><th>Item</th><th class="numeric">Qty</th><th class="numeric">Price</th><th class="numeric">Total</th></tr>
                        </thead>
                        <tbody>
                            ${cart.map(item => `
                                <tr>
                                    <td>${item.name}</td>
                                    <td class="numeric">${item.qty}</td>
                                    <td class="numeric">${formatCurrency(item.price)}</td>
                                    <td class="numeric">${formatCurrency(item.price * item.qty)}</td>
                                </tr>`).join('')}
                        </tbody>
                    </table>
                    <div class="payment-layout">
                        <div class="qr-section-print">
                            <strong>Scan to Pay (UPI)</strong>
                            <img src="${qrCodeDataUrl}" alt="UPI QR Code">
                            <p>Amount: ${formatCurrency(grandTotal)}</p>
                            <p style="font-size: 0.8em;">VPA: ${VPA}</p>
                        </div>
                        <div class="totals-container">
                            <p><span>Subtotal:</span><span>${formatCurrency(total)}</span></p>
                            <p><span>Discount:</span><span>- ${formatCurrency(discount)}</span></p>
                            <p class="grand-total"><strong><span>Grand Total:</span></strong><span>${formatCurrency(grandTotal)}</span></p>
                        </div>
                    </div>
                    <div class="footer">Thank you for shopping with us! Please come again.</div>
                </div>
            </body>
            </html>`;

        // Open printable window
        let printWindow = window.open('', '', 'height=1000,width=1200');
        if (printWindow) {
            printWindow.document.write(invoiceHtml);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
        }
    };

    // INITIAL DATA LOAD
    $scope.loadProducts();
});
