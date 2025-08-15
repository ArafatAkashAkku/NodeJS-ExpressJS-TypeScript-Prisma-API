import cron from 'node-cron';
import axios from 'axios';
import { appBackendUrl, isDevelopment } from '../utilities/app.utilities';

// Define the cron job to run every 10 minutes
cron.schedule('*/10 * * * *', async () => {
  try {
    if (isDevelopment) console.log('Cron job started - requesting API');
    const response = await axios.get(appBackendUrl + '/');
    if (isDevelopment) console.log('API Response\n', response.data);
  } catch (error) {
    if (isDevelopment) console.error('Cron job error\n', error);
  }
});

// remove with not verified user
