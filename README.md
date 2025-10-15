
### クイックスタート

1. プロジェクトへ配置

```bash
unzip startpack.zip
cd startpack
```

2. 依存関係をインストール

```bash
npm install
```

3. 環境変数を作成

```bash
cp .env.example .env
```

4. データベース（Neon 推奨）の接続文字列を `.env` に設定
   - 例（Neon）: `DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"`
5. Prisma による初期化

```bash
npx prisma migrate dev
```

6. 開発サーバーを起動（http://localhost:3002）

```bash
npm run dev
```

### 環境変数（概要）

`.env.example` を参照してください。主なもの:

```env
# アプリ
NEXT_PUBLIC_APP_URL=http://localhost:3002

# データベース
DATABASE_URL=postgresql://user:password@host/db?sslmode=require

# 認証（Neon Auth / Stack Auth）
NEXT_PUBLIC_STACK_PROJECT_ID=...
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=...
STACK_SECRET_SERVER_KEY=...

# Resend（メール）
RESEND_API_KEY=re_...
# 開発: CONTACT_EMAIL は Resend アカウントのメール（例: you@example.com）
CONTACT_EMAIL=you@example.com
# 本番: ドメイン検証後に RESEND_FROM を独自ドメインに（任意）
RESEND_FROM=support@yourdomain.com
RESEND_DOMAIN=yourdomain.com        # 任意（本番で独自ドメイン送信）
```

任意の追加変数（レート制限や開発向け）:

```env
# お問い合わせ API の簡易レート制限（任意）
CONTACT_RATE_LIMIT_WINDOW_MS=60000
CONTACT_RATE_LIMIT_MAX=5

# 開発中はメール送信をスキップしたい場合
SKIP_EMAIL_SEND=true
```

### 認証（Neon Auth / Stack Auth）

- Neon ダッシュボードで Auth を有効化 → Configuration から変数を `.env` へ
- 本番移行時は、Neon Auth / Stack Auth の「Authentication domain」を本番ドメインに更新してください
- 既定の保護ルートは `middleware.ts` で `/dashboard` と `/billing`。未ログイン時は `/auth/signup` へリダイレクト

4. ローカル開発（Stripe CLI）


### メール（Resend）

- `RESEND_API_KEY` を設定。受信先は `CONTACT_EMAIL`
- 本番は Resend でドメイン検証（SPF/DKIM）を行うと独自ドメイン送信が可能
- 開発（ローカル）では未検証ドメインの制約により、`onboarding@resend.dev` からアカウント所有者宛の送信のみ可
  - `CONTACT_EMAIL` は Resend アカウントのメール（例: you@example.com）を設定
  - 送信元はコード上 `onboarding@resend.dev` を使用（`RESEND_FROM` は設定しない）
- 実装は `app/api/contact/route.ts`。件名/本文/送信元/返信先などはコードで調整できます

### スクリプト

- `npm run dev`: 開発サーバー起動（ポート 3002）
- `npm run build`: 本番ビルド
- `npm run start`: 本番起動
- `npx prisma migrate dev`: マイグレーション適用
- `npx prisma generate`: Prisma Client 再生成

### トラブルシューティング（抜粋）

- **DB 接続失敗**: `.env` の `DATABASE_URL` を確認。`?sslmode=require` を付与。`npx prisma migrate reset` で再作成
- **認証が機能しない**: Neon Auth の 3 変数を設定。ブラウザの Cookie を有効に
- **メール未送信**: 開発はアカウント宛のみ送信可。`RESEND_API_KEY` とログを確認。必要なら `SKIP_EMAIL_SEND=true`
