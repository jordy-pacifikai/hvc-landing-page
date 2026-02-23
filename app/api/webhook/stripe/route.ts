import { NextRequest, NextResponse } from 'next/server'

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN!
const DISCORD_GUILD_ID = '1472369949141106806'
const DISCORD_PREMIUM_ROLE_ID = '1475058567479427157'

async function verifyStripeSignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  const parts = signature.split(',')
  const timestamp = parts.find(p => p.startsWith('t='))?.slice(2)
  const v1Sig = parts.find(p => p.startsWith('v1='))?.slice(3)
  if (!timestamp || !v1Sig) return false

  const age = Math.floor(Date.now() / 1000) - parseInt(timestamp)
  if (age > 300) return false

  const signedPayload = `${timestamp}.${payload}`
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(signedPayload))
  const computed = Array.from(new Uint8Array(sig))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')

  return computed === v1Sig
}

async function addToGuildWithRole(discordUserId: string, accessToken: string) {
  // Try to add user to guild with Premium role
  const joinRes = await fetch(
    `https://discord.com/api/v10/guilds/${DISCORD_GUILD_ID}/members/${discordUserId}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: accessToken,
        roles: [DISCORD_PREMIUM_ROLE_ID],
      }),
    }
  )

  if (joinRes.status === 201) {
    console.log(`[Webhook] Added Discord user ${discordUserId} to guild with @Premium`)
    return
  }

  // User already in guild (204) — just assign role
  if (joinRes.status === 204 || joinRes.status === 200) {
    await fetch(
      `https://discord.com/api/v10/guilds/${DISCORD_GUILD_ID}/members/${discordUserId}/roles/${DISCORD_PREMIUM_ROLE_ID}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    )
    console.log(`[Webhook] Discord user ${discordUserId} already in guild, assigned @Premium`)
  }
}

async function removePremiumRole(discordUserId: string) {
  await fetch(
    `https://discord.com/api/v10/guilds/${DISCORD_GUILD_ID}/members/${discordUserId}/roles/${DISCORD_PREMIUM_ROLE_ID}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bot ${DISCORD_BOT_TOKEN}` },
    }
  )
  console.log(`[Webhook] Removed @Premium from Discord user ${discordUserId}`)
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature || !STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  const valid = await verifyStripeSignature(body, signature, STRIPE_WEBHOOK_SECRET)
  if (!valid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const event = JSON.parse(body)

  // Payment completed — assign @Premium role
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const discordUserId = session.metadata?.discord_user_id

    if (discordUserId) {
      // Store discord info on customer for future reference (cancellation)
      if (session.customer) {
        await fetch(`https://api.stripe.com/v1/customers/${session.customer}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            'metadata[discord_user_id]': discordUserId,
            'metadata[discord_username]': session.metadata?.discord_username || '',
          }),
        })
      }

      // Get the discord token from subscription metadata to use guilds.join
      let discordToken = ''
      if (session.subscription) {
        const subRes = await fetch(
          `https://api.stripe.com/v1/subscriptions/${session.subscription}`,
          { headers: { Authorization: `Bearer ${STRIPE_SECRET_KEY}` } }
        )
        if (subRes.ok) {
          const sub = await subRes.json()
          discordToken = sub.metadata?.discord_token || ''
        }
      }

      if (discordToken) {
        await addToGuildWithRole(discordUserId, discordToken)
      } else {
        // Fallback: just assign role (user must already be in guild)
        await fetch(
          `https://discord.com/api/v10/guilds/${DISCORD_GUILD_ID}/members/${discordUserId}/roles/${DISCORD_PREMIUM_ROLE_ID}`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
              'Content-Type': 'application/json',
            },
          }
        )
        console.log(`[Webhook] Assigned @Premium to ${discordUserId} (no token, role only)`)
      }
    } else {
      console.log(`[Webhook] No discord_user_id in session ${session.id}`)
    }
  }

  // Subscription cancelled — remove @Premium role
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object
    const customerId = subscription.customer

    if (customerId) {
      const customerRes = await fetch(
        `https://api.stripe.com/v1/customers/${customerId}`,
        { headers: { Authorization: `Bearer ${STRIPE_SECRET_KEY}` } }
      )
      if (customerRes.ok) {
        const customer = await customerRes.json()
        const discordUserId = customer.metadata?.discord_user_id
        if (discordUserId) {
          await removePremiumRole(discordUserId)
        }
      }
    }
  }

  return NextResponse.json({ received: true })
}
