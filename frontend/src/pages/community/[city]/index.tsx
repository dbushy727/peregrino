import { useRouter } from 'next/router'

export default function City() {
    const router = useRouter()
    const { city } = router.query

    return <h1>{city}</h1>
}
