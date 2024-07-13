import { Mail, User, X } from 'lucide-react'
import { FormEvent, useEffect, useState } from 'react'
import { Button } from '../../components/button'
import { api } from '../../lib/axios'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useNavigate } from 'react-router-dom'

interface ConfirmGuestInviteModalProps {
  tripId: string
  participantId: string
  closeConfirmGuestInviteModal: () => void
}

interface Trip {
  destination: string
  starts_at: string
  ends_at: string
  is_confirmed: boolean
}

export const ConfirmGuestInviteModal = ({
  tripId,
  participantId,
  closeConfirmGuestInviteModal,
}: ConfirmGuestInviteModalProps) => {
  const navigate = useNavigate()
  const [trip, setTrip] = useState<Trip | undefined>()

  const confirmInvite = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const data = new FormData(event.currentTarget)
    const name = data.get('name')?.toString()
    const email = data.get('email')?.toString()

    await api.put(`/participants/${participantId}/confirm`, {
      name,
      email,
    })
    navigate(`/trips/${tripId}`)

    window.document.location.reload()
  }

  useEffect(() => {
    const getTripDetails = async () => {
      const response = await api.get(`/trips/${tripId}`)
      const { trip }: { trip: Trip } = response.data
      setTrip(trip)
    }
    getTripDetails()
  }, [tripId])

  const displayedDate =
    trip?.starts_at && trip?.ends_at
      ? format(trip?.starts_at, "d ' de ' LLL", { locale: ptBR })
          .concat(' até ')
          .concat(format(trip?.ends_at, "d ' de ' LLL", { locale: ptBR }))
      : null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="w-[640px] rounded-xl px-6 py-5 shadow-shape bg-zinc-900 space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Confirmar participação</h2>
            <button type="button" onClick={closeConfirmGuestInviteModal}>
              <X className="size-5 text-zinc-400" />
            </button>
          </div>
          <p className="text-sm text-zinc-400">
            Você foi convidado(a) para participar de uma viagem para{' '}
            {trip?.destination}, Brasil nas datas de {displayedDate}.
          </p>
        </div>

        <form onSubmit={confirmInvite} className="space-y-3">
          <div className="h-14 px-4 bg-zinc-950 border-zinc-800 rounded-lg flex items-center gap-2">
            <User className="text-zinc-400 size-5" />
            <input
              type="text"
              name="name"
              placeholder="Seu nome completo"
              className="bg-transparent text-lg placeholder-zinc-400 flex-1 outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-14 flex-1 px-4 bg-zinc-950 border-zinc-800 rounded-lg flex items-center gap-2">
              <Mail className="text-zinc-400 size-5" />
              <input
                type="email"
                name="email"
                placeholder="Seu e-mail"
                className="bg-transparent text-lg placeholder-zinc-400 flex-1 outline-none"
              />
            </div>
          </div>
          <Button type="submit" size="full">
            Confirmar minha presença
          </Button>
        </form>
      </div>
    </div>
  )
}
