import React, { useState } from 'react';

export interface BlackBoxBlock {
  step_id: number;
  step_name: string;
  payload: Record<string, any>;
  prev_hash: string;
  hash: string;
  timestamp: number;
}

interface BlackBoxTimelineProps {
  chain: BlackBoxBlock[];
  isChainValid?: boolean;
}

export const BlackBoxTimeline: React.FC<BlackBoxTimelineProps> = ({ chain, isChainValid = true }) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [isSynced, setIsSynced] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const toggleStep = (stepId: number) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  const copyToClipboard = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleSyncWithGroundControl = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setIsSynced(true);
    }, 1800);
  };

  const formatHash = (hash: string) => {
    if (!hash) return '0000...0000';
    if (hash === '0'.repeat(64)) return 'GENESIS BLOCK';
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
  };

  if (!chain || chain.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 p-4 text-center text-slate-500 backdrop-blur">
        <p className="font-mono text-xs uppercase tracking-wider">BLACK BOX INACTIVE // AWAITING ANOMALY EVENT LEDGER</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-800/80 bg-slate-950/90 p-4 shadow-2xl backdrop-blur text-slate-200">
      <div className="mb-5 p-3 rounded-lg border border-slate-800 bg-slate-900/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isSynced ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'}`} />
          <div>
            <p className="text-xs font-mono font-semibold text-slate-200 uppercase">
              {isSynced ? 'GROUND CONTROL SYNCED' : 'LOCAL LEDGER STORED (OFFLINE QUEUE)'}
            </p>
            <p className="text-[10px] font-mono text-slate-400">
              {isSynced
                ? `All ${chain.length} blocks uploaded to Ground Station Telemetry DB`
                : `${chain.length} un-synced block(s) cached in satellite memory`}
            </p>
          </div>
        </div>

        <button
          onClick={handleSyncWithGroundControl}
          disabled={isSynced || isSyncing}
          className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold transition-all flex items-center gap-2 ${
            isSynced
              ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-400 cursor-default'
              : isSyncing
              ? 'bg-sky-950 border-sky-700 text-sky-300 animate-pulse'
              : 'bg-sky-900/60 border-sky-700 hover:bg-sky-800 text-sky-200'
          }`}
        >
          {isSyncing ? 'UPLINKING TO GROUND...' : isSynced ? '✓ SYNC COMPLETE' : 'SYNC WITH GROUND CONTROL'}
        </button>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 rounded-lg border ${isChainValid ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-white tracking-wide uppercase text-xs">Black Box Ledger</h3>
            <p className="font-mono text-[10px] text-slate-400">SHA-256 Hash Chain</p>
          </div>
        </div>

        <div className={`px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-semibold flex items-center gap-1.5 ${
          isChainValid 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
            : 'bg-rose-500/10 border-rose-500/30 text-rose-400 animate-pulse'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isChainValid ? 'bg-emerald-400' : 'bg-rose-500'}`} />
          {isChainValid ? 'VERIFIED' : 'TAMPER DETECTED'}
        </div>
      </div>

      {/* Scrollable Chain Timeline */}
      <div className="max-h-[420px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
        {chain.map((block, index) => {
          const isExpanded = expandedStep === block.step_id;

          return (
            <div key={block.step_id} className="relative">
              {/* SHA-256 Link Divider */}
              {index > 0 && (
                <div className="flex items-center justify-center -my-1 py-1">
                  <div className="h-3 w-0.5 bg-sky-500/30" />
                  <span className="absolute bg-slate-950 px-1.5 py-0.5 border border-sky-500/30 rounded text-[9px] font-mono text-sky-400">
                    SHA-256 LINK
                  </span>
                </div>
              )}

              {/* Step Card */}
              <div 
                onClick={() => toggleStep(block.step_id)}
                className={`cursor-pointer rounded-lg border transition-all duration-150 overflow-hidden ${
                  isExpanded 
                    ? 'border-sky-500/50 bg-slate-900/90 shadow-md' 
                    : 'border-slate-800/80 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/70'
                }`}
              >
                {/* Header */}
                <div className="p-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded bg-sky-500/10 border border-sky-500/30 text-sky-400 font-mono text-[11px] font-bold">
                      #{block.step_id}
                    </span>
                    <div className="min-w-0">
                      <h4 className="font-mono text-xs font-semibold text-slate-200 truncate">{block.step_name}</h4>
                      <p className="text-[10px] text-slate-500 font-mono">
                        {new Date(block.timestamp * 1000).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  {/* Hash Info & Icons */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-right font-mono">
                      <div className="text-[11px] text-sky-400 font-medium">{formatHash(block.hash)}</div>
                      <div className="text-[9px] text-slate-500">Prev: {formatHash(block.prev_hash)}</div>
                    </div>

                    <button
                      onClick={(e) => copyToClipboard(block.hash, e)}
                      title="Copy Hash"
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
                    >
                      {copiedHash === block.hash ? (
                        <span className="text-emerald-400 text-[9px] font-mono">Copied</span>
                      ) : (
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-3.5 h-3.5">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>

                    {/* Chevron icon with fixed width/height */}
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Expanded Payload */}
                {isExpanded && (
                  <div className="border-t border-slate-800/80 bg-slate-950/80 p-3 space-y-2 font-mono text-[11px]">
                    <div>
                      <span className="text-slate-500 block mb-0.5 text-[10px]">BLOCK HASH:</span>
                      <div className="bg-slate-900 border border-slate-800/80 p-1.5 rounded text-sky-300 break-all select-all text-[10px]">
                        {block.hash}
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-500 block mb-0.5 text-[10px]">PREVIOUS HASH:</span>
                      <div className="bg-slate-900 border border-slate-800/80 p-1.5 rounded text-slate-400 break-all select-all text-[10px]">
                        {block.prev_hash}
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-500 block mb-0.5 text-[10px]">RECORDED PAYLOAD:</span>
                      <pre className="bg-slate-900 border border-slate-800/80 p-2 rounded text-emerald-400 overflow-x-auto text-[10px]">
                        {JSON.stringify(block.payload, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};