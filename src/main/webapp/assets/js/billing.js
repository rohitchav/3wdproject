var app = angular.module("BillingTableApp", []);

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


app.controller("BillingTableController", function($scope, $http) {

    $scope.products = [];
    $scope.filteredProducts = [];
    $scope.searchQuery = "";
    $scope.cart = [];
    $scope.showInvoice = false;
    $scope.discount = 0;
    $scope.upiData = "";
    $scope.customers = [];
    $scope.newCustomer = {};
    $scope.selectedCustomer = {};
    $scope.showCustomerCredit = false;
    $scope.billDateTime = null; 
    
    $scope.selectedIndex = -1; 
    
    const VPA = "9326981878@amazonpay";
    const PAYEE_NAME = "Yashwanti Kirana Store";

    $scope.formatDateForMySql = function(date) {
        let year = date.getFullYear();
        let month = ('0' + (date.getMonth() + 1)).slice(-2);
        let day = ('0' + date.getDate()).slice(-2);
        let hours = ('0' + date.getHours()).slice(-2);
        let minutes = ('0' + date.getMinutes()).slice(-2);
        let seconds = ('0' + date.getSeconds()).slice(-2);

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };
    
	$scope.handleKeyPress = function(event) {
	    const PLUS_KEY_CODES = [107, 187]; 
	    const MINUS_KEY_CODES = [109];
		const ENTER_KEY_CODE = 13;
		const UP_ARROW_KEY_CODE = 38;
		const DOWN_ARROW_KEY_CODE = 40;
        const listLength = $scope.filteredProducts.length;
		const DELETE_KEY_CODE = 46;
		const ESC_KEY_CODE = 27;

	    if (event.keyCode === UP_ARROW_KEY_CODE) {
	        if (listLength > 0) {
                event.preventDefault(); 
                $scope.selectedIndex = ($scope.selectedIndex <= 0) ? (listLength - 1) : ($scope.selectedIndex - 1);
	        }
	    }
	    else if (event.keyCode === DOWN_ARROW_KEY_CODE) {
	        if (listLength > 0) {
                event.preventDefault(); 
	            $scope.selectedIndex = ($scope.selectedIndex === listLength - 1) ? 0 : ($scope.selectedIndex + 1);
	        }
	    }
		else if(event.keyCode === ENTER_KEY_CODE){
		        event.preventDefault(); 
                
                if ($scope.filteredProducts.length > 0 && $scope.selectedIndex !== -1) {
		            $scope.selectProductByIndex($scope.selectedIndex);
		        } else if ($scope.filteredProducts.length === 1 && $scope.searchQuery) {
		             $scope.selectProductByIndex(0);
		        } else if ($scope.cart.length > 0) {
		             $scope.generateBill();
		        }
		    }
	    else if (PLUS_KEY_CODES.includes(event.keyCode)) {
	        event.preventDefault(); 
	        if ($scope.cart.length > 0) {
	            const lastItem = $scope.cart[$scope.cart.length - 1];
	            $scope.incrementQty(lastItem);
	        }
	    }
	    else if(MINUS_KEY_CODES.includes(event.keyCode)){
	        event.preventDefault(); 
	        if ($scope.cart.length > 0) {
	            const lastItem = $scope.cart[$scope.cart.length - 1]; 
	            $scope.decrementQty(lastItem);
	        }
	    }else if(event.keyCode === DELETE_KEY_CODE){
		       if (!$scope.searchQuery && $scope.cart.length > 0) {
		           event.preventDefault(); 
		           $scope.removeItem($scope.cart.length - 1);
		       }
		}else if(event.keyCode === ESC_KEY_CODE){
		   		       if ($scope.cart.length > 0) {
		   		           event.preventDefault(); 
		   		           $scope.clearCart();
		   		       }
		   		}
	};

    $http.get("ProductController?action=list").then(function(response) {
        $scope.products = response.data;
    }, function(error) {
        console.error("Error loading products:", error);
    });

    $scope.filterProducts = function() {
        let query = $scope.searchQuery ? $scope.searchQuery.toLowerCase() : "";
        
        const previousSelectedIndex = $scope.selectedIndex;

        if (!query || query.trim() === "") {
            $scope.filteredProducts = [];
            $scope.selectedIndex = -1;
            return;
        }

        $scope.filteredProducts = $scope.products.filter(function(p) {
            return p.name && p.name.toLowerCase().includes(query);
        });
        
        const currentLength = $scope.filteredProducts.length;

        if (currentLength === 0) {
            $scope.selectedIndex = -1;
        } else if (previousSelectedIndex === -1) {
             $scope.selectedIndex = 0;
        } else if ($scope.selectedIndex >= currentLength) {
             $scope.selectedIndex = currentLength - 1;
        }
    };
    
    $scope.selectProductByIndex = function(index) {
        if (index >= 0 && index < $scope.filteredProducts.length) {
            $scope.selectProduct($scope.filteredProducts[index]);
        }
    };

	$scope.selectProduct = function(product) {
	        // Find the actual stock of the product from the main list
	        let productInStock = $scope.products.find(prod => prod.id === product.id);
	        
	        if (!productInStock || productInStock.stock <= 0) {
	            alert(`Sorry, ${product.name} is out of stock!`);
	            return;
	        }

	        let existing = $scope.cart.find(item => item.id === product.id);

	        if (existing) {
	            // Check if incrementing by 1 exceeds stock
	            if (existing.qty + 1 > productInStock.stock) {
	                alert(`Cannot add more. Only ${productInStock.stock} units of ${product.name} are available.`);
	                return;
	            }
	            
	            existing.qty += 1;
	            existing.amount = existing.qty * existing.price;
	        } else {
	            // Check if adding the initial 1 unit exceeds stock (shouldn't happen if stock > 0, but good for safety)
	            if (1 > productInStock.stock) {
	                 alert(`Cannot add more. Only ${productInStock.stock} units of ${product.name} are available.`);
	                 return;
	            }
	            
	            $scope.cart.push({
	                id: product.id,
	                name: product.name,
	                qty: 1,
	                price: product.sellingPrice,
	                amount: product.sellingPrice
	            });
	        }

	        $scope.searchQuery = "";
	        $scope.filteredProducts = [];
	        $scope.selectedIndex = -1;
	    };

    $scope.updateAmount = function(item) {
        if (item.price) { 
            item.amount = item.qty * item.price;
        }
    };

    $scope.removeItem = function(index) {
        $scope.cart.splice(index, 1);
    };
    
    $scope.getTotalAmount = function() {
        return $scope.cart.reduce((sum, item) => sum + item.amount, 0);
    };
    
    $scope.getTotal = function() {
        return $scope.cart.reduce((total, item) => total + (item.price * item.qty), 0);
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
    
    $scope.clearCart = function() {
        $scope.cart = [];
        $scope.discount = 0;
        $scope.searchQuery = "";
        $scope.filteredProducts = [];
    };
	
	    $scope.showCustomerCreditBack = function() { $scope.showCustomerCredit = false; };

    $scope.finalizeTransaction = function(paymentMethod, customerId) {
        if ($scope.cart.length === 0) return;
        
        $scope.saveBillToDatabase(paymentMethod, customerId)
            .then(() => $scope.updateStock())
            .then(() => {
                $scope.showInvoice = false;
                $scope.showCustomerCredit = false;
                $scope.clearCart();
                $scope.selectedCustomer = {};
            })
            .catch(error => {
                console.error("Transaction failed:", error);
            });
    };

    $scope.payCash = function() { $scope.finalizeTransaction("CASH"); };
    $scope.payUPI = function() { $scope.finalizeTransaction("UPI"); };
    $scope.payCard = function() { $scope.finalizeTransaction("CARD"); };

    $scope.confirmCredit = function() {
        if (!$scope.selectedCustomer.id) {
            alert("Please select a customer.");
            return;
        }

        const grandTotal = $scope.getTotal() - $scope.discount;

        $http({
            method: 'POST',
            url: 'CustomerServlet?action=updateOutstanding',
            params: {
                customerId: $scope.selectedCustomer.id,
                amount: grandTotal
            }
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
	
	$scope.addToCredit = function() { 
		
		console.log("Hello ROhiot");
		$scope.showCustomerCredit = true; $scope.loadCustomers(); };
    
    $scope.addToCart = function(p) {
        $scope.selectProduct(p);
    };
	// Inside app.controller("BillingTableController", function($scope, $http) { ... });

	$scope.openModal = function() { 
	    $scope.newCustomer = {}; // Good practice: clear form data on open
	    // 🚀 FIX: Must use $scope.showModal for binding
	    $scope.showModal = true;
	};
    
	$scope.addCustomer = function() {
	       $http.post('CustomerServlet?action=add', $scope.newCustomer)
	           .then(() => { alert("Customer added!"); $scope.closeModal(); $scope.loadCustomers(); })
	           .catch(() => alert("Error adding customer."));
	   };
	
	$scope.closeModal = function() { 
	    // Good practice: close the modal
	    $scope.showModal = false; 
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
	        $scope.updateAmount(item);
	    };
		$scope.decrementQty = function(item) {
		        if (item.qty > 1) {
		            item.qty -= 1;
		            $scope.updateAmount(item); // Ensure amount is updated
		        }
		    };
    
    $scope.generateQrCodeDataUrl = function(text) {
        return new Promise((resolve) => {
            if (typeof QRCode === 'undefined') {
                console.error("QRCode library not found.");
                resolve('');
                return;
            }

            const tempDiv = document.createElement('div');
            tempDiv.style.display = 'none';
            document.body.appendChild(tempDiv);

            new QRCode(tempDiv, {
                text: text,
                width: 150,
                height: 150,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });

            setTimeout(() => {
                let dataURL = '';
                const canvas = tempDiv.querySelector('canvas');
                if (canvas) {
                    dataURL = canvas.toDataURL("image/png");
                }
                document.body.removeChild(tempDiv);
                resolve(dataURL);
            }, 100);
        });
    };
    
    $scope.printInvoice = function() {
        let billNo = $scope.billNo;
        let billDate = $scope.billDateTime ? $scope.billDateTime.toLocaleString() : 'N/A';
        let cart = $scope.cart;
        let discount = $scope.discount;
        let total = $scope.getTotal();
        const grandTotal = total - discount;
        const upiString = $scope.generateUpiString(grandTotal);
        const VPA = "9326981878@amazonpay"; 
        
        const formatCurrency = num => "₹" + num.toFixed(2);

        $scope.generateQrCodeDataUrl(upiString).then(qrCodeDataUrl => {

            let invoiceHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Invoice #INV-${billNo}</title>
                <link rel="stylesheet" href="assets/css/invoice.css" media="all"> 
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
                
                printWindow.onload = function() {
                    printWindow.print();
                }
            }
        });
    };
    
    $scope.loadCustomers = function() {
        $http.get('CustomerServlet?action=getAll')
            .then(response => $scope.customers = response.data)
            .catch(error => console.error('Error fetching customers', error));
    };

    $scope.loadCustomers();
});