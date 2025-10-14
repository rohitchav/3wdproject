package com.pos.kiranastore.util;

import javax.servlet.http.HttpServletRequest;

public class LanguageUtil {

	public static void setLanguageLabels(HttpServletRequest request, String lang) {
		boolean isEN = "EN".equalsIgnoreCase(lang);

		// Common Labels
		request.setAttribute("lblHead", isEN ? ConstantVariables.lblhead : ConstantVariables.lblhead_MR);
		request.setAttribute("lblBilling", isEN ? ConstantVariables.lblBilling : ConstantVariables.lblBilling_MR);
		request.setAttribute("lblCart", isEN ? ConstantVariables.lblCart : ConstantVariables.lblCart_MR);
		request.setAttribute("lblLogout", isEN ? ConstantVariables.lblLogout : ConstantVariables.lblLogout_MR);
		request.setAttribute("lblSearchPlaceholder",
				isEN ? ConstantVariables.lblSearchPlaceholder : ConstantVariables.lblSearchPlaceholder_MR);

		// Sidebar
		request.setAttribute("lblHome", isEN ? ConstantVariables.lblHome : ConstantVariables.lblHome_MR);
		request.setAttribute("lblDashboard", isEN ? ConstantVariables.lblDashboard : ConstantVariables.lblDashboard_MR);
		request.setAttribute("lblInventory", isEN ? ConstantVariables.lblInventory : ConstantVariables.lblInventory_MR);
		request.setAttribute("lblCustomers", isEN ? ConstantVariables.lblCustomers : ConstantVariables.lblCustomers_MR);
		request.setAttribute("lblDebts", isEN ? ConstantVariables.lblDebts : ConstantVariables.lblDebts_MR);
		request.setAttribute("lblPurchases", isEN ? ConstantVariables.lblPurchases : ConstantVariables.lblPurchases_MR);

		// Product / Inventory Labels
		request.setAttribute("lblAddProduct",
				isEN ? ConstantVariables.lblAddProduct : ConstantVariables.lblAddProduct_MR);
		request.setAttribute("lblCurrentBill",
				isEN ? ConstantVariables.lblCurrentBill : ConstantVariables.lblCurrentBill_MR);
		request.setAttribute("lblCheckout", isEN ? ConstantVariables.lblCheckout : ConstantVariables.lblCheckout_MR);
		request.setAttribute("lblClearCart", isEN ? ConstantVariables.lblClearCart : ConstantVariables.lblClearCart_MR);
		request.setAttribute("lblItem", isEN ? ConstantVariables.lblItem : ConstantVariables.lblItem_MR);
		request.setAttribute("lblQuantity", isEN ? ConstantVariables.lblQuantity : ConstantVariables.lblQuantity_MR);
		request.setAttribute("lblPrice", isEN ? ConstantVariables.lblPrice : ConstantVariables.lblPrice_MR);
		request.setAttribute("lblTotal", isEN ? ConstantVariables.lblTotal : ConstantVariables.lblTotal_MR);

		// Categories
		request.setAttribute("lblCategoryFruits",
				isEN ? ConstantVariables.lblCategoryFruits : ConstantVariables.lblCategoryFruits_MR);
		request.setAttribute("lblCategoryVegetables",
				isEN ? ConstantVariables.lblCategoryVegetables : ConstantVariables.lblCategoryVegetables_MR);
		request.setAttribute("lblCategoryDairy",
				isEN ? ConstantVariables.lblCategoryDairy : ConstantVariables.lblCategoryDairy_MR);
		request.setAttribute("lblCategoryBeverages",
				isEN ? ConstantVariables.lblCategoryBeverages : ConstantVariables.lblCategoryBeverages_MR);
		request.setAttribute("lblCategorySnacks",
				isEN ? ConstantVariables.lblCategorySnacks : ConstantVariables.lblCategorySnacks_MR);

		// Inventory-specific Labels
		request.setAttribute("lblInventoryPageTitle",
				isEN ? ConstantVariables.lblInventoryPageTitle : ConstantVariables.lblInventoryPageTitle_MR);
		request.setAttribute("lblAddNewProduct",
				isEN ? ConstantVariables.lblAddNewProduct : ConstantVariables.lblAddNewProduct_MR);
		request.setAttribute("lblLowStockReport",
				isEN ? ConstantVariables.lblLowStockReport : ConstantVariables.lblLowStockReport_MR);
		request.setAttribute("lblDeleteAllProducts",
				isEN ? ConstantVariables.lblDeleteAllProducts : ConstantVariables.lblDeleteAllProducts_MR);
		request.setAttribute("lblProductList",
				isEN ? ConstantVariables.lblProductList : ConstantVariables.lblProductList_MR);
		request.setAttribute("lblNoProduct",
				isEN ? ConstantVariables.lblNoProductsFound : ConstantVariables.lblNoProductsFound_MR);

		request.setAttribute("lblCustomerTitle",
				isEN ? ConstantVariables.lblCutomerPageTitle : ConstantVariables.lblCutomerPageTitle_MR);
		request.setAttribute("lblAddCustomer",
				isEN ? ConstantVariables.lblAddCustomer : ConstantVariables.lblAddCustomer_MR);
		request.setAttribute("lblOutstanding",
				isEN ? ConstantVariables.lblOutstanding : ConstantVariables.lblOutstanding_MR);
		request.setAttribute("lblProductName",
				isEN ? ConstantVariables.lblProductName : ConstantVariables.lblProductName_MR);
		request.setAttribute("lblCostPrice",
				isEN ? ConstantVariables.lblCostPrice : ConstantVariables.lblCostPrice_MR);
		request.setAttribute("lblSellingPrice",
				isEN ? ConstantVariables.lblSellingPrice : ConstantVariables.lblSellingPrice_MR);
		request.setAttribute("lblCategory",
				isEN ? ConstantVariables.lblCategory : ConstantVariables.lblCategory_MR);
		request.setAttribute("lblStockQuantity",
				isEN ? ConstantVariables.lblStockQuantity : ConstantVariables.lblStockQuantity_MR);
		request.setAttribute("lblProductImage",
				isEN ? ConstantVariables.lblProductImage : ConstantVariables.lblProductImage_MR);
		request.setAttribute("lblInvoice",
				isEN ? ConstantVariables.lblInvoice : ConstantVariables.lblInvoice_MR);
		request.setAttribute("lblBillNo",
				isEN ? ConstantVariables.lblBillNo : ConstantVariables.lblBillNo_MR);
		request.setAttribute("lblDate",
				isEN ? ConstantVariables.lblDate : ConstantVariables.lblDate_MR);
		request.setAttribute("lblQTY",
				isEN ? ConstantVariables.lblQTY : ConstantVariables.lblQTY_MR);
		request.setAttribute("lblRate",
				isEN ? ConstantVariables.lblRate : ConstantVariables.lblRate_MR);
		request.setAttribute("lblAmount",
				isEN ? ConstantVariables.lblAmount : ConstantVariables.lblAmount_MR);
		request.setAttribute("lblPaidCash",
				isEN ? ConstantVariables.lblPaidCash : ConstantVariables.lblPaidCash_MR);
		request.setAttribute("lblPaidUPI",
				isEN ? ConstantVariables.lblPaidUPI : ConstantVariables.lblPaidUPI_MR);
		request.setAttribute("lblPaidCard",
				isEN ? ConstantVariables.lblPaidCard : ConstantVariables.lblPaidCard_MR);
		request.setAttribute("lblAddtoCredit",
				isEN ? ConstantVariables.lblAddtoCredit : ConstantVariables.lblAddtoCredit_MR);
		request.setAttribute("lblPrintInvoice",
				isEN ? ConstantVariables.lblPrintInvoice : ConstantVariables.lblPrintInvoice_MR);
		request.setAttribute("lblBack",
				isEN ? ConstantVariables.lblBack : ConstantVariables.lblBack_MR);
		request.setAttribute("lblConfirmCredit",
				isEN ? ConstantVariables.lblConfirmCredit : ConstantVariables.lblConfirmCredit_MR);
		request.setAttribute("lblCustomerForCredit",
				isEN ? ConstantVariables.lblCustomerForCredit : ConstantVariables.lblCustomerForCredit_MR);
		request.setAttribute("lblSnacks",
				isEN ? ConstantVariables.lblSnacks : ConstantVariables.lblSnacks_MR);
		request.setAttribute("lblBeverages",
				isEN ? ConstantVariables.lblBeverages : ConstantVariables.lblBeverages_MR);
		request.setAttribute("lblDairy",
				isEN ? ConstantVariables.lblDairy : ConstantVariables.lblDairy_MR);
		request.setAttribute("lblHousehold",
				isEN ? ConstantVariables.lblHousehold : ConstantVariables.lblHousehold_MR);
		request.setAttribute("lblOther",
				isEN ? ConstantVariables.lblOther : ConstantVariables.lblOther_MR);
		request.setAttribute("lblStock",
				isEN ? ConstantVariables.lblStock : ConstantVariables.lblStock_MR);
		request.setAttribute("lblAction",
				isEN ? ConstantVariables.lblAction : ConstantVariables.lblAction_MR);
		
		
		// Purchase Labels
		request.setAttribute("lblPurchaseTitle",
				isEN ? ConstantVariables.lblPurchaseTitle : ConstantVariables.lblPurchaseTitle_MR);	
		request.setAttribute("lblAddPurchase",
				isEN ? ConstantVariables.lblAddPurchase : ConstantVariables.lblAddPurchase_MR);
		request.setAttribute("lblPurchaseAmount",
				isEN ? ConstantVariables.lblPurchaseAmount : ConstantVariables.lblPurchaseAmount_MR);
		request.setAttribute("lblPurchaseDate",
				isEN ? ConstantVariables.lblPurchaseDate : ConstantVariables.lblPurchaseDate_MR);
		request.setAttribute("lblViewBill",
				isEN ? ConstantVariables.lblViewBill : ConstantVariables.lblViewBill_MR);
		request.setAttribute("lblDeleteBill",
				isEN ? ConstantVariables.lblDeleteBill : ConstantVariables.lblDeleteBill_MR);
		request.setAttribute("lblAddNewPurchase",
				isEN ? ConstantVariables.lblAddNewPurchase : ConstantVariables.lblAddNewPurchase_MR);
		request.setAttribute("lblSupplierName",
				isEN ? ConstantVariables.lblSupplierName : ConstantVariables.lblSupplierName_MR);
		request.setAttribute("lblBillPhoto",
				isEN ? ConstantVariables.lblBillPhoto : ConstantVariables.lblBillPhoto_MR);
		request.setAttribute("lblSave",
				isEN ? ConstantVariables.lblSave : ConstantVariables.lblSave_MR);
		
		
		//Dashboard Labels
		request.setAttribute("lblToday",
				isEN ? ConstantVariables.lblToday : ConstantVariables.lblToday_MR);
		request.setAttribute("lblLast7Day",
				isEN ? ConstantVariables.lblLast7Day : ConstantVariables.lblLast7Day_MR);
		request.setAttribute("lblThisMonth",
				isEN ? ConstantVariables.lblThisMonth : ConstantVariables.lblThisMonth_MR);
		request.setAttribute("lblAllTime",
				isEN ? ConstantVariables.lblAllTime : ConstantVariables.lblAllTime_MR);
		request.setAttribute("lblTranscationSummary",
				isEN ? ConstantVariables.lblTranscationSummary : ConstantVariables.lblTranscationSummary_MR);
		request.setAttribute("lblTotalSale",
				isEN ? ConstantVariables.lblTotalSale : ConstantVariables.lblTotalSale_MR);
		request.setAttribute("lblTransaction",
				isEN ? ConstantVariables.lblTransaction : ConstantVariables.lblTransaction_MR);
		request.setAttribute("lblItemSold",
				isEN ? ConstantVariables.lblItemSold : ConstantVariables.lblItemSold_MR);
		request.setAttribute("lblAvgBill",
				isEN ? ConstantVariables.lblAvgBill : ConstantVariables.lblAvgBill_MR);
		request.setAttribute("lblProfitLoss",
				isEN ? ConstantVariables.lblProfitLoss : ConstantVariables.lblProfitLoss_MR);
		request.setAttribute("lbltotalRevenue",
				isEN ? ConstantVariables.lbltotalRevenue : ConstantVariables.lbltotalRevenue_MR);
		request.setAttribute("lblCostGooodSold",
				isEN ? ConstantVariables.lblCostGooodSold : ConstantVariables.lblCostGooodSold_MR);
		request.setAttribute("lblGrossProfit",
				isEN ? ConstantVariables.lblGrossProfit : ConstantVariables.lblGrossProfit_MR);
		request.setAttribute("lblTotalExpenses",
				isEN ? ConstantVariables.lblTotalExpenses : ConstantVariables.lblTotalExpenses_MR);
		request.setAttribute("lblNetLoss",
				isEN ? ConstantVariables.lblNetLoss : ConstantVariables.lblNetLoss_MR);
		
		// Billing labels
		request.setAttribute("lblAllCategory",
				isEN ? ConstantVariables.lblAllCategory : ConstantVariables.lblAllCategory_MR);
		request.setAttribute("lblAdd",
				isEN ? ConstantVariables.lblAdd : ConstantVariables.lblAdd_MR);
		request.setAttribute("lblGenerateBill",
				isEN ? ConstantVariables.lblGenerateBill : ConstantVariables.lblGenerateBill_MR);
		request.setAttribute("lblSubTotal",
				isEN ? ConstantVariables.lblSubTotal : ConstantVariables.lblSubTotal_MR);
		request.setAttribute("lblDiscount",
				isEN ? ConstantVariables.lblDiscount : ConstantVariables.lblDiscount_MR);
		request.setAttribute("lblSelectCustomerforCredit",
				isEN ? ConstantVariables.lblSelectCustomerforCredit : ConstantVariables.lblSelectCustomerforCredit_MR);
		request.setAttribute("lblSelectCustomer",
				isEN ? ConstantVariables.lblSelectCustomer : ConstantVariables.lblSelectCustomer_MR);
		
		
		// Customer
		request.setAttribute("lblCustomerName",
				isEN ? ConstantVariables.lblCustomerName : ConstantVariables.lblCustomerName_MR);
		request.setAttribute("lblAddress",
				isEN ? ConstantVariables.lblAddress : ConstantVariables.lblAddress_MR);
		
		// Customers Debts
		request.setAttribute("lblCustomerDebts",
				isEN ? ConstantVariables.lblCustomerDebts : ConstantVariables.lblCustomerDebts_MR);
		request.setAttribute("lblOutstandingAmount",
				isEN ? ConstantVariables.lblOutstandingAmount : ConstantVariables.lblOutstandingAmount_MR);
		request.setAttribute("lblPayDebts",
				isEN ? ConstantVariables.lblPayDebts : ConstantVariables.lblPayDebts_MR);
		request.setAttribute("lblcancel",
				isEN ? ConstantVariables.lblcancel : ConstantVariables.lblcancel_MR);
		request.setAttribute("lblPay",
				isEN ? ConstantVariables.lblPay : ConstantVariables.lblPay_MR);
		request.setAttribute("lblMobile",
				isEN ? ConstantVariables.lblMobile : ConstantVariables.lblMobile_MR);
		request.setAttribute("lblName",
				isEN ? ConstantVariables.lblName : ConstantVariables.lblName_MR);
		request.setAttribute("lblPaidAmount",
				isEN ? ConstantVariables.lblPaidAmount : ConstantVariables.lblPaidAmount_MR);
	}
}
