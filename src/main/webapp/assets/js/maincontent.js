var app = angular.module("BillingApp", []);

app.directive('qrCode', function() {
    return {
        restrict: 'E',
        scope: {
            data: '=' 
        },
        link: function(scope, element, attrs) {
            let qr = null;

            scope.$watch('data', function(newVal) {
                if (newVal) {
                    element.empty(); 
                    
                    if (typeof QRCode === 'undefined') {
                        console.error("QRCode library not found. Please ensure <script src='https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js'></script> is included.");
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

    const VPA = "9326981878@amazonpay";
    const PAYEE_NAME = "Yashwanti Kirana Store";

    console.log("BillingController initialized");

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

    $scope.addToCart = function(p) {
        let existing = $scope.cart.find(item => item.name === p.name);
        if (existing) {
            existing.qty += 1;
        } else {
            $scope.cart.push({
                name: p.name,
                price: p.sellingPrice,
                image: p.imagePath,
                qty: 1
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
    };

    $scope.decrementQty = function(item) {
        if (item.qty > 1) {
            item.qty -= 1;
        }
    };

    $scope.getTotal = function() {
        return $scope.cart.reduce((total, item) => total + (item.price * item.qty), 0);
    };

    $scope.clearCart = function() {
        $scope.cart = [];
    };

    // UPDATE STOCK AFTER BILL
    $scope.updateStock = function() {
        if ($scope.cart.length === 0) return;
        let stockUpdateList = $scope.cart.map(item => ({ id: item.id, qty: item.qty }));
        $http({
            method: 'POST',
            url: 'ProductController?action=updateStock',
            data: stockUpdateList,
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            if (response.data.status === "success") {
                stockUpdateList.forEach(update => {
                    let prod = $scope.products.find(p => p.id === update.id);
                    if (prod) prod.stock -= update.qty;
                });
                $scope.clearCart();
            } else alert("Failed to update stock!");
        }).catch(() => alert("Error updating stock!"));
    };

	$scope.generateBill = function() {
	    $scope.billNo = $scope.getNextBillNo(); 
	    $scope.billDate = new Date().toLocaleString();
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
    
    // SAVE BILL TO DATABASE
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

	$scope.payCash = function() { $scope.saveBillToDatabase("CASH"); $scope.updateStock(); $scope.showInvoice = false; $scope.closeModal(); };
	$scope.payUPI = function() { $scope.saveBillToDatabase("UPI"); $scope.updateStock(); $scope.clearCart(); $scope.showInvoice = false; $scope.closeModal(); };
	$scope.payCard = function() { $scope.saveBillToDatabase("CARD"); $scope.updateStock(); $scope.clearCart(); $scope.showInvoice = false; $scope.closeModal(); };

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
    $scope.confirmCredit = function() {
        const grandTotal = $scope.getTotal() - $scope.discount;
        $http({
            method: 'POST',
            url: 'CustomerServlet?action=updateOutstanding',
            params: { customerId: $scope.selectedCustomer.id, amount: grandTotal }
        }).then(response => {
            if (response.data.status === "success") {
                let selectedCustomer = $scope.customers.find(c => c.id === $scope.selectedCustomer.id);
                alert("Credit assigned to " + (selectedCustomer ? selectedCustomer.name : 'customer'));
                $scope.showCustomerCredit = false;
                $scope.showInvoice = false;
                $scope.updateStock();
                $scope.clearCart();
                $scope.selectedCustomer.id = null;
            } else alert("Failed to update outstanding balance.");
        }).catch(() => alert("Something went wrong!"));
    };


    const generateQrCodeBase64 = function(text) {
        if (typeof QRCode === 'undefined') {
            return ''; 
        }

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
	    let billDate = $scope.billDate;
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
		            /* RESET & BASE STYLES */
		            body { 
		                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
		                font-size: 10pt; 
		                margin: 0;
		                padding: 0;
		                color: #333;
		            }
		            .container {
		                width: 90%; 
		                max-width: 800px; 
		                margin: 20px auto;
		                padding: 20px;
		                box-sizing: border-box; 
		            }

		            /* HEADER */
		            .company-name {
		                font-size: 1.8em;
		                text-align: center;
		                margin-bottom: 5px;
		                color: #2c3e50; 
		            }
		            .invoice-title {
		                font-size: 1.2em;
		                text-align: center;
		                margin-bottom: 20px;
		                color: #34495e;
		                border-bottom: 1px solid #bdc3c7; 
		                padding-bottom: 5px;
		            }
		            .invoice-details {
		                display: flex; 
		                justify-content: space-between;
		                margin-bottom: 20px;
		                font-size: 1em;
		            }
		            .invoice-details p {
		                margin: 2px 0;
		            }
		            .invoice-details strong {
		                font-weight: 600;
		                color: #34495e;
		            }

		            /* TABLE STYLES */
		            table { 
		                width: 100%; 
		                border-collapse: collapse; 
		                margin-top: 15px; 
		                font-size: 1em;
		            }
		            th, td { 
		                padding: 10px 15px; 
		                border-bottom: 1px solid #ecf0f1; 
		            }
		            th { 
		                background-color: #3498db; 
		                color: white; 
		                text-align: left; 
		                font-weight: 600;
		            }
		            td {
		                text-align: left;
		            }
		            td.numeric { 
		                text-align: right; 
		            }

                    /* PAYMENT & TOTALS LAYOUT */
                    .payment-layout {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        margin-top: 30px;
                    }
                    
                    /* QR SECTION */
                    .qr-section-print {
                        width: 45%; 
                        text-align: center;
                        padding: 15px;
                        border: 1px dashed #bdc3c7;
                        border-radius: 8px;
                        background-color: #f7f9fb;
                    }
                    .qr-section-print strong {
                        color: #2c3e50;
                        font-size: 1.1em;
                        display: block;
                        margin-bottom: 5px;
                    }
                    .qr-section-print img {
                        width: 150px;
                        height: 150px;
                        margin: 10px auto;
                        display: block;
                    }


		            /* TOTALS SECTION */
		            .totals-container { 
		                width: 50%; 
                        padding: 15px; 
                        border: 1px solid #bdc3c7; 
                        border-radius: 8px;
                        background-color: #fdfefe;
		            }
		            .totals-container p { 
		                display: flex;
		                justify-content: space-between;
		                margin: 8px 0; 
		                font-weight: normal; 
		                font-size: 1.1em;
		            }
		            .totals-container strong {
		                font-weight: bold;
		                color: #2c3e50;
		            }
		            .grand-total {
		                margin-top: 10px !important;
		                padding-top: 10px;
		                border-top: 2px solid #3498db; 
		            }
		            .grand-total span:last-child {
		                font-size: 1.4em; /* Slightly larger for emphasis */
		                color: #0d6efd; /* Blue emphasis */
		                font-weight: 900;
		            }

		            /* FOOTER */
		            .clear { clear: both; }
		            .footer { 
		                text-align: center; 
		                margin-top: 60px; 
		                font-size: 0.9em; 
		                color: #7f8c8d; 
		                font-style: italic; 
		            }
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
