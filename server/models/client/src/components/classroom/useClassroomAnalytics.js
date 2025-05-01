import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useClassroomAnalytics() {
  const location = useLocation();

  useEffect(() => {
    // Track page view
    console.log('Track page view:', location.pathname);
    // Implement actual analytics tracking here (e.g., Google Analytics, Mixpanel)
  }, [location]);

  const trackEvent = (eventName, payload = {}) => {
    console.log('Track event:', eventName, payload);
    // Implement actual event tracking here
  };

  return { trackEvent };
}