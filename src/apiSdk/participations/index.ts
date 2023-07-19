import axios from 'axios';
import queryString from 'query-string';
import { ParticipationInterface, ParticipationGetQueryInterface } from 'interfaces/participation';
import { GetQueryInterface } from '../../interfaces';

export const getParticipations = async (query?: ParticipationGetQueryInterface) => {
  const response = await axios.get(`/api/participations${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createParticipation = async (participation: ParticipationInterface) => {
  const response = await axios.post('/api/participations', participation);
  return response.data;
};

export const updateParticipationById = async (id: string, participation: ParticipationInterface) => {
  const response = await axios.put(`/api/participations/${id}`, participation);
  return response.data;
};

export const getParticipationById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/participations/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteParticipationById = async (id: string) => {
  const response = await axios.delete(`/api/participations/${id}`);
  return response.data;
};
