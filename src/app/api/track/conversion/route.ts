import { NextRequest, NextResponse } from 'next/server'
import { processConversion } from '@/lib/conversion'

// POST /api/track/conversion
// Legacy path — kept for backward compatibility.
// New path: /api/webhooks/conversion
export async function POST(req: NextRequest) {
  return processConversion(req)
}
