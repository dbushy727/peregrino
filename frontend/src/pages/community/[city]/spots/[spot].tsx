import { useRouter } from 'next/router'

export default function Spot() {
    const router = useRouter()
    const { city, spot } = router.query

    return (
        <h1>
            Spot {spot} in City {city}
        </h1>
    )
}
