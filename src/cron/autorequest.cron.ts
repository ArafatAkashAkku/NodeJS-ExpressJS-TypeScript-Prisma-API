import cron from 'node-cron';
import axios from 'axios';
import { appBackendUrl, isDevelopment } from '../utilities/app.utilities';

// Define the cron job to run every 10 minutes
cron.schedule('*/10 * * * *', async () => {
  try {
    if (isDevelopment) console.log('Cron job started - requesting API');
    const response = await axios.get(appBackendUrl + '/');
    if (isDevelopment) console.log('Cron job started - API Response', response.data);
  } 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch (error: any) {
    if (isDevelopment) console.log('Cron job error - API Response', error.message);
  }
});

// remove with not verified user
