import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const topicsPath = path.join(__dirname, 'topics.json');
const data = JSON.parse(fs.readFileSync(topicsPath, 'utf-8'));
const topic = data.topics.find(t => !t.used);

if (!topic) {
  console.log('利用可能なトピックがありません');
  process.exit(0);
}

const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Tokyo' });
console.log(`記事生成中: ${topic.title}`);

const response = await client.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: 4000,
  messages: [{
    role: 'user',
    content: `AI活用ブログの記事を日本語で書いてください。

トピック: ${topic.title}
ターゲット読者: AIツールを使い始めた初心者〜中級者の日本人
目標文字数: 1500〜2500文字

出力形式（マークダウン形式、フロントマター込み）:
---
title: "（魅力的なタイトル）"
date: "${today}"
description: "（検索エンジン向けの説明文、120文字以内）"
tags: [${topic.tags.map(t => `"${t}"`).join(', ')}]
---

## （見出し）

（本文）

## （見出し）

（本文）

要件:
- h2(##) から見出しを始める
- 具体的な手順・使い方・比較を含める
- 初心者にわかりやすい言葉を使う
- フロントマターを含む完全なマークダウンのみ出力（前後の説明文は不要）`
  }]
});

const content = response.content[0].text.trim();
const filename = `${topic.id}.md`;
const filepath = path.join(__dirname, '../posts', filename);

fs.writeFileSync(filepath, content, 'utf-8');
console.log(`✅ 記事作成: posts/${filename}`);

// トピックを使用済みにする
const idx = data.topics.findIndex(t => t.id === topic.id);
data.topics[idx].used = true;
data.topics[idx].publishedAt = today;
fs.writeFileSync(topicsPath, JSON.stringify(data, null, 2), 'utf-8');
console.log(`✅ トピック更新: ${topic.title}`);
