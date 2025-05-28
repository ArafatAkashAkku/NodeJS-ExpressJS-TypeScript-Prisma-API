import { Request, Response } from 'express';
import { isDevelopment } from '../utilities/app.utilities';

// Get all demos
// This is the index method, which retrieves all demos
export const index = async (req: Request, res: Response): Promise<void> => {
  try {
    if (isDevelopment) console.log('Retrieving all data');
    res
      .status(200)
      .json({ success: true, message: 'Retrieved data successfully' });
    return;
  } catch (error) {
    if (isDevelopment) console.error('Error retrieving data:', error);
    res
      .status(400)
      .json({ success: false, message: 'internal server error', error });
    return;
  }
};

// Get a single demo by ID
// This is the show method, which retrieves a single demo by ID
// The ID is passed as a parameter in the request
export const show = async (req: Request, res: Response): Promise<void> => {
  try {
    // write both of these two lines and comment which is not needed for future use
    // const { id } = req.params; || const id = req.params.id; // Extracting id from params for non sql ORM usage type string
    // const id = Number(req.params.id); // If using SQL ORM, you can use this line instead type number
    if (isDevelopment) console.log(`Retrieving data with ID: ${req.params.id}`);
    res
      .status(200)
      .json({ success: true, message: 'Retrieved data successfully' });
    return;
  } catch (error) {
    if (isDevelopment) console.error('Error retrieving data:', error);
    res
      .status(400)
      .json({ success: false, message: 'internal server error', error });
    return;
  }
};

// Create a new demo create/store same thing
// This is the create method, which creates a new demo
// The data for the new demo is passed in the request body
export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    if (isDevelopment) console.log('Creating a new data:', req.body);
    res
      .status(200)
      .json({ success: true, message: 'Created data successfully' });
    return;
  } catch (error) {
    if (isDevelopment) console.error('Error creating data:', error);
    res
      .status(400)
      .json({ success: false, message: 'internal server error', error });
    return;
  }
};

// Update a demo by ID
// This is the update method, which updates a demo by ID
// The ID is passed as a parameter in the request
export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    // write both of these two lines and comment which is not needed for future use
    // const { id } = req.params; || const id = req.params.id; // Extracting id from params for non sql ORM usage type string
    // const id = Number(req.params.id); // If using SQL ORM, you can use this line instead type number
    if (isDevelopment)
      console.log(
        `Updating data with ID: ${req.params.id} with data:`,
        req.body,
      );
    res
      .status(200)
      .json({ success: true, message: 'Updated data successfully' });
    return;
  } catch (error) {
    if (isDevelopment) console.error('Error updating data:', error);
    res
      .status(400)
      .json({ success: false, message: 'internal server error', error });
    return;
  }
};

// Delete a demo by ID
// This is the destroy method, which deletes a demo by ID
// The ID is passed as a parameter in the request
export const destroy = async (req: Request, res: Response): Promise<void> => {
  try {
    // write both of these two lines and comment which is not needed for future use
    // const { id } = req.params; || const id = req.params.id; // Extracting id from params for non sql ORM usage type string
    // const id = Number(req.params.id); // If using SQL ORM, you can use this line instead type number
    if (isDevelopment) console.log(`Deleting data with ID: ${req.params.id}`);
    res
      .status(200)
      .json({ success: true, message: 'Deleted data successfully' });
    return;
  } catch (error) {
    if (isDevelopment) console.error('Error deleting data:', error);
    res
      .status(400)
      .json({ success: false, message: 'internal server error', error });
    return;
  }
};
