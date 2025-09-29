package com.pos.kiranastore.controller;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.pos.kiranastore.util.ConstantVariables;

/**
 * Servlet implementation class HomeServlet
 */
@WebServlet("/HomeServlet")
public class HomeServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public HomeServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	 protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 1. Read selected language from request or session
        String lang = request.getParameter("lang"); // "EN" or "MR"
        if(lang != null) {
            request.getSession().setAttribute("vlang", lang);
        } else {
            lang = (String) request.getSession().getAttribute("vlang");
            if(lang == null) lang = "EN"; // default
        }

        // 2. Set dynamic labels based on language
        request.setAttribute("lblBilling", lang.equals("EN") ? ConstantVariables.lblBilling : ConstantVariables.lblBilling_MR);
        request.setAttribute("lblCart", lang.equals("EN") ? ConstantVariables.lblCart : ConstantVariables.lblCart_MR);
        request.setAttribute("lblLogout", lang.equals("EN") ? ConstantVariables.lblLogout : ConstantVariables.lblLogout_MR);
        request.setAttribute("lblSearchPlaceholder", lang.equals("EN") ? ConstantVariables.lblSearchPlaceholder : ConstantVariables.lblSearchPlaceholder_MR);
        request.setAttribute("lblAllCategories", lang.equals("EN") ? ConstantVariables.lblAllCategories : ConstantVariables.lblAllCategories_MR);

        // Forward to JSP
        request.getRequestDispatcher("home.jsp").forward(request, response);
    }

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		
	}

}
