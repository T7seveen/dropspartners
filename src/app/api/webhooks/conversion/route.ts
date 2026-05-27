import { NextRequest } from 'next/server'
import { processConversion } from '@/lib/conversion'

// POST /api/webhooks/conversion
// Primary endpoint for advertiser conversion webhooks.
// See also: /api/track/conversion (legacy path, same logic)
export async function POST(req: NextRequest) {
  return processConversion(req)
}
