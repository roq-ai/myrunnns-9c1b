import { GuestInterface } from 'interfaces/guest';
import { EventInterface } from 'interfaces/event';
import { GetQueryInterface } from 'interfaces';

export interface ParticipationInterface {
  id?: string;
  guest_id?: string;
  event_id?: string;
  progress?: number;
  created_at?: any;
  updated_at?: any;

  guest?: GuestInterface;
  event?: EventInterface;
  _count?: {};
}

export interface ParticipationGetQueryInterface extends GetQueryInterface {
  id?: string;
  guest_id?: string;
  event_id?: string;
}
