import { Plus } from 'lucide-react'
import { FormEvent, useEffect, useState } from 'react'
import { CreateActivityModal } from './create-activity-modal'
import { ImportantLinks } from './important-links'
import { Guests } from './guests'
import { Activities } from './activities'
import { DestinationAndDateHeader } from './destination-and-date-header'
import { useLocation, useParams } from 'react-router-dom'
import { ConfirmGuestInviteModal } from './confirm-guest-invite-modal'
import { api } from '../../lib/axios'
import { ManageGuestsModal } from './manage-guests-modal'

export function TripDetailsPage() {
  const location = useLocation()
  const { tripId } = useParams()
  const [isCreateActivityModalOpen, setIsCreateActivityModalOpen] =
    useState(false)
  const [participantId, setParticipantId] = useState('')
  const [isConfirmGuestInviteModalOpen, setIsConfirmGuestInviteModalOpen] =
    useState(false)

  const [isGuestsModalOpen, setIsGuestsModalOpen] = useState(false)
  const [emailsToInvite, setEmailsToInvite] = useState<string[]>([])

  function openGuestsModal() {
    setIsGuestsModalOpen(true)
  }

  function closeGuestsModal() {
    setIsGuestsModalOpen(false)
  }

  function addNewEmailToInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const data = new FormData(event.currentTarget)
    const email = data.get('email')?.toString()

    if (!email) {
      return
    }

    if (emailsToInvite.includes(email)) {
      return
    }

    setEmailsToInvite([...emailsToInvite, email])

    event.currentTarget.reset()
  }

  function removeEmailFromInvites(emailToRemove: string) {
    const newEmailList = emailsToInvite.filter(
      (email) => email !== emailToRemove,
    )
    setEmailsToInvite(newEmailList)
  }

  function openActivityModal() {
    setIsCreateActivityModalOpen(true)
  }

  function closeActivityModal() {
    setIsCreateActivityModalOpen(false)
  }

  function closeConfirmGuestInviteModal() {
    setIsConfirmGuestInviteModalOpen(false)
    setParticipantId('')
  }

  const inviteGuests = async () => {
    await Promise.all([
      emailsToInvite.map(async (email) => {
        await api.post(`/trips/${tripId}/invites`, { email })
      }),
    ])

    window.location.reload()
  }

  useEffect(() => {
    const query = new URLSearchParams(location.search)
    const participantIdFromQuery = query.get('participantId')
    if (participantIdFromQuery) {
      setParticipantId(participantIdFromQuery)
      setIsConfirmGuestInviteModalOpen(true)
    }
  }, [location])

  return (
    <div className="max-w-6xl px-6 py-10 mx-auto space-y-8">
      <DestinationAndDateHeader />
      <main className="flex gap-16 px-4">
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-semibold">Atividades</h2>
            <button
              onClick={openActivityModal}
              className="bg-lime-300 text-lime-950 rounded-lg py-2 px-5 font-medium flex items-center gap-2 hover:bg-lime-400"
            >
              <Plus className="size-5" />
              Cadastrar atividade
            </button>
          </div>
          <Activities />
        </div>

        <div className="w-80 space-y-6">
          <ImportantLinks />
          <div className="w-full h-px bg-zinc-800" />
          <Guests openGuestsModal={openGuestsModal} />
        </div>
      </main>

      {isCreateActivityModalOpen && (
        <CreateActivityModal closeActivityModal={closeActivityModal} />
      )}

      {isGuestsModalOpen && (
        <ManageGuestsModal
          inviteGuests={inviteGuests}
          closeGuestsModal={closeGuestsModal}
          emailsToInvite={emailsToInvite}
          addNewEmailToInvite={addNewEmailToInvite}
          removeEmailFromInvites={removeEmailFromInvites}
        />
      )}

      {isConfirmGuestInviteModalOpen && tripId && (
        <ConfirmGuestInviteModal
          tripId={tripId}
          participantId={participantId}
          closeConfirmGuestInviteModal={closeConfirmGuestInviteModal}
        />
      )}
    </div>
  )
}
