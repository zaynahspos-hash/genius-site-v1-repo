import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { seoService } from '../../services/seoService';

export const RedirectHandler: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const check = async () => {
        // Only check if path is not a valid route? 
        // Or check every route change? 
        // For performance, usually mostly useful on 404 pages, but strictly speaking 301s should happen before page load.
        // We will check every route change, but this adds latency.
        // Optimization: Only check if route is not found (Needs integration with 404 page) OR
        // assume standard routes are handled and this catches legacy URLs.
        
        const redirect = await seoService.checkRedirect(location.pathname);
        if (redirect) {
            window.location.replace(redirect.to); // Force reload for hard redirect behavior, or navigate(redirect.to, { replace: true }) for SPA feel
        }
    };
    check();
  }, [location.pathname]);

  return null;
};