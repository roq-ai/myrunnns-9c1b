import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { guestValidationSchema } from 'validationSchema/guests';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getGuests();
    case 'POST':
      return createGuest();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getGuests() {
    const data = await prisma.guest
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'guest'));
    return res.status(200).json(data);
  }

  async function createGuest() {
    await guestValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.participation?.length > 0) {
      const create_participation = body.participation;
      body.participation = {
        create: create_participation,
      };
    } else {
      delete body.participation;
    }
    const data = await prisma.guest.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
