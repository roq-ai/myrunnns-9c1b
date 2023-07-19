import { ParticipationInterface } from 'interfaces/participation';
import { CompanyInterface } from 'interfaces/company';
import { GetQueryInterface } from 'interfaces';

export interface EventInterface {
  id?: string;
  name: string;
  location: string;
  date: any;
  company_id?: string;
  created_at?: any;
  updated_at?: any;
  participation?: ParticipationInterface[];
  company?: CompanyInterface;
  _count?: {
    participation?: number;
  };
}

export interface EventGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  location?: string;
  company_id?: string;
}
