import { Calendar, MapPin, Settings2, X } from 'lucide-react'
import { Button } from '../../components/button'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { api } from '../../lib/axios'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { DateRange, DayPicker } from 'react-day-picker'

interface Trip {
  destination: string
  starts_at: string
  ends_at: string
  is_confirmed: boolean
}

export function DestinationAndDateHeader() {
  const { tripId } = useParams()
  const [trip, setTrip] = useState<Trip | undefined>()
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [eventStartAndEndDates, setEventStartAndEndDates] = useState<
    DateRange | undefined
  >()

  const openDatePicker = () => {
    setIsDatePickerOpen(true)
  }

  const closeDatePicker = () => {
    setIsDatePickerOpen(false)
  }

  const changeTripDate = async () => {
    await api.put(`/trips/${tripId}`, {
      destination: trip?.destination,
      starts_at: eventStartAndEndDates?.from,
      ends_at: eventStartAndEndDates?.to,
    })

    window.document.location.reload()
  }

  useEffect(() => {
    async function getTripDetails() {
      const response = await api.get(`/trips/${tripId}`)
      const { trip }: { trip: Trip } = response.data
      setTrip(trip)
      setEventStartAndEndDates({
        from: new Date(trip.starts_at),
        to: new Date(trip.ends_at),
      })
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
    <div className="px-4 h-16 rounded-xl bg-zinc-900 shadow-shape flex items-center justify-between">
      <div className="flex items-center gap-2">
        <MapPin className="size-5 text-zinc-400" />
        <span className="text-zinc-100">{trip?.destination}</span>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <Calendar className="size-5 text-zinc-400" />
          <span className="text-zinc-100">{displayedDate}</span>
        </div>

        <div className="w-px h-6 bg-zinc-800" />

        <Button
          onClick={openDatePicker}
          variant="secondary"
          className="flex items-center gap-2 text-left w-[240px]"
        >
          Alterar local/data
          <Settings2 className="size-5" />
        </Button>
      </div>

      {isDatePickerOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="rounded-xl px-6 py-5 shadow-shape bg-zinc-900 space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Selecione a data</h2>
                <button type="button" onClick={closeDatePicker}>
                  <X className="size-5 text-zinc-400" />
                </button>
              </div>
            </div>

            <DayPicker
              mode="range"
              selected={eventStartAndEndDates}
              onSelect={setEventStartAndEndDates}
            />
            <div>
              <Button onClick={changeTripDate} size="full">
                Confirmar alteração
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
