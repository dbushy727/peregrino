import useSWR from 'swr'
import axios from 'lib/axios'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { useRouter } from 'next/router'

type ErrorSetter<T extends Record<string, string[]>> = Dispatch<
    SetStateAction<T | undefined>
>
type StatusSetter = Dispatch<SetStateAction<string | undefined>>

export interface User {
    id: number
    name: string
    email: string
    email_verified_at: string | null
    created_at: string
    updated_at: string
}

export const useAuth = ({
    middleware,
    redirectIfAuthenticated,
}: { middleware?: string; redirectIfAuthenticated?: string } = {}) => {
    const router = useRouter()

    const { data: user, error, mutate } = useSWR<User, unknown>(
        '/api/user',
        () =>
            axios
                .get('/api/user')
                .then(res => res.data)
                .catch(error => {
                    if (error.response.status !== 409) throw error

                    router.push('/auth/verify-email')
                }),
    )

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const register = async ({
        setErrors,
        email,
        password,
    }: {
        name: string
        email: string
        password: string
        password_confirmation: string
    } & {
        setErrors: ErrorSetter<{ email: string[]; password: string[] }>
    }) => {
        await csrf()

        setErrors(undefined)

        axios
            .post('/register', { email, password })
            .then(() => mutate())
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const login = async ({
        setErrors,
        setStatus,
        email,
        password,
        remember,
    }: {
        setErrors: ErrorSetter<{ email: string[]; password: string[] }>
        setStatus: StatusSetter
        email: string
        password: string
        remember: boolean
    }) => {
        await csrf()

        setErrors(undefined)
        setStatus(undefined)

        axios
            .post('/login', { email, password, remember })
            .then(() => mutate())
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const forgotPassword = async ({
        setErrors,
        setStatus,
        email,
    }: {
        setErrors: ErrorSetter<{ email: string[] }>
        setStatus: StatusSetter
        email: string
    }) => {
        await csrf()

        setErrors(undefined)
        setStatus(undefined)

        axios
            .post('/forgot-password', { email })
            .then(response => setStatus(response.data.status))
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const resetPassword = async ({
        setErrors,
        setStatus,
        email,
        password,
        password_confirmation,
    }: {
        setErrors: ErrorSetter<{ email: string[] }>
        setStatus: StatusSetter
        email: string
        password: string
        password_confirmation: string
    }) => {
        await csrf()

        setErrors(undefined)
        setStatus(undefined)

        axios
            .post('/reset-password', { token: router.query.token, email })
            .then(response =>
                router.push('/auth/login?reset=' + btoa(response.data.status)),
            )
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const resendEmailVerification = ({
        setStatus,
    }: {
        setStatus: StatusSetter
    }) => {
        axios
            .post('/email/verification-notification')
            .then(response => setStatus(response.data.status))
    }

    const logout = async () => {
        if (!error && user) {
            await axios.post('/logout').then(() => mutate())
        }

        window.location.pathname = '/auth/login'
    }

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user)
            router.push(redirectIfAuthenticated)
        if (
            window.location.pathname === '/verify-email' &&
            user?.email_verified_at
        )
            router.push(redirectIfAuthenticated || '/')
        if (middleware === 'auth' && (error || !user)) logout()
    }, [user, error])

    return {
        user,
        register,
        login,
        forgotPassword,
        resetPassword,
        resendEmailVerification,
        logout,
    }
}
