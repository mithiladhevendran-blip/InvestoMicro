---
name: agentic-ai-investment-advisor
description: AI that reasons through spending patterns and gives investment advice
mode: web
---

# Agentic AI Investment Advisor

## What This Skill Does

This skill implements agentic AI that:
- 🧠 **Reasons** through spending decisions step-by-step
- 💡 **Explains** its logic transparently
- 📊 **Analyzes** financial patterns
- 🎯 **Recommends** personalized actions
- 📈 **Projects** outcomes

## How It Works

### Step 1: Data Collection
- Reads user spending history from Supabase
- Calculates essential vs non-essential ratio

### Step 2: Agentic Reasoning
- AI analyzes patterns
- Generates multi-step reasoning
- Creates recommendations

### Step 3: Output
- Shows Analysis (what was found)
- Shows Reasoning (how it decided)
- Shows Recommendation (what to do)
- Shows Outcome (what will happen)

## Files

- `ai.html` - Agentic spending classifier with reasoning
- `suggest.html` - Investment advisor with agentic analysis
- `api-bridge.html` - OpenRouter integration template

## Example

**Input:** 
- Essential spending: ₹4,000
- Non-essential spending: ₹1,000
- Total transactions: 20

**AI Reasoning:**
1. Calculate ratio: 4000/5000 = 80% essential
2. Evaluate: 80% is good financial discipline
3. Check investment target: ₹(4000 * 0.002) + (1000 * 0.01) = ₹18
4. Recommend: Increase to ₹25/day

**Output:**
- Category: STRONG DISCIPLINE
- Analysis: "Your 80% ratio shows excellent financial control"
- Recommendation: "Invest ₹25/day. In 1 year: ₹9,125 invested"
- Outcome: "At 8% returns: ₹9,855 potential value"

## Next Steps

To use OpenRouter for cloud-based agentic AI:
1. Set up backend endpoint
2. Connect to OpenRouter API
3. Send spending data to Claude/GPT-4
4. Parse reasoning responses
5. Display to user
