/******************************************************
 * Billing Application - Organized Version
 * Author: Rohit Hanumant Chavan
 * Description: AngularJS-based POS billing app
 ******************************************************/

var app = angular.module("BillingApp", []);

// ====================================================
// QR CODE DIRECTIVE
// ====================================================
app.directive('qrCode', function() {
    return {
        restrict: 'E',
        scope: { data: '=' },
        link: function(scope, element) {
            scope.$watch('data', function(newVal) {
                if (newVal) {
                    element.empty();
                    if (typeof QRCode === 'undefined') {
                        console.error("QRCode library missing.");
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

// ====================================================
// MAIN CONTROLLER
// ====================================================
app.controller("BillingController", function($scope, $http) {

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

    // UPI PAYMENT STRING
    $scope.generateUpiString = function(amount) {
        const nameEncoded = encodeURIComponent(PAYEE_NAME);
        return `upi://pay?pa=${VPA}&pn=${nameEncoded}&am=${amount.toFixed(2)}&cu=INR`;
    };

    // BILL NUMBER GENERATOR
    $scope.getNextBillNo = function() {
        let lastNo = localStorage.getItem('lastBillNumber');
        let currentNo = (lastNo === null) ? 1 : (parseInt(lastNo) + 1);
        localStorage.setItem('lastBillNumber', currentNo);
        return currentNo;
    };

    // LOAD PRODUCTS
    $scope.loadProducts = function() {
        $http.get("ProductController?action=list")
            .then(response => $scope.products = response.data)
            .catch(error => console.error("Error loading products:", error));
    };

    // ADD TO CART WITH STOCK VALIDATION
    $scope.addToCart = function(product) {
        let existing = $scope.cart.find(item => item.id === product.id);
        if (existing) {
            if (existing.qty < product.stock) {
                existing.qty += 1;
                $scope.updateTotal(existing);
            } else alert("Cannot add more than available stock (" + product.stock + ")");
        } else {
            if (product.stock > 0) {
                $scope.cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.sellingPrice,
                    image: product.imagePath,
                    qty: 1,
                    stock: product.stock,
                    total: product.sellingPrice
                });
            } else alert("Product out of stock!");
        }
    };

    // CART QUANTITY INCREMENT
    $scope.increaseQty = function(item) {
        if (item.qty < item.stock) {
            item.qty += 1;
            $scope.updateTotal(item);
        } else alert("Cannot exceed available stock (" + item.stock + ")");
    };

    // CART QUANTITY DECREMENT
    $scope.decreaseQty = function(item) {
        if (item.qty > 1) {
            item.qty -= 1;
            $scope.updateTotal(item);
        }
    };

    // UPDATE ITEM TOTAL
    $scope.updateTotal = function(item) {
        item.total = item.qty * item.price;
    };

    // REMOVE FROM CART
    $scope.removeFromCart = function(item) {
        let index = $scope.cart.indexOf(item);
        if (index !== -1) $scope.cart.splice(index, 1);
    };

    // GET CART GRAND TOTAL
    $scope.getTotal = function() {
        return $scope.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    };

    // CLEAR CART
    $scope.clearCart = function() { $scope.cart = []; };

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

    // BILL GENERATION
    $scope.generateBill = function() {
        $scope.billNo = $scope.getNextBillNo();
        $scope.billDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        $scope.showInvoice = true;
        $scope.upiData = $scope.generateUpiString($scope.getTotal() - $scope.discount);
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

    $scope.closeInvoice = () => { $scope.showInvoice = false; };

    // PAYMENT HANDLERS
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

    // INITIAL DATA LOAD
    $scope.loadProducts();
});
