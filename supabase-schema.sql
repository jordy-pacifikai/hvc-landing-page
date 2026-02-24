-- ============================================
-- HVC Community Platform - Database Schema
-- Generated: 2026-02-23
-- Project: ogsimsfqwibcmotaeevb
-- ============================================

-- ============================================
-- PART 1: Create tables
-- ============================================

-- CHANNELS
CREATE TABLE IF NOT EXISTS hvc_channels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  icon TEXT,
  position INT DEFAULT 0,
  is_readonly BOOLEAN DEFAULT false,
  min_role TEXT DEFAULT 'member',
  channel_type TEXT DEFAULT 'chat',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- MESSAGES
CREATE TABLE IF NOT EXISTS hvc_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  channel_id UUID NOT NULL REFERENCES hvc_channels(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES hvc_users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  is_edited BOOLEAN DEFAULT false,
  edited_at TIMESTAMPTZ,
  reply_to UUID REFERENCES hvc_messages(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_messages_channel_time ON hvc_messages(channel_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_reply ON hvc_messages(reply_to) WHERE reply_to IS NOT NULL;

-- REACTIONS
CREATE TABLE IF NOT EXISTS hvc_reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES hvc_messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES hvc_users(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(message_id, user_id, emoji)
);
CREATE INDEX IF NOT EXISTS idx_reactions_message ON hvc_reactions(message_id);

-- FORUM POSTS
CREATE TABLE IF NOT EXISTS hvc_forum_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  channel_id UUID NOT NULL REFERENCES hvc_channels(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES hvc_users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  views INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_forum_channel_time ON hvc_forum_posts(channel_id, created_at DESC);

-- FORUM COMMENTS
CREATE TABLE IF NOT EXISTS hvc_forum_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES hvc_forum_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES hvc_users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_forum_comments_post ON hvc_forum_comments(post_id, created_at);

-- NOTIFICATIONS
CREATE TABLE IF NOT EXISTS hvc_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES hvc_users(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES hvc_users(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  channel_id UUID REFERENCES hvc_channels(id) ON DELETE CASCADE,
  message_id UUID REFERENCES hvc_messages(id) ON DELETE CASCADE,
  post_id UUID REFERENCES hvc_forum_posts(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_notif_user_unread ON hvc_notifications(user_id, is_read, created_at DESC);

-- CHANNEL READS
CREATE TABLE IF NOT EXISTS hvc_channel_reads (
  user_id UUID NOT NULL REFERENCES hvc_users(id) ON DELETE CASCADE,
  channel_id UUID NOT NULL REFERENCES hvc_channels(id) ON DELETE CASCADE,
  last_read_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, channel_id)
);

-- ============================================
-- PART 2: ALTER hvc_users
-- ============================================

ALTER TABLE hvc_users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE hvc_users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'member';

-- ============================================
-- PART 3: Seed 38 channels
-- ============================================

INSERT INTO hvc_channels (name, slug, category, icon, position, is_readonly, min_role, channel_type) VALUES
('Bienvenue', 'bienvenue', 'accueil', '👋', 0, true, 'member', 'chat'),
('Regles', 'regles', 'accueil', '📜', 1, true, 'member', 'chat'),
('Annonces', 'annonces', 'accueil', '📢', 2, true, 'member', 'chat'),
('Roles & Avantages', 'roles-et-avantages', 'accueil', '🏷️', 3, true, 'member', 'chat'),
('Discussion Generale', 'discussion-generale', 'communaute', '💬', 0, false, 'member', 'chat'),
('Memes Trading', 'memes-trading', 'communaute', '😂', 1, false, 'member', 'chat'),
('Motivation', 'motivation', 'communaute', '🔥', 2, false, 'member', 'chat'),
('Objectifs Journaliers', 'objectifs-journaliers', 'communaute', '🎯', 3, false, 'member', 'chat'),
('Wins & Losses', 'wins-losses', 'communaute', '🏆', 4, false, 'member', 'chat'),
('Support Technique', 'support-technique', 'formation', '🛠️', 0, false, 'member', 'chat'),
('Questions Debutants', 'questions-debutants', 'formation', '🙋', 1, false, 'member', 'chat'),
('Ressources', 'ressources', 'formation', '📚', 2, false, 'member', 'chat'),
('Journal de Trading', 'journal-de-trading', 'formation', '📓', 3, false, 'member', 'forum'),
('Backtesting', 'backtesting', 'formation', '📊', 4, false, 'member', 'forum'),
('Signaux Live', 'signaux-live', 'trading', '📡', 0, false, 'member', 'chat'),
('Analyses Techniques', 'analyses-techniques', 'trading', '📈', 1, false, 'member', 'forum'),
('Analyses Fondamentales', 'analyses-fondamentales', 'trading', '📰', 2, false, 'member', 'forum'),
('Forex Majors', 'forex-majors', 'trading', '💱', 3, false, 'member', 'chat'),
('Indices & Matieres', 'indices-et-matieres', 'trading', '🏭', 4, false, 'member', 'chat'),
('Crypto', 'crypto', 'trading', '₿', 5, false, 'member', 'chat'),
('Salon Prive', 'salon-prive', 'premium', '👑', 0, false, 'premium', 'chat'),
('Mentorat', 'mentorat', 'premium', '🎓', 1, false, 'premium', 'chat'),
('Live Sessions', 'live-sessions', 'premium', '🎙️', 2, false, 'premium', 'chat'),
('Portfolio Tracker', 'portfolio-tracker', 'premium', '💼', 3, false, 'premium', 'chat'),
('Alertes Avancees', 'alertes-avancees', 'premium', '🚨', 4, false, 'premium', 'chat'),
('MetaTrader Tips', 'metatrader-tips', 'outils', '🖥️', 0, false, 'member', 'chat'),
('TradingView Scripts', 'tradingview-scripts', 'outils', '📐', 1, false, 'member', 'chat'),
('Robots & EA', 'robots-et-ea', 'outils', '🤖', 2, false, 'member', 'chat'),
('Courtiers Comparatif', 'courtiers-comparatif', 'outils', '⚖️', 3, false, 'member', 'chat'),
('Detente', 'detente', 'lifestyle', '🌴', 0, false, 'member', 'chat'),
('Voyages', 'voyages', 'lifestyle', '✈️', 1, false, 'member', 'chat'),
('Fitness', 'fitness', 'lifestyle', '💪', 2, false, 'member', 'chat'),
('Livres & Podcasts', 'livres-podcasts', 'lifestyle', '📖', 3, false, 'member', 'chat'),
('Cuisine', 'cuisine', 'lifestyle', '🍳', 4, false, 'member', 'chat'),
('Log Membres', 'log-membres', 'admin', '📋', 0, true, 'admin', 'chat'),
('Log Moderation', 'log-moderation', 'admin', '🔒', 1, true, 'admin', 'chat'),
('Suggestions', 'suggestions', 'admin', '💡', 2, false, 'member', 'chat'),
('Rapports Bugs', 'rapports-bugs', 'admin', '🐛', 3, false, 'member', 'chat')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- PART 4: RLS Policies
-- ============================================

ALTER TABLE hvc_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE hvc_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE hvc_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE hvc_forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE hvc_forum_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE hvc_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE hvc_channel_reads ENABLE ROW LEVEL SECURITY;

-- Channels: visible to all
CREATE POLICY "channels_read" ON hvc_channels FOR SELECT USING (true);

-- Messages: read all, insert all, delete own
CREATE POLICY "messages_read" ON hvc_messages FOR SELECT USING (true);
CREATE POLICY "messages_insert" ON hvc_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "messages_update" ON hvc_messages FOR UPDATE USING (true);
CREATE POLICY "messages_delete" ON hvc_messages FOR DELETE USING (true);

-- Reactions: read all, insert/delete all (service role)
CREATE POLICY "reactions_read" ON hvc_reactions FOR SELECT USING (true);
CREATE POLICY "reactions_insert" ON hvc_reactions FOR INSERT WITH CHECK (true);
CREATE POLICY "reactions_delete" ON hvc_reactions FOR DELETE USING (true);

-- Forum posts
CREATE POLICY "forum_posts_read" ON hvc_forum_posts FOR SELECT USING (true);
CREATE POLICY "forum_posts_insert" ON hvc_forum_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "forum_posts_update" ON hvc_forum_posts FOR UPDATE USING (true);
CREATE POLICY "forum_posts_delete" ON hvc_forum_posts FOR DELETE USING (true);

-- Forum comments
CREATE POLICY "forum_comments_read" ON hvc_forum_comments FOR SELECT USING (true);
CREATE POLICY "forum_comments_insert" ON hvc_forum_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "forum_comments_delete" ON hvc_forum_comments FOR DELETE USING (true);

-- Notifications: all operations allowed (service role)
CREATE POLICY "notifications_all" ON hvc_notifications FOR ALL USING (true);

-- Channel reads: all operations allowed (service role)
CREATE POLICY "channel_reads_all" ON hvc_channel_reads FOR ALL USING (true);

-- ============================================
-- PART 5: Enable Realtime
-- ============================================

ALTER PUBLICATION supabase_realtime ADD TABLE hvc_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE hvc_reactions;
