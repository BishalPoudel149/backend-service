import { Controller, Post } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('test')
export class TestController {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  @Post('trigger-alert')
  async simulateAlert() {
    const mockAlert = {
      BASECURRENCY: 'USD',
      TARGETCURRENCY: 'EUR',
      CURRENT_RATE: 1.25,
      HIGHTHRESHOLD: 1.2,
      LOWTHRESHOLD: 1.0,
      TIMESTAMP: new Date().toISOString(),
    };

    // Emit the event
    this.eventEmitter.emit('forex.alert.triggered', mockAlert);
    
    return { message: 'Alert triggered successfully' };
  }
}
