import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { ClientError } from '../errors/client-error'
import { env } from '../env'

export async function confirmParticipant(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    '/participants/:participantId/confirm',
    {
      schema: {
        params: z.object({
          participantId: z.string().uuid(),
        }),
        body: z.object({
          name: z.string().min(2),
          email: z.string().email(),
        }),
      },
    },
    async (request, reply) => {
      const { participantId } = request.params
      const { name, email } = request.body

      const participant = await prisma.participant.findUnique({
        where: {
          id: participantId,
        },
      })

      if (!participant) {
        throw new ClientError('Participant not found.')
      }

      if (participant.is_confirmed) {
        return reply.redirect(
          `${env.WEB_APP_BASE_URL}/trips/${participant.trip_id}`,
        )
      }

      await prisma.participant.update({
        where: { id: participantId },
        data: { name, email, is_confirmed: true },
      })
    },
  )
}
