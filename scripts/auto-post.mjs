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
    console.log(`loot-drop記事: ${startup.name}`);
    const existingList = existingTitles.join('\n- ');
    prompt = `AIスタートアップの失敗事例を基にした教育的なブログ記事を日本語で書いてください。

## 取り上げる失敗スタートアップ
- 企業名: ${startup.name}
- 分野: ${startup.category}
- 調達資金: ${startup.funding}
- 創業年: ${startup.founded}年
- 廃業年: ${startup.closed}年
- 主な失敗原因: ${startup.cause}

## 参考: AI業界全体の失敗統計（loot-drop.ioより）
- 分析対象: 34社の失敗AIスタートアップ、総燃焼額$66億
- 最大の死因: 競合他社（64.7%）— 大手テック企業が高性能モデルを無料提供
- 次点: 資金枯渇（17.6%）、ユニットエコノミクス（5.9%）

## 既存記事（重複禁止）
- ${existingList}

## 記事要件
- ターゲット: AIツールを使い始めた日本人の初心者〜中級者
- ${startup.name}が「なぜ失敗したのか」を分かりやすく解説
- AI業界の構造的な問題（大手の独占など）を初心者向けに解説
- 読者への実践的な教訓（どのAIツールを選ぶべきか、何に注意すべきかなど）
- 目標文字数: 1500〜2500文字

出力形式（マークダウン、フロントマターを含む完全な形式のみ出力）:
---
title: "（魅力的なタイトル）"
date: "${today}"
description: "（検索向けの説明文、120文字以内）"
tags: ["AI", "スタートアップ", "失敗事例"]
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
