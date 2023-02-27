import ApplicationLogo from 'components/ApplicationLogo'
import AuthCard from 'components/AuthCard'
import AuthSessionStatus from 'components/AuthSessionStatus'
import Button from 'components/Button'
import GuestLayout from 'components/Layouts/GuestLayout'
import Input from 'components/Input'
import InputError from 'components/InputError'
import Label from 'components/Label'
import Link from 'next/link'
import { useAuth } from 'hooks/auth'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const Login = () => {
    const router = useRouter()

    const { login } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard',
    })

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [shouldRemember, setShouldRemember] = useState(false)
    const [errors, setErrors] = useState<{
        email: string[]
        password: string[]
    }>()
    const [status, setStatus] = useState<string>()

    useEffect(() => {
        if (router.query.reset && router.query.reset.length > 0 && !errors) {
            const reset =
                typeof router.query.reset === 'string'
                    ? router.query.reset
                    : router.query.reset[0]
            setStatus(atob(reset))
        } else {
            setStatus(undefined)
        }
    }, [router.query, errors])

    const submitForm = async event => {
        event.preventDefault()

        login({
            email,
            password,
            remember: shouldRemember,
            setErrors,
            setStatus,
        })
    }

    return (
        <GuestLayout>
            <div className="hidden fixed top-0 right-0 px-6 py-4 sm:block">
                <Link
                    href="/auth/register"
                    className="ml-4 text-sm text-gray-700 underline">
                    Sign Up
                </Link>
            </div>
            <AuthCard
                logo={
                    <Link href="/">
                        <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" />
                    </Link>
                }>
                {/* Session Status */}
                <AuthSessionStatus className="mb-4" status={status} />

                <form onSubmit={submitForm}>
                    {/* Email Address */}
                    <div>
                        <Label htmlFor="email">Email</Label>

                        <Input
                            id="email"
                            type="email"
                            value={email}
                            className="block mt-1 w-full"
                            onChange={event => setEmail(event.target.value)}
                            required
                            autoFocus
                        />

                        {errors?.email && (
                            <InputError
                                messages={errors.email}
                                className="mt-2"
                            />
                        )}
                    </div>

                    {/* Password */}
                    <div className="mt-4">
                        <Label htmlFor="password">Password</Label>

                        <Input
                            id="password"
                            type="password"
                            value={password}
                            className="block mt-1 w-full"
                            onChange={event => setPassword(event.target.value)}
                            required
                            autoComplete="current-password"
                        />

                        {errors?.password && (
                            <InputError
                                messages={errors.password}
                                className="mt-2"
                            />
                        )}
                    </div>

                    {/* Remember Me */}
                    <div className="block mt-4">
                        <label
                            htmlFor="remember_me"
                            className="inline-flex items-center">
                            <input
                                id="remember_me"
                                type="checkbox"
                                name="remember"
                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                onChange={event =>
                                    setShouldRemember(event.target.checked)
                                }
                            />

                            <span className="ml-2 text-sm text-gray-600">
                                Remember me
                            </span>
                        </label>
                    </div>

                    <div className="flex items-center justify-end mt-4">
                        <Link
                            href="/auth/forgot-password"
                            className="underline text-sm text-gray-600 hover:text-gray-900">
                            Forgot your password?
                        </Link>

                        <Button className="ml-3">Login</Button>
                    </div>
                </form>
            </AuthCard>
        </GuestLayout>
    )
}

export default Login
