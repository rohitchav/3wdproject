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
    
    // 🛑 NEW: Search and Filter models
    $scope.searchQuery = "";
    $scope.categoryFilter = ""; // Empty string means select "all" in the filter function
    
    $scope.showInvoice = false;
    $scope.discount = 0;
    $scope.upiData = "";
    $scope.customers = [];
    $scope.newCustomer = {};
    $scope.selectedCustomer = {};
    $scope.showCustomerCredit = false;
    $scope.billDateTime = null; 

    const VPA = "9326981878@amazonpay";
    const PAYEE_NAME = "Yashwanti Kirana Store";

    console.log("BillingController initialized");

    $scope.formatDateForMySql = function(date) {
        let year = date.getFullYear();
        let month = ('0' + (date.getMonth() + 1)).slice(-2);
        let day = ('0' + date.getDate()).slice(-2);
        let hours = ('0' + date.getHours()).slice(-2);
        let minutes = ('0' + date.getMinutes()).slice(-2);
        let seconds = ('0' + date.getSeconds()).slice(-2);

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

    // 🛑 NEW: Custom filter logic applied by ng-repeat
    $scope.searchFilter = function(product) {
        let matchesSearch = true;
        let matchesCategory = true;
        
        // 1. Text Search Filter (by product name)
        if ($scope.searchQuery) {
            let query = $scope.searchQuery.toLowerCase();
            if (product.name && product.name.toLowerCase().indexOf(query) === -1) {
                matchesSearch = false;
            }
        }
        
        // 2. Category Filter (by select dropdown)
        if ($scope.categoryFilter && $scope.categoryFilter !== "") {
            if (product.category !== $scope.categoryFilter) {
                matchesCategory = false;
            }
        }
        
        return matchesSearch && matchesCategory;
    };


	$scope.addToCart = function(p) {
	        // Find the product's actual stock from the $scope.products array
	        let productInStock = $scope.products.find(prod => prod.id === p.id);
	        if (!productInStock || productInStock.stock <= 0) {
	            alert(`Sorry, ${p.name} is out of stock!`);
	            return;
	        }

	        let existing = $scope.cart.find(item => item.id === p.id);
	        
	        if (existing) {
	            // Check if incrementing by 1 exceeds stock
	            if (existing.qty + 1 > productInStock.stock) {
	                alert(`Cannot add more. Only ${productInStock.stock} units of ${p.name} are available.`);
	                return;
	            }
	            existing.qty += 1;
	            existing.amount = existing.qty * existing.price;
	        } else {
	            // Adding a new item, quantity is 1, which is already checked above (stock > 0)
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
	        // Find the product's actual stock from the $scope.products array
	        let productInStock = $scope.products.find(prod => prod.id === item.id);

	        if (!productInStock) {
	            console.error("Product not found in stock list for increment:", item.name);
	            return;
	        }
	        
	        // Check if the increment will exceed the stock
	        if (item.qty + 1 > productInStock.stock) {
	            alert(`Cannot add more. Only ${productInStock.stock} units of ${item.name} are available.`);
	            return;
	        }
	        
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
    
    $scope.updateStock = function() {
        if ($scope.cart.length === 0) return Promise.resolve();
        let stockUpdateList = $scope.cart.map(item => ({ id: item.id, qty: item.qty }));
        
        return $http({
            method: 'POST',
            url: 'ProductController?action=updateStock',
            data: stockUpdateList,
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {
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
        
        const now = new Date();
        $scope.billDateTime = now; 
        $scope.billDate = $scope.formatDateForMySql(now);
        
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
    
    $scope.saveBillToDatabase = function(paymentMethod, customerId) {
        const billData = {
            billNo: $scope.billNo,
            billDate: $scope.billDate,
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

    $scope.finalizeTransaction = function(paymentMethod, customerId) {
        if ($scope.cart.length === 0) return;
        
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
    
    $scope.payCash = function() { $scope.finalizeTransaction("CASH"); };
    $scope.payUPI = function() { $scope.finalizeTransaction("UPI"); };
    $scope.payCard = function() { $scope.finalizeTransaction("CARD"); };

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

    $scope.addToCredit = function() { $scope.showCustomerCredit = true; $scope.loadCustomers(); };
    $scope.showCustomerCreditBack = function() { $scope.showCustomerCredit = false; };
    
    $scope.confirmCredit = function() {
        if (!$scope.selectedCustomer.id) {
            alert("Please select a customer.");
            return;
        }
        
        const grandTotal = $scope.getTotal() - $scope.discount;

        $http({
            method: 'POST',
            url: 'CustomerServlet?action=updateOutstanding',
            params: { customerId: $scope.selectedCustomer.id, amount: grandTotal }
        }).then(response => {
            let data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
            
            if (data.status === "success") {
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
	    let billDate = $scope.billDateTime ? $scope.billDateTime.toLocaleString() : 'N/A';
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