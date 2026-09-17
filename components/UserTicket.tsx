'use client';

import React from 'react';
import QRCode from 'react-qr-code';

interface UserTicketProps {
  userId: string;
}

export function UserTicket({ userId }: UserTicketProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md max-w-sm w-full mx-auto flex flex-col items-center text-center">
      <div className="absolute inset-0 bg-gradient-to-br from-[#ff2fd3]/10 to-[#23e6ff]/10 opacity-50 pointer-events-none" />
      
      <div className="z-10 w-full space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">Event Ticket</h2>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Present at Entry</p>
        </div>

        <div className="bg-white p-4 rounded-xl inline-block shadow-lg border-4 border-white/20">
          <QRCode
            value={userId}
            size={200}
            level="H"
            className="rounded"
            style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
          />
        </div>

        <div>
          <p className="text-[10px] text-slate-500 font-mono tracking-wider opacity-60">
            {userId}
          </p>
        </div>
      </div>
    </div>
  );
}
