// src/controllers/forex-alert.controller.ts
import { Controller, Post, Body, Get } from '@nestjs/common';
import { ForexAlertService } from 'src/service/forexalert.service';

@Controller('forex-alerts')
export class ForexAlertController {
  constructor(private readonly forexAlertService: ForexAlertService) {}

  @Post('forex')
  async upsertForexAlert(
    @Body() alertData: {
      userId: string;
      baseCurrency: string;
      targetCurrency: string;
      lowThreshold: number;
      highThreshold: number;
    },
  ): Promise<void> {
    await this.forexAlertService.upsertForexAlert(alertData);
  }

  @Post('interest')
  async upsertInterestRateAlert(
    @Body() alertData: {
      userId: string;
      foreignCurrency: string;
      lowThreshold: number;
      highThreshold: number;
    },
  ): Promise<void> {
    await this.forexAlertService.upsertInterestRateAlert(alertData);
  }

  @Get('forex')
  async getAllForexAlerts(): Promise<any[]> {
    return this.forexAlertService.getAllForexAlerts();
  }

  @Get('interest')
  async getAllInterestRateAlerts(): Promise<any[]> {
    return this.forexAlertService.getAllInterestRateAlerts();
  }

  @Get('scheduler')
  async scheduler(){
    this.forexAlertService.checkForexRates();
  }

}