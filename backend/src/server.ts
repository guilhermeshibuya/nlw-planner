import fastify from 'fastify'
import cors from '@fastify/cors'
import { createTrip } from './routes/create-trip'
import { confirmTrip } from './routes/confirm-trip'
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { confirmParticipant } from './routes/confirm-participant'
import { createActivity } from './routes/create-activity'
import { getActivities } from './routes/get-activities'
import { createLink } from './routes/create-link'
import { getLinks } from './routes/get-links'
import { getParticipants } from './routes/get-participants'
import { createInvite } from './routes/create-invite'
import { updateTrip } from './routes/update-trip'
import { getTripDetails } from './routes/get-trip-details'
import { getParticipant } from './routes/get-participant'
import { errorHandler } from './error-handler'
import { env } from './env'

const app = fastify()

app.register(cors, {
  origin: '*',
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.setErrorHandler(errorHandler)

// Activities Routes
app.register(getActivities)
app.register(createActivity)

// Links Routes
app.register(getLinks)
app.register(createLink)

// Participants Routes
app.register(getParticipant)
app.register(getParticipants)
app.register(confirmParticipant)
app.register(createInvite)

// Trips Routes
app.register(createTrip)
app.register(confirmTrip)
app.register(updateTrip)
app.register(getTripDetails)

app.listen({ port: env.PORT }).then(() => console.log('Server running!'))
