var app = angular.module("BillingApp", []);

// --- 1. QR Code Directive ---
// This directive renders the QR code using the qrcode.js library.
// The user MUST include the qrcode.js library in the main HTML file.
app.directive('qrCode', function() {
    return {
        restrict: 'E', // Use as <qr-code> element
        scope: {
            // Bind the 'data' attribute (which holds the UPI string)
            data: '=' 
        },
        link: function(scope, element, attrs) {
            let qr = null;

            // Watch for changes in the data variable (the UPI string)
            scope.$watch('data', function(newVal) {
                if (newVal) {
                    // Clear previous content
                    element.empty(); 
                    
                    if (typeof QRCode === 'undefined') {
                        console.error("QRCode library not found. Please ensure <script src='https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js'></script> is included.");
                        return;
                    }

                    // Initialize the QR Code generator 
                    // element[0] is the native DOM element where QR code is rendered
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
    $scope.discount = 5; // Assuming a flat discount of 5
    $scope.upiData = ""; // Holds the generated UPI string for the QR directive

    // --- UPI Configuration ---
    const VPA = "YashwantiKirana@upi"; // ⚠️ REPLACE with YOUR actual VPA
    const PAYEE_NAME = "Yashwanti Kirana Store";

    // Helper to generate the UPI string
    $scope.generateUpiString = function(amount) {
        const grandTotal = amount; 
        const nameEncoded = encodeURIComponent(PAYEE_NAME);
        
        // UPI URI format: upi://pay?pa=VPA&pn=PayeeName&am=Amount&cu=CurrencyCode
        let upiUri = `upi://pay?pa=${VPA}&pn=${nameEncoded}&am=${grandTotal.toFixed(2)}&cu=INR`;
        return upiUri;
    };
    // --- End UPI Configuration ---


    // --- Sequential Bill Numbering Logic ---
    $scope.getNextBillNo = function() {
        // Retrieve the last bill number, default to 0 if not found.
        let lastNo = localStorage.getItem('lastBillNumber');
        let currentNo = (lastNo === null) ? 1 : (parseInt(lastNo) + 1);

        // Store the new number for the NEXT bill
        localStorage.setItem('lastBillNumber', currentNo);
        
        return currentNo;
    };


    console.log("BillingController initialized");

    // Load product list
    $scope.loadProducts = function() {
        $http.get("ProductController?action=list")
            .then(function(response) {
                $scope.products = response.data;
           
            })
            .catch(function(error) {
                console.error("Error loading products:", error);
            });
    };

    // ... (Your existing $scope.addToCart, removeFromCart, incrementQty, decrementQty, getTotal, clearCart) ...

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

    // --- Core Billing Functions ---

	$scope.generateBill = function() {
	    // Use sequential numbering starting from 1
	    $scope.billNo = $scope.getNextBillNo(); 
	    $scope.billDate = new Date().toLocaleString();
	    $scope.showInvoice = true; 
	    
        // Calculate the grand total
        const grandTotal = $scope.getTotal() - $scope.discount;
        
        // Generate UPI string and set it for the QR directive
        $scope.upiData = $scope.generateUpiString(grandTotal); 
	};

	$scope.closeInvoice = function() {
	    $scope.showInvoice = false; 
	};

	// Helper function to format numbers as currency
	const formatCurrency = (num) => {
	    return "₹" + num.toFixed(2);
	};

    // --- Payment Functions (Alerts replaced with console.log) ---
	$scope.payCash = function() { console.log("Transaction recorded: Paid in Cash!"); };
	$scope.payUPI = function() { console.log("Transaction recorded: Paid by UPI!"); };
	$scope.payCard = function() { console.log("Transaction recorded: Paid by Card!"); };
	$scope.addToCredit = function() { console.log("Transaction recorded: Added to Credit!"); };
    // --- End Payment Functions ---


    // --- QR Code Generator for Print (Non-Angular environment) ---
    // This is needed because the Angular directive does not run inside the new print window.
    const generateQrCodeBase64 = function(text) {
        if (typeof QRCode === 'undefined') {
            return ''; 
        }

        // 1. Create a temporary, hidden DOM element
        const tempDiv = document.createElement('div');
        tempDiv.style.display = 'none';
        document.body.appendChild(tempDiv);

        // 2. Initialize QR Code generator
        const qr = new QRCode(tempDiv, {
            text: text,
            width: 150,
            height: 150,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });

        // 3. Extract the Base64 data from the generated canvas element
        // NOTE: A small delay might sometimes be necessary in complex rendering environments, 
        // but often the data is ready immediately after initialization with qrcode.js.
        let dataURL = '';
        const canvas = tempDiv.querySelector('canvas');
        if (canvas) {
            dataURL = canvas.toDataURL("image/png");
        }
        
        // 4. Clean up the temporary element
        document.body.removeChild(tempDiv);
        
        return dataURL;
    };
    // --- End QR Code Generator for Print ---


    // --- Print Invoice Logic ---
	$scope.printInvoice = function() {
	    let billNo = $scope.billNo;
	    let billDate = $scope.billDate;
	    let cart = $scope.cart;
	    let discount = $scope.discount;
	    let total = $scope.getTotal();
        const grandTotal = total - discount; // Calculate Grand Total
        const upiString = $scope.generateUpiString(grandTotal);
        const qrCodeDataUrl = generateQrCodeBase64(upiString); // Generate QR for print

	    const formatCurrency = num => "₹" + num.toFixed(2);

	    // Generate HTML for invoice
		let invoiceHtml = `
		    <!DOCTYPE html>
		    <html>
		    <head>
		        <meta charset="UTF-8">
		        <title>Invoice #INV-${billNo}</title>
		        <style>
		            /* Global Styles & Reset */
		            body { 
		                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
		                font-size: 10pt; 
		                margin: 0;
		                padding: 0;
		            }
		            .container {
		                width: 90%; 
		                max-width: 800px; 
		                margin: 20px auto;
		                padding: 20px;
		                box-sizing: border-box; 
		            }

		            /* Header */
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
		            }
		            .invoice-details p {
		                margin: 2px 0;
		                font-size: 1em;
		            }
		            .invoice-details strong {
		                font-weight: 600;
		                color: #34495e;
		            }

		            /* Table Styles */
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

                    /* Payment/Totals Layout */
                    .payment-layout {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        margin-top: 30px;
                    }
                    .qr-section-print {
                        width: 45%; 
                        text-align: center;
                        padding: 10px;
                        border: 1px dashed #bdc3c7;
                    }
                    .qr-section-print img {
                        width: 150px;
                        height: 150px;
                        margin: 10px auto;
                        display: block;
                    }


		            /* Totals Section */
		            .totals-container { 
		                width: 50%; /* Adjusted width for print layout */
                        padding: 10px; 
                        border: 1px solid #bdc3c7; 
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
		                font-size: 1.2em;
		                color: #2c3e50;
		            }

		            /* Footer */
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
                        <!-- QR Code Section for Print -->
                        <div class="qr-section-print">
                            <strong>Scan to Pay (UPI)</strong>
                            <img src="${qrCodeDataUrl}" alt="UPI QR Code" onerror="this.style.display='none'">
                            <p>Amount: ${formatCurrency(grandTotal)}</p>
                            <p style="font-size: 0.8em; margin-top: 10px;">VPA: ${VPA}</p>
                        </div>

                        <!-- Totals Container -->
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
		        // Removed printWindow.close() to allow the user to click Save/Print
		    }
	};


    $scope.loadProducts();
});
