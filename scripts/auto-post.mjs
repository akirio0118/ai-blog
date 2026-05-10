import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Tokyo' });

// 今日のAIニュースをRSSから取得
async function fetchLatestAINews() {
  const feeds = [
    'https://news.google.com/rss/search?q=AI+ChatGPT+Claude+Gemini&hl=ja&gl=JP&ceid=JP:ja',
    'https://news.google.com/rss/search?q=人工知能+AIツール+活用&hl=ja&gl=JP&ceid=JP:ja',
  ];

  const items = [];
  for (const url of feeds) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
      const xml = await res.text();
      for (const match of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
        const item = match[1];
        const title = (item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)
                    || item.match(/<title>(.*?)<\/title>/))?.[1] || '';
        const desc  = (item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)
                    || item.match(/<description>(.*?)<\/description>/))?.[1] || '';
        if (title) {
          items.push({
            title: title.trim(),
            desc: desc.replace(/<[^>]+>/g, '').trim().slice(0, 200),
          });
        }
      }
    } catch (e) {
      console.warn(`RSS取得失敗: ${url} — ${e.message}`);
    }
  }
  return items.slice(0, 15);
}

// 既存記事タイトルを取得（重複防止）
function getExistingTitles() {
  const postsDir = path.join(__dirname, '../posts');
  return fs.readdirSync(postsDir)
    .filter(f => f.endsWith('.md'))
    .map(f => {
      const content = fs.readFileSync(path.join(postsDir, f), 'utf-8');
      return content.match(/^title:\s*"(.+)"/m)?.[1] || f;
    });
}

// フォールバック1: loot-drop.io失敗スタートアップから次の1件を選ぶ
function getLootDropTopic() {
  const lootPath = path.join(__dirname, 'lootdrop.json');
  const data = JSON.parse(fs.readFileSync(lootPath, 'utf-8'));
  const startup = data.startups.find(s => !s.used);
  if (!startup) return null;
  startup.used = true;
  startup.publishedAt = today;
  fs.writeFileSync(lootPath, JSON.stringify(data, null, 2), 'utf-8');
  return startup;
}

// フォールバック2: 事前定義トピックから次の1件を選ぶ
function getFallbackTopic() {
  const topicsPath = path.join(__dirname, 'topics.json');
  const data = JSON.parse(fs.readFileSync(topicsPath, 'utf-8'));
  const topic = data.topics.find(t => !t.used);
  if (!topic) return null;
  topic.used = true;
  topic.publishedAt = today;
  fs.writeFileSync(topicsPath, JSON.stringify(data, null, 2), 'utf-8');
  return topic;
}

// ----- メイン -----
const newsItems = await fetchLatestAINews();
const existingTitles = getExistingTitles();
const hasNews = newsItems.length > 0;

// 実行時刻(UTC)でコンテンツソースをローテーション
// 0:00 UTC(9:00 JST) → ニュース, 4:00 UTC(13:00 JST) → loot-drop, 8:00 UTC(17:00 JST) → ニュース
const utcHour = new Date().getUTCHours();
const useLootDrop = utcHour === 4;

console.log(`ニュース取得: ${newsItems.length}件, utcHour: ${utcHour}, useLootDrop: ${useLootDrop}`);

let prompt;
let articleId;

if (useLootDrop) {
  // 13:00 JST枠: 失敗AIスタートアップから教訓記事
  const startup = getLootDropTopic();
  if (startup) {
    console.log(`loot-drop記事: ${startup.name} / 失敗原因: ${startup.cause}`);
    const existingList = existingTitles.join('\n- ');

    // 失敗原因ごとに読者向けの実用テーマを導く
    const causeToAngle = {
      'Competition':        `大手AI企業（OpenAI・Google・Anthropic）がサービスを無料・格安で提供し、${startup.category}分野のスタートアップを淘汰してきた。読者が「長く使い続けられる信頼性の高いAIツール」を選ぶための判断基準を提供する。`,
      'Ran Out of Cash':    `${startup.category}分野で$${startup.funding}を調達しても${startup.closed}年に資金が尽きた。無料・低コストで使えるAIツールが突然終了するリスクと、コストを抑えながらAIを活用し続けるための実践的な方法を提供する。`,
      'Unit Economics':     `${startup.category}の${startup.name}は収益よりもAI推論コストが膨らみサービス終了した。読者が無駄なコストをかけずにAIツールを最大活用するためのコスト最適化の視点を提供する。`,
      'Team/Founder Conflict': `優れた技術を持つAIスタートアップでも組織の問題でサービスが突然終わることがある。ツール依存のリスク分散とデータのポータビリティを意識したAI活用術を提供する。`,
      'Legal/Regulatory':   `${startup.category}分野では法規制がサービス存続を左右する。個人情報・著作権・業務データをAIツールに渡す際の安全な使い方とリスク管理を提供する。`,
    };
    const angle = causeToAngle[startup.cause] || `${startup.cause}が原因で${startup.name}は廃業した。この失敗パターンをふまえて、読者がAIツールをより賢く・安全に活用するための実践的な方法を提供する。`;

    prompt = `AIスタートアップの失敗データをもとに、読者が実際に役立てられるブログ記事を日本語で書いてください。

## 背景データ（記事の根拠として使う）
- ${startup.name}（${startup.category}）: 調達${startup.funding}、${startup.founded}〜${startup.closed}年、廃業原因「${startup.cause}」
- AI業界全体: 34社が廃業、総損失$66億、失敗原因1位は競合他社（64.7%）

## 記事のテーマ・角度
${angle}

## 既存記事（重複禁止）
- ${existingList}

## 記事要件
- ターゲット: AIツールを使い始めた日本人の初心者〜中級者
- スタートアップの失敗話ではなく、「読者が今日から実践できる」内容を中心に書く
- 失敗データは「なぜこの話が重要か」の根拠として冒頭で軽く触れる程度にとどめる
- 具体的なツール名・手順・コツを含める
- 目標文字数: 1500〜2500文字

出力形式（マークダウン、フロントマターを含む完全な形式のみ出力）:
---
title: "（魅力的なタイトル）"
date: "${today}"
description: "（検索向けの説明文、120文字以内）"
tags: ["タグ1", "タグ2", "タグ3"]
---

## （見出し）

（本文）`;

    articleId = `ai-failure-${startup.id}-${today}`;
  } else {
    console.log('loot-dropトピック枯渇、ニュースにフォールバック');
  }
}

if (!prompt) {
  if (hasNews) {
    // ニュースベースで記事生成
    const newsList = newsItems.map((n, i) => `${i + 1}. ${n.title}\n   ${n.desc}`).join('\n');
    const existingList = existingTitles.join('\n- ');

    prompt = `以下は本日（${today}）のAI関連最新ニュースです。

## 最新ニュース
${newsList}

## 既存記事（重複禁止）
- ${existingList}

---

上記のニュースの中から、日本人のAI初心者・中級者にとって最も役立つ・興味深いトピックを1つ選び、そのトピックについてブログ記事を書いてください。

要件:
- ニュースの内容を初心者向けに解説・掘り下げる
- 読者がすぐに試せる実践的な内容を含める
- 既存記事と重複しないトピックを選ぶ
- 目標文字数: 1500〜2500文字

出力形式（マークダウン、フロントマターを含む完全な形式のみ出力）:
---
title: "（魅力的なタイトル）"
date: "${today}"
description: "（検索向けの説明文、120文字以内）"
tags: ["タグ1", "タグ2", "タグ3"]
---

## （見出し）

（本文）`;

    const timestamp = Date.now();
    articleId = `ai-news-${today}-${timestamp}`;
  } else {
    // フォールバック: 事前定義トピック
    const topic = getFallbackTopic();
    if (!topic) {
      console.log('利用可能なトピックがありません');
      process.exit(0);
    }
    console.log(`フォールバックトピック使用: ${topic.title}`);

    prompt = `AI活用ブログの記事を日本語で書いてください。

トピック: ${topic.title}
ターゲット読者: AIツールを使い始めた初心者〜中級者の日本人
目標文字数: 1500〜2500文字

出力形式（マークダウン、フロントマター込み、説明文不要）:
---
title: "（魅力的なタイトル）"
date: "${today}"
description: "（検索向けの説明文、120文字以内）"
tags: [${topic.tags.map(t => `"${t}"`).join(', ')}]
---

## （見出し）

（本文）`;

    articleId = topic.id;
  }
}

console.log('記事生成中...');
const response = await client.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: 4000,
  messages: [{ role: 'user', content: prompt }],
});

const content = response.content[0].text.trim();
const filename = `${articleId}.md`;
const filepath = path.join(__dirname, '../posts', filename);

fs.writeFileSync(filepath, content, 'utf-8');
console.log(`✅ 記事作成完了: posts/${filename}`);
