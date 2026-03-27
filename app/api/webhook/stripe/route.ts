import { NextRequest, NextResponse } from 'next/server'

// TODO: MIGRATION — Stan Store webhooks will replace this Stripe webhook handler.
// Configure Stan Store webhook to POST to /api/webhook/stan with payment events.
// This handler is kept active for existing Stripe subscribers (cancellations, renewals).

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN!
const DISCORD_GUILD_ID = '1472369949141106806'
const DISCORD_PREMIUM_ROLE_ID = '1475058567479427157'

const COMMUNITY_SUPABASE_URL = 'https://antogqfovjlkilqgiwdk.supabase.co'
const COMMUNITY_SUPABASE_SERVICE_KEY = process.env.COMMUNITY_SUPABASE_SERVICE_KEY!
const BREVO_API_KEY = process.env.BREVO_API_KEY

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

async function activateCommunityUser(email: string, stripeSubscriptionId: string) {
  try {
    const res = await fetch(`${COMMUNITY_SUPABASE_URL}/rest/v1/rpc/activate_paypal_subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': COMMUNITY_SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${COMMUNITY_SUPABASE_SERVICE_KEY}`,
      },
      body: JSON.stringify({
        p_email: email,
        p_subscription_id: stripeSubscriptionId,
        p_payer_id: null,
      }),
    })
    const data = await res.json()
    console.log(`[Webhook] Community activation for ${email}:`, data)

    if (data?.user_exists === false && BREVO_API_KEY) {
      await sendWelcomeEmail(email)
    }

    return data
  } catch (err) {
    console.error(`[Webhook] Community activation failed for ${email}:`, err)
  }
}

async function sendWelcomeEmail(email: string) {
  try {
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'High Value Capital', email: 'newsletter@highvaluecapital.club' },
        to: [{ email }],
        subject: 'Bienvenue dans la communaute HVC !',
        htmlContent: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#0a0a0a;color:#e8e4dc;">
          <img src="https://www.highvaluecapital.club/logo-hvc-gradient.png" alt="High Value Capital" style="width:160px;margin-bottom:24px;" />
          <h2 style="color:#d4a843;">Bienvenue dans la communaute HVC !</h2>
          <p>Ton acces Premium est active. Voici ce qui t'attend :</p>
          <ul>
            <li>Formation complete ARD (20+ heures de contenu)</li>
            <li>Communaute privee Premium</li>
            <li>Analyses de trades personnalisees</li>
          </ul>
          <p>Connecte-toi avec ton email (<strong>${email}</strong>) — tu recevras un code OTP :</p>
          <a href="https://community.highvaluecapital.club/login" style="display:inline-block;padding:12px 24px;background:#d4a843;color:#0a0a0a;text-decoration:none;border-radius:8px;font-weight:bold;margin-top:12px;">Se connecter</a>
          <p style="margin-top:24px;color:#888;font-size:12px;">High Value Capital — Formation Trading Premium</p>
        </div>`,
      }),
    })
    console.log(`[Webhook] Welcome email sent to ${email}`)
  } catch (err) {
    console.error(`[Webhook] Welcome email failed for ${email}:`, err)
  }
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

    // Activate community user via Supabase
    const customerEmail = session.customer_details?.email || session.customer_email
    if (customerEmail && COMMUNITY_SUPABASE_SERVICE_KEY) {
      await activateCommunityUser(customerEmail, session.subscription || session.id)
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
