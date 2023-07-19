const mapping: Record<string, string> = {
  coaches: 'coach',
  companies: 'company',
  events: 'event',
  guests: 'guest',
  participations: 'participation',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
