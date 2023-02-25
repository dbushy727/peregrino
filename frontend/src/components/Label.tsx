import { LabelHTMLAttributes } from 'react'

const Label = ({
    className,
    children,
    ...props
}: LabelHTMLAttributes<HTMLLabelElement>) => (
    <label
        className={`${className} block font-medium text-sm text-gray-700`}
        {...props}>
        {children}
    </label>
)

export default Label
