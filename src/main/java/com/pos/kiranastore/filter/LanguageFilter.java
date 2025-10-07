package com.pos.kiranastore.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;

import com.pos.kiranastore.util.LanguageUtil;

@WebFilter("/*") // all requests
public class LanguageFilter implements Filter {

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {

		HttpServletRequest req = (HttpServletRequest) request;
		String lang = req.getParameter("lang");

		if (lang != null)
			req.getSession().setAttribute("vlang", lang);
		else if (req.getSession().getAttribute("vlang") == null)
			req.getSession().setAttribute("vlang", "EN");

		lang = (String) req.getSession().getAttribute("vlang");

		LanguageUtil.setLanguageLabels(req, lang);

		chain.doFilter(request, response);
	}
}
