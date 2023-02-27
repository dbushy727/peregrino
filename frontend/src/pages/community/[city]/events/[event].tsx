import { useRouter } from 'next/router'

export default function Event() {
    const router = useRouter()
    const { city, event } = router.query

    return (
        <h1>
            Event {event} in City {city}
        </h1>
    )
}
