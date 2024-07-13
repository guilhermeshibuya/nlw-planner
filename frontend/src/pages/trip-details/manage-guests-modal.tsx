import { AtSign, Plus, X } from 'lucide-react'
import { FormEvent } from 'react'
import { Button } from '../../components/button'

interface ManageGuestsModalProps {
  closeGuestsModal: () => void
  emailsToInvite: string[]
  addNewEmailToInvite: (event: FormEvent<HTMLFormElement>) => void
  removeEmailFromInvites: (email: string) => void
  inviteGuests: () => void
}

export function ManageGuestsModal({
  closeGuestsModal,
  emailsToInvite,
  addNewEmailToInvite,
  removeEmailFromInvites,
  inviteGuests,
}: ManageGuestsModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="w-[640px] rounded-xl px-6 py-5 shadow-shape bg-zinc-900 space-y-5">
        {/* HEADER MODAL */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Selecionar convidados</h2>
            <button type="button" onClick={closeGuestsModal}>
              <X className="size-5 text-zinc-400" />
            </button>
          </div>
          <p className="text-sm text-zinc-400">
            Os convidados irão receber e-mails para confirmar a participação na
            viagem.
          </p>
        </div>

        {/* DIV PARA EXIBIR OS EMAILS CONVIDADOS */}
        <div className="flex flex-wrap gap-2">
          {emailsToInvite.map((email) => (
            <div
              key={email}
              className="py-1.5 px-2.5 rounded-md bg-zinc-800 flex items-center gap-2"
            >
              <span className="text-zinc-300">{email}</span>
              <button
                onClick={() => removeEmailFromInvites(email)}
                type="button"
              >
                <X className="size-4 text-zinc-400" />
              </button>
            </div>
          ))}
        </div>

        <div className="w-full h-px bg-zinc-800" />
        {/* FORM PARA PREENCHER EMAIL CONVIDADOS */}
        <form
          onSubmit={addNewEmailToInvite}
          className="p-2.5 bg-zinc-950 border-zinc-800 rounded-lg flex items-center gap-2"
        >
          <div className="px-2 flex items-center flex-1 gap-2">
            <AtSign className="text-zinc-400 size-5" />
            <input
              type="email"
              name="email"
              placeholder="Digite o e-mail do convidado"
              className="bg-transparent text-lg placeholder-zinc-400 flex-1 outline-none"
            />
          </div>
          <Button type="submit">
            Convidar
            <Plus className="size-5" />
          </Button>
        </form>

        <Button onClick={inviteGuests} size="full">
          Enviar convites
        </Button>
      </div>
    </div>
  )
}
