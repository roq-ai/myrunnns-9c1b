import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { participationValidationSchema } from 'validationSchema/participations';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.participation
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getParticipationById();
    case 'PUT':
      return updateParticipationById();
    case 'DELETE':
      return deleteParticipationById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getParticipationById() {
    const data = await prisma.participation.findFirst(convertQueryToPrismaUtil(req.query, 'participation'));
    return res.status(200).json(data);
  }

  async function updateParticipationById() {
    await participationValidationSchema.validate(req.body);
    const data = await prisma.participation.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteParticipationById() {
    const data = await prisma.participation.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
