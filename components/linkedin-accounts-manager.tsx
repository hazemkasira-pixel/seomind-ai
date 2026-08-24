'use client'

import { useState, useEffect } from 'react'
import { Linkedin, Plus, Trash2, ToggleLeft, ToggleRight, Clock, Calendar, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

export function LinkedInAccountsManager() {
  const [accounts, setAccounts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    try {
      const response = await fetch('/api/linkedin-accounts')
      const data = await response.json()
      if (response.ok) setAccounts(data.data || [])
    } catch (error) {
      console.error('Error fetching accounts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConnectLinkedIn = () => {
    // هنا هنعمل LinkedIn OAuth
    const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(window.location.origin + '/api/linkedin/callback')}&scope=w_member_social,r_liteprofile`
    window.location.href = linkedinAuthUrl
  }

  const toggleAutoPublish = async (accountId: string, currentStatus: boolean) => {
    try {
      const response = await fetch('/api/linkedin-accounts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: accountId, auto_publish: !currentStatus }),
      })
      
      if (response.ok) {
        fetchAccounts()
        toast.success(!currentStatus ? 'Auto-publish enabled' : 'Auto-publish disabled')
      }
    } catch (error) {
      toast.error('Failed to update settings')
    }
  }

  const disconnectAccount = async (accountId: string) => {
    if (!confirm('Are you sure you want to disconnect this account?')) return
    
    try {
      const response = await fetch('/api/linkedin-accounts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: accountId }),
      })
      
      if (response.ok) {
        fetchAccounts()
        toast.success('Account disconnected')
      }
    } catch (error) {
      toast.error('Failed to disconnect')
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Linkedin className="h-6 w-6 text-[#0077b5]" />
            LinkedIn Accounts
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Connect your LinkedIn accounts for automatic publishing
          </p>
        </div>
        <button
          onClick={handleConnectLinkedIn}
          className="inline-flex items-center gap-2 rounded-lg bg-[#0077b5] px-4 py-2 text-sm font-semibold text-white hover:bg-[#006699] transition"
        >
          <Plus className="h-4 w-4" />
          Connect LinkedIn
        </button>
      </div>

      {/* Accounts List */}
      {accounts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <Linkedin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No LinkedIn accounts connected</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Connect your personal or company LinkedIn account to enable auto-publishing
          </p>
          <button
            onClick={handleConnectLinkedIn}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0077b5] px-6 py-3 text-sm font-semibold text-white hover:bg-[#006699] transition"
          >
            <Plus className="h-4 w-4" />
            Connect Your First Account
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {accounts.map((account) => (
            <div key={account.id} className="rounded-2xl border border-border bg-card/50 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-[#0077b5]/10 flex items-center justify-center">
                    <Linkedin className="h-6 w-6 text-[#0077b5]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{account.account_name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        account.account_type === 'personal' 
                          ? 'bg-blue-500/10 text-blue-600' 
                          : 'bg-purple-500/10 text-purple-600'
                      }`}>
                        {account.account_type === 'personal' ? 'Personal' : 'Company'}
                      </span>
                      {account.profile_url && (
                        <a href={account.profile_url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-teal flex items-center gap-1">
                          <ExternalLink className="h-3 w-3" />
                          View Profile
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleAutoPublish(account.id, account.auto_publish)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/50 hover:bg-background transition"
                  >
                    {account.auto_publish ? (
                      <ToggleRight className="h-5 w-5 text-teal" />
                    ) : (
                      <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span className="text-xs font-medium">
                      {account.auto_publish ? 'Auto ON' : 'Auto OFF'}
                    </span>
                  </button>
                  <button
                    onClick={() => disconnectAccount(account.id)}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Settings */}
              <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Preferred time: <strong className="text-foreground">{account.preferred_posting_time || '9:00 AM'}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Posting days: <strong className="text-foreground">{account.posting_days?.length || 5} days/week</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}