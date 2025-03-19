import { Controller, Get, Sse } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Controller('forex-notifications')
export class ForexSseController {
  private alertStream = new Subject<any>();

  constructor(private eventEmitter: EventEmitter2) {}

  @Sse('stream')
  forexAlerts(): Observable<any> {
    return this.alertStream.asObservable();
  }

  @OnEvent('forex.alert.triggered')
  handleForexAlert(alert: any) {
    this.alertStream.next({ data: alert });
  }
}
