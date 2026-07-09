import { InertiaLinkProps, Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}: InertiaLinkProps & { active: boolean }) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-blue-600 text-slate-900 focus:border-blue-700'
                    : 'border-transparent text-slate-400 hover:border-blue-200 hover:text-slate-600 focus:border-blue-200 focus:text-slate-600') +
                className
            }
        >
            {children}
        </Link>
    );
}
