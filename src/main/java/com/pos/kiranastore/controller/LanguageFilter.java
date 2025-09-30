package com.pos.kiranastore.controller;


import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import java.io.IOException;

@WebFilter("/*") // Apply to all requests
public class LanguageFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        if (request instanceof HttpServletRequest) {
            HttpServletRequest req = (HttpServletRequest) request;
            HttpSession session = req.getSession();

            // Default English if not set
            if (session.getAttribute("vlang") == null) {
                session.setAttribute("vlang", "EN");
            }
        }

        // Continue with request
        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {
        // Not needed
    }
}
