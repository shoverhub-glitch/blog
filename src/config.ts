// Use official AdSense test ID if no publisher ID is provided
const TEST_ID = 'ca-pub-3940256099942544';
export const config = {
  adsensePublisherId: import.meta.env.VITE_ADSENSE_PUBLISHER_ID || TEST_ID,
};
