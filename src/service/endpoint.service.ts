import { Injectable } from '@nestjs/common';

@Injectable()
export class EndpointService {
    getEndpoints(): Record<string, string> {
      return {
        'Available Endpoints': '',
        '/': 'GET: Returns a list of all available endpoints',
        '/forex-alerts/forex': 'POST: Create or update a forex alert. Requires body: { userId, baseCurrency, targetCurrency, lowThreshold, highThreshold }',
        '/forex-alerts/interest': 'POST: Create or update an interest rate alert. Requires body: { userId, foreignCurrency, lowThreshold, highThreshold }',
        '/forex-alerts/scheduler': 'GET: Manually trigger the forex rate scheduler to check thresholds and send alerts',
      };
    }
}