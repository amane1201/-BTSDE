# 底辺歌い手破壊主義共和国連邦 公式サイト

ダークテーマ × 赤ネオン × ガラスモーフィズムで構築された、軍事組織 × ハッカー集団の世界観を持つ完全静的Webサイト。

---

## 🎯 プロジェクト概要

- **名称**: 底辺歌い手破壊主義共和国連邦（TK-HKR FEDERATION）
- **種別**: 完全静的サイト（HTML / CSS / JavaScript のみ・ビルド不要）
- **テーマ**: ネオ・サイバーパンク / 軍事 / ハッカー
- **対応**: モバイルファースト・レスポンシブ

---

## ✅ 実装済み機能

### セクション
| # | セクション | 内容 |
|---|---|---|
| 01 | **Hero** | フルスクリーン / 発光タイトル / グリッチ演出 / スクロール誘導 |
| 02 | **About（組織概要）** | 目的 / 思想 / 活動 を3枚のガラスカードで表示 |
| 03 | **Members（構成員）** | `members` 配列から **DOM動的生成**。円形の赤ネオン枠アバター・ホバー拡大発光・カード浮遊 |
| 04 | **Records（戦績）** | カウントアップ数値4種 + 縦型タイムライン5件 |
| 05 | **News** | `news.json` を `fetch` 取得 → 日付降順ソート → 最大5件表示（もっと見るボタンで+5件） |
| 06 | **Links** | YouTube / X / TikTok / Instagram / ニコニコ / Spotify の6種 |
| 07 | **Join（参加導線）** | Discord・オープンチャットへの大型赤発光ボタン（パルスアニメーション） |

### 演出・インタラクション
- 🟥 動く赤系グラデーション背景
- ✨ Canvas によるネオン粒子エフェクト（約70粒子・軽量）
- 📡 SVG ノイズ + スキャンラインオーバーレイ
- 🌀 スクロール連動フェードイン（IntersectionObserver）
- 💥 ヒーロータイトルのランダムグリッチ・スクランブル
- 🖥️ 初回ロード時の起動シーケンス（ブート画面）
- 🔔 右下フェイク通知トースト（定期ポップアップ）
- 💻 ハッキング風ボタン（`initiate_contact.sh`）
- 👤 メンバークリックで詳細モーダル表示（統計付き）
- 📊 Recordsセクションの数値カウントアップアニメーション
- ⏱️ フッターのリアルタイムアップタイムカウンター
- 📱 モバイルのハンバーガーメニュー

---

## 📂 ディレクトリ構成

```
/
├── index.html          メインHTML
├── style.css           スタイル（ダークテーマ・ネオン・ガラス・レスポンシブ）
├── script.js           メンバー動的生成 / News取得 / 演出制御
├── news.json           ニュースデータ
├── README.md           本ファイル
└── assets/
    └── members/
        ├── leader.png  総統
        ├── vice.png    副総統
        ├── staff.png   参謀長
        ├── agent.png   特務官
        ├── tech.png    技術顧問
        └── pr.png      広報部長
```

---

## 🌐 エントリーURI（セクションアンカー）

すべて同一ページ内のアンカーリンク。

| パス | 内容 |
|---|---|
| `/` | トップ（Hero） |
| `/#about` | 組織概要 |
| `/#members` | 構成員一覧 |
| `/#records` | 戦績・タイムライン |
| `/#news` | 最新通達 |
| `/#links` | SNS / 配信リンク集 |
| `/#join` | 参加導線（Discord / オープンチャット） |

### データソース
- `GET ./news.json` … ニュース一覧（配列形式）

### news.json フォーマット
```json
[
  {
    "date": "2026-04-21",
    "title": "公式サイト公開",
    "content": "連邦の活動を開始"
  }
]
```
- `date`: `YYYY-MM-DD`（日付降順でソート）
- エラー時は組み込みのフォールバックデータで動作継続

---

## 👥 メンバー追加方法

`script.js` 先頭の `members` 配列にオブジェクトを追加するだけ。

```js
const members = [
  {
    name: "新規構成員",
    role: "Operative",
    description: "説明文",
    icon: "assets/members/newbie.png",
    badge: "C",
    stats: { ops: 10, loyalty: "90%", rank: "B" }
  }
];
```
- アイコン画像は `assets/members/` に配置
- 画像読み込み失敗時は赤い✕のSVGフォールバックを自動表示

---

## 🧱 データ構造

### Member オブジェクト
| フィールド | 型 | 必須 | 説明 |
|---|---|---|---|
| `name` | string | ✅ | 表示名 |
| `role` | string | ✅ | 役職（英語推奨） |
| `description` | string | ✅ | 紹介文 |
| `icon` | string | ✅ | アイコン画像パス |
| `badge` | string | ー | ランク表記（S/A/B/C） |
| `stats` | object | ー | モーダル表示用統計 `{ops, loyalty, rank}` |

### News オブジェクト
| フィールド | 型 | 必須 | 説明 |
|---|---|---|---|
| `date` | string | ✅ | `YYYY-MM-DD` |
| `title` | string | ✅ | 見出し |
| `content` | string | ✅ | 本文 |

---

## 🎨 デザイントークン（style.css）

| 変数 | 値 |
|---|---|
| `--bg-0` | `#000000` |
| `--red` | `#ff1a2e`（メイン赤ネオン） |
| `--pink` | `#ff2b8a`（補助） |
| `--violet` | `#7a1bff`（補助） |
| `--neon` | 赤発光 box-shadow / text-shadow |
| `--glass` | 半透明カード背景（`backdrop-filter: blur`） |

---

## 🔗 使用ライブラリ（CDN）

| ライブラリ | 用途 |
|---|---|
| Google Fonts (Orbitron / Noto Sans JP / JetBrains Mono) | タイポグラフィ |
| Font Awesome 6.4.0 | アイコン |

※ JS フレームワーク・CSSフレームワークは一切使用していません（Vanilla JS）。

---

## 🚧 未実装 / 今後の拡張案

- [ ] 実際のSNSリンク差し替え（現在は `#` プレースホルダー）
- [ ] Discord / オープンチャットの実招待URL差し替え
- [ ] 管理画面（CMSによるnews.json編集UI）
- [ ] 音楽プレイヤー埋め込み（Spotify / YouTube Music）
- [ ] メンバー別専用ページの追加
- [ ] 多言語対応（EN / ZH）
- [ ] PWA化（オフライン対応・ホーム追加）
- [ ] OGP画像の差し替え（現在はメタタグのみ）

---

## 🛠️ 推奨次ステップ

1. **リンク差し替え**: `index.html` 内の `<a href="#">` を実URLに更新
2. **News更新**: `news.json` を編集するだけで NEWS セクションに反映
3. **メンバー追加**: `script.js` の `members` 配列に追加、画像を `assets/members/` に配置
4. **公開**: Publishタブからワンクリックでデプロイ可能

---

## 📡 STATUS

```
NODE     : TK-XXXXXX
UPTIME   : realtime
CHANNEL  : OPERATIONAL
DOCTRINE : v2.1
```

**破壊せよ、再構築せよ。連邦は常に前進する。**
