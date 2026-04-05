-- ============================================================
-- Research Management Platform: Initial Schema
-- ============================================================

-- 研究機関 (institutions)
CREATE TABLE IF NOT EXISTS institutions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  location    TEXT,
  description TEXT,
  contact     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at  TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_institutions_name
  ON institutions(name)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_institutions_created_at
  ON institutions(created_at DESC)
  WHERE deleted_at IS NULL;

-- 研究テーマ (themes)
CREATE TABLE IF NOT EXISTS themes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  status      TEXT NOT NULL DEFAULT 'active'
              CHECK (status IN ('active', 'completed', 'pending')),
  start_date  DATE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at  TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_themes_status
  ON themes(status)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_themes_created_at
  ON themes(created_at DESC)
  WHERE deleted_at IS NULL;

-- 投資家 (investors)
CREATE TABLE IF NOT EXISTS investors (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  investor_type    TEXT NOT NULL
                   CHECK (investor_type IN ('individual', 'corporate')),
  contact          TEXT,
  investment_field TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at       TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_investors_investor_type
  ON investors(investor_type)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_investors_created_at
  ON investors(created_at DESC)
  WHERE deleted_at IS NULL;

-- ============================================================
-- 中間テーブル（多対多関連付け）
-- PRIMARY KEY (複合) による重複防止
-- ============================================================

-- 研究機関 ↔ 研究テーマ
CREATE TABLE IF NOT EXISTS institution_theme (
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  theme_id       UUID NOT NULL REFERENCES themes(id) ON DELETE CASCADE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (institution_id, theme_id)
);

-- 研究機関 ↔ 投資家
CREATE TABLE IF NOT EXISTS institution_investor (
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  investor_id    UUID NOT NULL REFERENCES investors(id) ON DELETE CASCADE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (institution_id, investor_id)
);

-- 研究テーマ ↔ 投資家
CREATE TABLE IF NOT EXISTS theme_investor (
  theme_id    UUID NOT NULL REFERENCES themes(id) ON DELETE CASCADE,
  investor_id UUID NOT NULL REFERENCES investors(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (theme_id, investor_id)
);

-- ============================================================
-- コメント・レビュー (comments)
-- ============================================================
CREATE TABLE IF NOT EXISTS comments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id     TEXT NOT NULL,
  page_label  TEXT NOT NULL,
  body        TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 1000),
  category    TEXT NOT NULL
              CHECK (category IN ('improvement', 'bug', 'other')),
  score       INT CHECK (score BETWEEN 1 AND 5),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_comments_page_id
  ON comments(page_id);

CREATE INDEX IF NOT EXISTS idx_comments_created_at
  ON comments(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_comments_category
  ON comments(category);

-- ============================================================
-- updated_at 自動更新トリガー
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_institutions_updated_at
  BEFORE UPDATE ON institutions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trg_themes_updated_at
  BEFORE UPDATE ON themes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trg_investors_updated_at
  BEFORE UPDATE ON investors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trg_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
