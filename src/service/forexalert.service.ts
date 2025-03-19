// src/services/forex-alert.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Cron } from '@nestjs/schedule';
import { EmailService } from './email.service';
import { EventEmitter2 } from '@nestjs/event-emitter';


@Injectable()
export class ForexAlertService {
  private readonly logger = new Logger(ForexAlertService.name);

  private readonly forexApiUrl = 'https://openexchangerates.org/api/latest.json';
  private readonly forexApiKey = 'YOUR_OPEN_EXCHANGE_RATES_API_KEY'; // Replace with your API key

  constructor(private readonly databaseService: DatabaseService,
    private readonly emailService: EmailService,
    private eventEmitter: EventEmitter2
  ) {}

  // Insert or update a forex alert
  async upsertForexAlert(alertData: {
    userId: string;
    baseCurrency: string;
    targetCurrency: string;
    lowThreshold: number;
    highThreshold: number;
  }): Promise<void> {
    try {
      await this.databaseService.upsertForexAlert(alertData);
      this.logger.log('Forex alert upserted successfully');
    } catch (error) {
      this.logger.error('Failed to upsert forex alert', error);
      throw error;
    }
  }

  // Insert or update an interest rate alert
  async upsertInterestRateAlert(alertData: {
    userId: string;
    foreignCurrency: string;
    lowThreshold: number;
    highThreshold: number;
  }): Promise<void> {
    try {
      await this.databaseService.upsertInterestRateAlert(alertData);
      this.logger.log('Interest rate alert upserted successfully');
    } catch (error) {
      this.logger.error('Failed to upsert interest rate alert', error);
      throw error;
    }
  }

  // Fetch all forex alerts
  async getAllForexAlerts(): Promise<any[]> {
    try {
      const alerts = await this.databaseService.getAllForexAlerts();
      return alerts;
    } catch (error) {
      this.logger.error('Failed to fetch forex alerts', error);
      throw error;
    }
  }

  // Fetch all interest rate alerts
  async getAllInterestRateAlerts(): Promise<any[]> {
    try {
      const alerts = await this.databaseService.getAllInterestRateAlerts();
      return alerts;
    } catch (error) {
      this.logger.error('Failed to fetch interest rate alerts', error);
      throw error;
    }
  }

  // Check forex rates every 5 minutes
//   @Cron('*/5 * * * *')
//   async checkForexRates(): Promise<void> {
//     const currentRate = await this.fetchForexRate(); // Implement this method to fetch the current forex rate
//     await this.checkForexRatesAndTriggerAlerts(currentRate);
//   }

  // Check interest rates every 5 minutes
  // Check forex rates every 5 minutes
  
  @Cron('*/1 * * * *')
async checkForexRates(): Promise<void> {
  try {
    // Fetch all forex alerts
    const alerts = await this.databaseService.getAllForexAlerts();

    // If no alerts, log and exit
    if (alerts.length === 0) {
      this.logger.log('No forex alerts to check');
      return;
    }

    this.logger.warn('Checking forex rates against thresholds...');

    // Process each alert
    for (const alert of alerts) {
      await this.processAlert(alert);
    }
  } catch (error) {
    this.logger.error('Failed to check forex rates', error);
    throw error;
  }
}

// Process a single alert
private async processAlert(alert: any): Promise<void> {
  try {
    // Skip alerts with invalid baseCurrency or targetCurrency
    if (!alert.BASECURRENCY || !alert.TARGETCURRENCY) {
      this.logger.warn(
        `Skipping alert ID: ${alert.id} - baseCurrency or targetCurrency is undefined/null`,
      );
      return;
    }

    // Fetch the latest forex rate for the alert's currency pair
    const currentRate = await this.databaseService.getLatestForexRate(
      alert.BASECURRENCY,
      alert.TARGETCURRENCY,
    );

    // Check if the current rate crosses the threshold
    if (this.isThresholdCrossed(currentRate, alert.LOWTHRESHOLD, alert.HIGHTHRESHOLD)) {
      this.logger.warn(
        `Alert ID: ${alert.ID}, Base: ${alert.BASECURRENCY}, Target: ${alert.TARGETCURRENCY}, Low: ${alert.LOWTHRESHOLD}, High: ${alert.HIGHTHRESHOLD}`,
      );
      // Trigger alert
      await this.triggerAlert(alert, currentRate);
    }
  } catch (error) {
    this.logger.error(`Failed to process alert ID: ${alert.ID}`, error);
  }
}

// Check if the current rate crosses the threshold
private isThresholdCrossed(
  currentRate: number,
  lowThreshold: number,
  highThreshold: number,
): boolean {
  return currentRate < lowThreshold || currentRate > highThreshold;
}

// Trigger alert (send notification)
// private async triggerAlert(alert: any, currentRate: number): Promise<void> {
//   const subject = `Forex Alert: ${alert.baseCurrency}/${alert.targetCurrency}`;
//   const body = `The forex rate for ${alert.baseCurrency}/${alert.targetCurrency} has crossed the threshold. Current rate: ${currentRate}`;

//   try {
//     await this.sapAlertNotificationService.sendAlert(subject, body);
//     this.logger.log(`Alert triggered for alert ID: ${alert.ID}`);
//   } catch (error) {
//     this.logger.error(`Failed to trigger alert for alert ID: ${alert.ID}`, error);
//   }
// }

  // Trigger alert (send notification)
  private async triggerAlert(alert: any, currentRate: number): Promise<void> {
    const subject = `Forex Alert: ${alert.BASECURRENCY}/${alert.TARGETCURRENCY}`;
    const body = `The forex rate for ${alert.BASECURRENCY}/${alert.TARGETCURRENCY} has crossed the threshold. Current rate: ${currentRate}`;

    try {
      // Send email notification
      console.log('ready to send the email...');
      await this.emailService.sendEmail(alert.EMAIL, subject, body);

      // Store notification in the database


            //  Send real-time SSE alert 🔔
            const alertPayload = {
              currencyPair: `${alert.BASECURRENCY}/${alert.TARGETCURRENCY}`,
              currentRate,
              threshold: currentRate > alert.HIGHTHRESHOLD ? 'Above High' : 'Below Low',
              timestamp: new Date().toISOString(),
            };
            this.eventEmitter.emit('forex.alert.triggered', alertPayload);

      this.logger.log(`Alert triggered for alert ID: ${alert.ID}`);
    } catch (error) {
      this.logger.error(`Failed to trigger alert for alert ID: ${alert.ID}`, error);
    }
  }


  // instead of this real time, will fetch from the database 

  // Fetch the current forex rate from an external API
//   private async fetchForexRate(): Promise<number> {
//     try {
//       const response = await axios.get(this.forexApiUrl, {
//         params: {
//           app_id: this.forexApiKey,
//           base: 'USD', // Base currency (e.g., USD)
//           symbols: 'EUR', // Target currency (e.g., EUR)
//         },
//       });

//       // Extract the forex rate from the response
//       const rate = response.data.rates.EUR; // Replace 'EUR' with your target currency
//       this.logger.log(`Fetched forex rate: ${rate}`);
//       return rate;
//     } catch (error) {
//       this.logger.error('Failed to fetch forex rate', error);
//       throw error;
//     }
//   }

  // Fetch the current interest rate (mock implementation)
  private async fetchInterestRate(): Promise<number> {
    // Replace this with actual logic to fetch the interest rate

    return 1.0; // Example rate
  }
}