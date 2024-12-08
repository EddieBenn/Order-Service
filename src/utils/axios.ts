import { HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import dotnev from 'dotenv';

dotnev.config();

const base_url = process.env.INVENTORY_BASE_URL;
export const checkStockAvailability = async (
  itemId: string,
  quantity: number,
): Promise<boolean> => {
  try {
    const response = await axios.get(
      `${base_url}/check-stock/${itemId}?quantity=${quantity}`,
    );
    return response.data.isAvailable;
  } catch (error) {
    throw new HttpException(
      'Error checking stock availability',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

export const deductStock = async (itemId: string, quantity: number) => {
  try {
    const response = await axios.put(`${base_url}/deduct-stock/${itemId}`, {
      quantity,
    });
    return response.data.isAvailable;
  } catch (error) {
    throw new HttpException(
      'Error deducting stock',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
