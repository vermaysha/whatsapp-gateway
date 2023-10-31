import { Controller, Sse, MessageEvent } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, fromEvent, map } from 'rxjs';

@Controller('event')
export class EventController {
  constructor(private readonly event: EventEmitter2) {}

  @Sse('qr')
  getQr(): Observable<MessageEvent> {
    return fromEvent(this.event, 'qr.update').pipe(
      map((data: string) => {
        return new MessageEvent('qr.update', { data });
      }),
    );
  }

  @Sse('connection-state')
  getConnectionState(): Observable<MessageEvent> {
    return fromEvent(this.event, 'connection.update').pipe(
      map((data: string) => {
        return new MessageEvent('connection.update', { data });
      }),
    );
  }
}
