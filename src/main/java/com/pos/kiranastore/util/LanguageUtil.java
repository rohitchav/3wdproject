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
	}
}
