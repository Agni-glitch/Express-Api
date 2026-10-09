import { useApi } from '../hooks/useApi.js'
import { Alert, EmptyState, Loading, PageHeader } from '../components/ui.jsx'

export default function AdminUsers() {
  const { data, error, loading } = useApi('/users/getAllUsers')
  const users = data?.data.users || []

  return (
    <div>
      <PageHeader title="Users" subtitle={data ? `${users.length} active ${users.length === 1 ? 'account' : 'accounts'}` : undefined} />

      {loading ? (
        <Loading />
      ) : error ? (
        <Alert>{error.message}</Alert>
      ) : users.length === 0 ? (
        <EmptyState title="No users yet" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-800">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="bg-zinc-900 text-xs uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-zinc-900/60">
                  <td className="px-4 py-3 font-medium text-zinc-100">{u.name}</td>
                  <td className="px-4 py-3 text-zinc-300">{u.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-medium ${
                        u.role === 'admin' ? 'bg-amber-400/15 text-amber-300' : 'bg-zinc-800 text-zinc-300'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
