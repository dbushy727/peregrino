import Axios from 'axios'

const axios = Axios.create({
    baseURL:
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        `https://api-${process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF}.penguin.nyc`,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
})

export default axios
