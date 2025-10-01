package com.pos.kiranastore.controller;


import java.io.IOException;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.pos.kiranastore.util.ConstantVariables;

@WebServlet("/InventoryServlet")
public class InventoryServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {

        // ---------------------------
        // Language handling
        // ---------------------------
        String lang = request.getParameter("lang");
        if (lang != null) {
            request.getSession().setAttribute("vlang", lang);
        } else if(request.getSession().getAttribute("vlang") == null) {
            lang = "EN";  // default language
            request.getSession().setAttribute("vlang", lang);
        } else {
            lang = (String) request.getSession().getAttribute("vlang");
        }
        boolean isEN = "EN".equalsIgnoreCase(lang);

        // ---------------------------
        // Set labels
        // ---------------------------
        request.setAttribute("lblHead", isEN ? ConstantVariables.lblhead : ConstantVariables.lblhead_MR);
        request.setAttribute("lblBilling", isEN ? ConstantVariables.lblBilling : ConstantVariables.lblBilling_MR);
        request.setAttribute("lblCart", isEN ? ConstantVariables.lblCart : ConstantVariables.lblCart_MR);
        request.setAttribute("lblLogout", isEN ? ConstantVariables.lblLogout : ConstantVariables.lblLogout_MR);
        request.setAttribute("lblSearchPlaceholder", isEN ? ConstantVariables.lblSearchPlaceholder : ConstantVariables.lblSearchPlaceholder_MR);

        request.setAttribute("lblDashboard", isEN ? ConstantVariables.lblDashboard : ConstantVariables.lblDashboard_MR);
        request.setAttribute("lblInventory", isEN ? ConstantVariables.lblInventory : ConstantVariables.lblInventory_MR);
        request.setAttribute("lblCustomers", isEN ? ConstantVariables.lblCustomers : ConstantVariables.lblCustomers_MR);
        request.setAttribute("lblDebts", isEN ? ConstantVariables.lblDebts : ConstantVariables.lblDebts_MR);
        request.setAttribute("lblPurchases", isEN ? ConstantVariables.lblPurchases : ConstantVariables.lblPurchases_MR);

        // ---------------------------
        // Forward to JSP
        // ---------------------------
        RequestDispatcher rd = request.getRequestDispatcher("/inventory.jsp");
        rd.forward(request, response);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        doGet(request, response);
    }
}
