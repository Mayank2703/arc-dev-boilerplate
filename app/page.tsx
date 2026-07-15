'use client'

import { useState } from 'react'
import { useAccount, useConnect, useDisconnect, useBalance, useSendTransaction } from 'wagmi'
import { parseUnits, formatUnits } from 'viem'

export default function Home() {
  // Wallet state hooks
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  // Native balance tracker (USDC is the native gas asset on Arc)
  const { data: balance } = useBalance({
    address: address,
  })

  // Transaction execution hook
  const { sendTransaction, data: hash, isPending, isSuccess, error } = useSendTransaction()

  // Local UI form states
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault()
    if (!recipient || !amount) return

    sendTransaction({
      to: recipient as `0x${string}`,
      value: parseUnits(amount, 18)
    })
  }

  // Find the browser extension/MetaMask connector
  const metaMaskConnector = connectors.find((c) => c.id === 'injected')

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Background ambient accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[300px] bg-gradient-to-b from-indigo-500/10 to-transparent blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl z-10 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            Arc L1 Testnet Ecosystem
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            USDC Micro-Tipper
          </h1>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            A developer boilerplate showcasing stablecoin-native gas transactions on Circle's Arc L1 Network.
          </p>
        </div>

        {/* Card Body */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 shadow-2xl backdrop-blur-sm space-y-6">
          
          {/* Wallet State Layer */}
          {!isConnected ? (
            <div className="text-center py-6 space-y-4">
              <p className="text-sm text-slate-400">Connect your Web3 development wallet to begin transacting.</p>
              <button
                onClick={() => metaMaskConnector && connect({ connector: metaMaskConnector })}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-medium text-sm transition-all duration-200 active:scale-[0.98] shadow-lg shadow-indigo-600/20"
              >
                Connect MetaMask Wallet
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Account Overview Widget */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800/50 gap-4">
                <div className="space-y-1">
                  <span className="text-xs text-slate-500 font-mono block">Connected Address</span>
                  <span className="text-sm font-mono text-indigo-300 bg-indigo-950/30 px-2 py-0.5 rounded border border-indigo-900/30">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
                </div>
                <div className="space-y-1 text-left sm:text-right">
                  <span className="text-xs text-slate-500 font-mono block">Native Balance</span>
                  <span className="text-base font-bold text-emerald-400">
                    {balance ? `${parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(2)} ${balance.symbol}` : 'Loading...'}
                  </span>
                </div>
              </div>

              {/* Transaction Processing Form */}
              <form onSubmit={handleTransfer} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 tracking-wide uppercase">
                    Recipient Address
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="0x..."
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm font-mono outline-none transition-all placeholder:text-slate-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 tracking-wide uppercase">
                    Amount (USDC)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      step="0.000001"
                      min="0.000001"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-4 pr-16 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm font-medium outline-none transition-all placeholder:text-slate-600"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 tracking-wider">
                      USDC
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPending || !recipient || !amount}
                  className="w-full py-3.5 rounded-xl bg-slate-100 hover:bg-white text-slate-950 font-semibold text-sm transition-all duration-200 disabled:opacity-40 disabled:hover:bg-slate-100 active:scale-[0.99] flex items-center justify-center gap-2 shadow-xl"
                >
                  {isPending ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-slate-950" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Confirming on Arc...
                    </>
                  ) : (
                    'Execute Native Transfer'
                  )}
                </button>
              </form>

              {/* Status Feedbacks */}
              {isSuccess && hash && (
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-900/40 text-emerald-400 space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider">Transaction Sent Successfully!</p>
                  <a
                    href={`https://testnet.arcscan.app/tx/${hash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-mono underline hover:text-emerald-300 break-all block transition-colors"
                  >
                    View on ArcScan ↗
                  </a>
                </div>
              )}

              {error && (
                <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-900/40 text-rose-400 text-xs space-y-1">
                  <p className="font-bold uppercase tracking-wider">Transaction Failed</p>
                  <p className="font-mono opacity-90 break-words">{error.shortMessage || error.message}</p>
                </div>
              )}

              {/* Disconnect Action */}
              <div className="text-center pt-2">
                <button
                  onClick={() => disconnect()}
                  className="text-xs text-slate-500 hover:text-slate-400 font-medium transition-colors underline underline-offset-4"
                >
                  Disconnect Active Wallet
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Developer Utility Footer Note */}
        <div className="text-center text-[11px] text-slate-600 font-mono tracking-wide">
          Gas tokens are denominated directly in USD value via custom EVM implementations.
        </div>
      </div>
    </main>
  )
}