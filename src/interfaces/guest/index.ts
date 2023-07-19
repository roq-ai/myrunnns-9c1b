import { ParticipationInterface } from 'interfaces/participation';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface GuestInterface {
  id?: string;
  name: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;
  participation?: ParticipationInterface[];
  user?: UserInterface;
  _count?: {
    participation?: number;
  };
}

export interface GuestGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  user_id?: string;
}
