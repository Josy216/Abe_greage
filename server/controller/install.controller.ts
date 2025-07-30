// Import the install service to handler communication with the database
import { installTables } from '../services/install.service';
import { Request, Response } from 'express';

// Create a function service to create the database tables
async function install(req: Request, res: Response) {
  try {
    const instalMessage: { message: string; status?: number } =
      await installTables();

    // check if the install was successful or not and send the appropriate message to the client
    if (instalMessage.status === 200) {
      res.status(200).json({ message: instalMessage });
    } else {
      res.status(500).json({ message: instalMessage });
    }
  } catch (error) {
    console.error('Error creating tables:', error);
    res.status(500).json({ message: 'Error creating tables', error: error });
  }
}

export { install };
