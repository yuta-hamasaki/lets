import Link from 'next/link'
import { Icons } from './ui/icons'


export function DashboardCard({ title, description, icon, href }: {
  title: string
  description: string
  icon: React.ReactNode
  href: string
}) {
  return (
    <Link href={href}>
      <div className="group bg-white rounded-xl p-6 shadow-soft border border-gray-100 hover:shadow-medium transition-all duration-300 hover:-translate-y-1 cursor-pointer">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:from-blue-200 group-hover:to-blue-300 transition-colors">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
        <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
          開く
          <Icons.arrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  )
}