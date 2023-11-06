import { Controller, Sse, MessageEvent } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, fromEvent, map, merge } from 'rxjs';
import { WhatsappService } from '../whatsapp/whatsapp.service';

@Controller('event')
export class EventController {
  constructor(
    private readonly event: EventEmitter2,
    private readonly whatsapp: WhatsappService,
  ) {}

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
    const connectionUpdate = fromEvent(this.event, 'connection.update');
    const processState = fromEvent(this.event, 'process.state');
    return merge(connectionUpdate, processState).pipe(
      map(() => {
        const { workerStartedAt, connectedAt, workerState, connectionState } =
          this.whatsapp;

        console.log('dispatch event');

        return new MessageEvent('connection.update', {
          data: {
            connectionState,
            connectedAt,
            workerState,
            workerStartedAt,
          },
        });
      }),
    );
  }
}
