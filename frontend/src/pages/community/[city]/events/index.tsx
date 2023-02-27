import { useRouter } from 'next/router'

export default function Events() {
    const router = useRouter()
    const { city } = router.query

    return <h1>Events for {city}</h1>
}
