package com.pos.kiranastore.controller;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.pos.kiranastore.util.ConstantVariables;

@WebServlet("/HomeServlet")
public class HomeServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    public HomeServlet() {
        super();
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 1. Get language from request or session
    	String lang = request.getParameter("lang");
    	if (lang != null) {
    	    // Save selected language in session
    	    request.getSession().setAttribute("vlang", lang);
    	} else {
    	    // If no param, try to read from session
    	    lang = (String) request.getSession().getAttribute("vlang");
    	    if (lang == null) {
    	        lang = "EN"; // default language
    	        request.getSession().setAttribute("vlang", lang);
    	    }
    	}

        // 2. Set dynamic labels for home page
        boolean isEN = lang.equals("EN");

        // Navbar
        request.setAttribute("lblHead", isEN ? ConstantVariables.lblhead : ConstantVariables.lblhead_MR);
        request.setAttribute("lblBilling", isEN ? ConstantVariables.lblBilling : ConstantVariables.lblBilling_MR);
        request.setAttribute("lblCart", isEN ? ConstantVariables.lblCart : ConstantVariables.lblCart_MR);
        request.setAttribute("lblLogout", isEN ? ConstantVariables.lblLogout : ConstantVariables.lblLogout_MR);
        request.setAttribute("lblSearchPlaceholder", isEN ? ConstantVariables.lblSearchPlaceholder : ConstantVariables.lblSearchPlaceholder_MR);

        // Sidebar
        request.setAttribute("lblDashboard", isEN ? ConstantVariables.lblDashboard : ConstantVariables.lblDashboard_MR);
        request.setAttribute("lblInventory", isEN ? ConstantVariables.lblInventory : ConstantVariables.lblInventory_MR);
        request.setAttribute("lblCustomers", isEN ? ConstantVariables.lblCustomers : ConstantVariables.lblCustomers_MR);
        request.setAttribute("lblDebts", isEN ? ConstantVariables.lblDebts : ConstantVariables.lblDebts_MR);
        request.setAttribute("lblPurchases", isEN ? ConstantVariables.lblPurchases : ConstantVariables.lblPurchases_MR);

        // Product
        request.setAttribute("lblAddProduct", isEN ? ConstantVariables.lblAddProduct : ConstantVariables.lblAddProduct_MR);

        // Cart
        request.setAttribute("lblCurrentBill", isEN ? ConstantVariables.lblCurrentBill : ConstantVariables.lblCurrentBill_MR);
        request.setAttribute("lblCheckout", isEN ? ConstantVariables.lblCheckout : ConstantVariables.lblCheckout_MR);
        request.setAttribute("lblClearCart", isEN ? ConstantVariables.lblClearCart : ConstantVariables.lblClearCart_MR);
        request.setAttribute("lblItem", isEN ? ConstantVariables.lblItem : ConstantVariables.lblItem_MR);
        request.setAttribute("lblQuantity", isEN ? ConstantVariables.lblQuantity : ConstantVariables.lblQuantity_MR);
        request.setAttribute("lblPrice", isEN ? ConstantVariables.lblPrice : ConstantVariables.lblPrice_MR);
        request.setAttribute("lblTotal", isEN ? ConstantVariables.lblTotal : ConstantVariables.lblTotal_MR);

        // Categories (optional)
        request.setAttribute("lblCategoryFruits", isEN ? ConstantVariables.lblCategoryFruits : ConstantVariables.lblCategoryFruits_MR);
        request.setAttribute("lblCategoryVegetables", isEN ? ConstantVariables.lblCategoryVegetables : ConstantVariables.lblCategoryVegetables_MR);
        request.setAttribute("lblCategoryDairy", isEN ? ConstantVariables.lblCategoryDairy : ConstantVariables.lblCategoryDairy_MR);
        request.setAttribute("lblCategoryBeverages", isEN ? ConstantVariables.lblCategoryBeverages : ConstantVariables.lblCategoryBeverages_MR);
        request.setAttribute("lblCategorySnacks", isEN ? ConstantVariables.lblCategorySnacks : ConstantVariables.lblCategorySnacks_MR);

        // Forward to JSP
        request.getRequestDispatcher("home.jsp").forward(request, response);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doGet(request, response);
    }
}
