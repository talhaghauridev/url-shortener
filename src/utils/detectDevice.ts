export const detectDevice = (userAgent: string) => {
  const ua = userAgent.toLowerCase();
  const isMobile =
    /mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(ua);
  const isTablet = /tablet|ipad/.test(ua);
  const isDesktop = !isMobile && !isTablet;

  let os = "Unknown";
  if (/android/.test(ua)) os = "Android";
  else if (/iphone|ipad|ipod/.test(ua)) os = "iOS";
  else if (/windows/.test(ua)) os = "Windows";
  else if (/macintosh/.test(ua)) os = "MacOS";
  else if (/linux/.test(ua)) os = "Linux";

  let browser = "Unknown";
  if (/chrome|crios|crmo/.test(ua)) browser = "Chrome";
  else if (/firefox|iceweasel/.test(ua)) browser = "Firefox";
  else if (/safari/.test(ua)) browser = "Safari";
  else if (/opr|opera/.test(ua)) browser = "Opera";
  else if (/msie|trident/.test(ua)) browser = "Internet Explorer";
  else if (/edg/.test(ua)) browser = "Edge";

  return {
    deviceType: isMobile ? "Mobile" : isTablet ? "Tablet" : "Desktop",
    os,
    browser,
  };
};
