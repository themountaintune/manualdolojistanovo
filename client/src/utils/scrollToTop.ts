/**
 * Utility function to scroll to top of the page
 * @param behavior - Scroll behavior: 'smooth' | 'instant' | 'auto'
 */
export const scrollToTop = (behavior: ScrollBehavior = 'smooth') => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior
  });
};

/**
 * Utility function to scroll to a specific element
 * @param elementId - ID of the element to scroll to
 * @param behavior - Scroll behavior: 'smooth' | 'instant' | 'auto'
 */
export const scrollToElement = (elementId: string, behavior: ScrollBehavior = 'smooth') => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior, block: 'start' });
  }
};
