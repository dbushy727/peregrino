import { useRouter } from 'next/router'

export default function Places() {
    const router = useRouter()
    const { city } = router.query

    return <h1>Spots in {city}</h1>
}
