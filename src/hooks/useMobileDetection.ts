import { useState, useEffect } from 'react';

interface MobileInfo {
  isMobile: boolean;
  isTablet: boolean;
  isFoldable: boolean;
  hasVirtualKeyboard: boolean;
  screenSize: 'mobile' | 'tablet-sm' | 'tablet' | 'tablet-lg' | 'desktop' | 'desktop-lg' | 'desktop-xl';
  orientation: 'portrait' | 'landscape';
  keyboardHeight: number;
}

export function useMobileDetection(): MobileInfo {
  const [mobileInfo, setMobileInfo] = useState<MobileInfo>({
    isMobile: false,
    isTablet: false,
    isFoldable: false,
    hasVirtualKeyboard: false,
    screenSize: 'desktop',
    orientation: 'landscape',
    keyboardHeight: 0,
  });

  useEffect(() => {
    const updateMobileInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const userAgent = navigator.userAgent.toLowerCase();
      
      // Device detection
      const isMobile = width < 768 || /android|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isTablet = (width >= 768 && width < 1024) || /ipad|tablet|kindle|silk/i.test(userAgent);
      const isFoldable = /fold|flip/i.test(userAgent) || (width > 512 && width < 640 && height > 800);
      
      // Screen size detection
      let screenSize: MobileInfo['screenSize'] = 'desktop';
      if (width < 475) screenSize = 'mobile';
      else if (width < 640) screenSize = 'tablet-sm';
      else if (width < 768) screenSize = 'tablet';
      else if (width < 1024) screenSize = 'tablet-lg';
      else if (width < 1280) screenSize = 'desktop';
      else if (width < 1440) screenSize = 'desktop-lg';
      else screenSize = 'desktop-xl';
      
      // Orientation
      const orientation: MobileInfo['orientation'] = width > height ? 'landscape' : 'portrait';
      
      setMobileInfo(prev => ({
        ...prev,
        isMobile,
        isTablet,
        isFoldable,
        screenSize,
        orientation,
      }));
    };

    // Initial detection
    updateMobileInfo();

    // Listen for resize events
    window.addEventListener('resize', updateMobileInfo);
    window.addEventListener('orientationchange', updateMobileInfo);

    return () => {
      window.removeEventListener('resize', updateMobileInfo);
      window.removeEventListener('orientationchange', updateMobileInfo);
    };
  }, []);

  // Virtual keyboard detection
  useEffect(() => {
    if (!mobileInfo.isMobile) return;

    let initialHeight = window.innerHeight;
    let keyboardTimeout: NodeJS.Timeout;

    const handleResize = () => {
      const currentHeight = window.innerHeight;
      const heightDiff = initialHeight - currentHeight;
      
      // Clear existing timeout
      if (keyboardTimeout) clearTimeout(keyboardTimeout);
      
      // Debounce the keyboard detection
      keyboardTimeout = setTimeout(() => {
        const hasKeyboard = heightDiff > 150; // Threshold for virtual keyboard
        const keyboardHeight = hasKeyboard ? heightDiff : 0;
        
        setMobileInfo(prev => ({
          ...prev,
          hasVirtualKeyboard: hasKeyboard,
          keyboardHeight,
        }));

        // Apply CSS custom property for dynamic adjustments
        document.documentElement.style.setProperty(
          '--keyboard-height', 
          `${keyboardHeight}px`
        );
        document.documentElement.style.setProperty(
          '--available-height', 
          `${currentHeight}px`
        );
      }, 150);
    };

    // Listen for viewport changes (virtual keyboard)
    window.addEventListener('resize', handleResize);
    
    // Also listen for visual viewport changes (more accurate for mobile)
    if ('visualViewport' in window) {
      const visualViewport = window.visualViewport!;
      
      const handleViewportChange = () => {
        const keyboardHeight = window.innerHeight - visualViewport.height;
        const hasKeyboard = keyboardHeight > 150;
        
        setMobileInfo(prev => ({
          ...prev,
          hasVirtualKeyboard: hasKeyboard,
          keyboardHeight: hasKeyboard ? keyboardHeight : 0,
        }));

        document.documentElement.style.setProperty(
          '--keyboard-height', 
          `${hasKeyboard ? keyboardHeight : 0}px`
        );
        document.documentElement.style.setProperty(
          '--available-height', 
          `${visualViewport.height}px`
        );
      };

      visualViewport.addEventListener('resize', handleViewportChange);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        visualViewport.removeEventListener('resize', handleViewportChange);
        if (keyboardTimeout) clearTimeout(keyboardTimeout);
      };
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (keyboardTimeout) clearTimeout(keyboardTimeout);
    };
  }, [mobileInfo.isMobile]);

  return mobileInfo;
}

// CSS utility for responsive components
export const getResponsiveClasses = (screenSize: MobileInfo['screenSize'], hasKeyboard: boolean) => {
  const baseClasses = {
    mobile: 'px-4 py-2',
    'tablet-sm': 'px-6 py-3',
    tablet: 'px-6 py-4',
    'tablet-lg': 'px-8 py-4',
    desktop: 'px-8 py-6',
    'desktop-lg': 'px-12 py-8',
    'desktop-xl': 'px-16 py-10',
  };

  const keyboardClasses = hasKeyboard ? 'pb-2' : '';
  
  return `${baseClasses[screenSize]} ${keyboardClasses}`;
};