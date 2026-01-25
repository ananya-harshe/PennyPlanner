# PennyPlanner — 2-Minute Demo Video Checklist

Use this flow to record a tight 2-minute demo that hits every major feature. **~15 seconds per section** on average.

---

## Pre-Recording Setup

- [ ] Backend running (`cd backend && npm start` or your start script)
- [ ] Frontend running (`cd frontend-pennies && npm run dev`)
- [ ] Demo user pre-created OR use **Register** in the flow
- [ ] Browser: clear session/cookies if you want a clean login → streak sequence
- [ ] Window size: **desktop** (e.g. 1440×900) to show nav + StatsSidebar + main content
- [ ] Optional: hide bookmarks bar, use clean profile

---

## Demo Flow (2 Minutes)

### 1. Login / Register — **~15 sec**

- [ ] Open app → **Login** page
- [ ] Either **Log In** with existing demo user **or** **Sign up** (username, email, password 6+ chars)
- [ ] Submit → see welcome toast
- [ ] Land on **Home** (streak animation may play if you just registered/logged in)

---

### 2. Home — **~15 sec**

- [ ] **Penny mascot** + welcome message visible
- [ ] **Daily Goal** card: XP progress bar
- [ ] **Top Goal** widget (if you have goals) — tap to go to Dashboard
- [ ] **Daily Quests** quick action → tap to open **Quests** page
- [ ] Optional: **Ask Penny** tip button → show quick tip

---

### 3. Dashboard — **~15 sec**

- [ ] **Penny** welcome + optional **Penny advice** card
- [ ] **Spending / analysis** (pie chart or summary)
- [ ] **Goals** list
- [ ] **Add Goal** → open modal → fill title, target, optional note → save
- [ ] Toast / updated goals list

---

### 4. Quests — **~20 sec**

- [ ] **Quest list** with XP rewards
- [ ] Open a **quest** → **Quiz** modal (multi-step)
- [ ] Answer 1–2 questions (correct → continue; wrong → Penny reaction)
- [ ] Complete or **Skip to end** → **Quest completion** animation
- [ ] **Gift box** / XP gained feedback
- [ ] Return to quest list (quest marked done)

---

### 5. Shop — **~12 sec**

- [ ] **Rewards Shop** page
- [ ] **XP balance** in header
- [ ] Scroll **shop items** (boosts, gift cards, etc.)
- [ ] **Redeem** one affordable item (or briefly show “Need X more XP”)
- [ ] **Shop redemption** animation plays

---

### 6. Leaderboard — **~8 sec**

- [ ] **Leaderboard** page
- [ ] **Podium** (top 3) + **rankings** list
- [ ] Your row highlighted if applicable

---

### 7. Ask Penny (Chat) — **~12 sec**

- [ ] Click **Ask Penny** (header **Ask!** on mobile, or **StatsSidebar** “Ask Penny” on desktop)
- [ ] **PennyChatWidget** opens
- [ ] Send one message (e.g. “How do I save more?”)
- [ ] **Penny** AI reply appears
- [ ] Close widget

---

### 8. Future Planning — **~10 sec**

- [ ] **Future Planning** nav → **Future Planning** page
- [ ] **“Potential monthly wealth”** + **projections chart**
- [ ] Optional: **“What If”** popup / scenario

---

### 9. Settings — **~8 sec**

- [ ] **Settings** page
- [ ] **Nickname** and **daily goal** visible
- [ ] Optional: **Update profile** → toast
- [ ] **Do not** delete account or use destructive actions

---

### 10. Wrap — **~5 sec**

- [ ] Quick scroll on **Home** or **Dashboard** to show layout
- [ ] **Log out** via Settings (if you show it) or leave on a strong frame (e.g. Home or Shop)

---

## Checklist Summary (Quick Scan)

| # | Section           | Key beats                                      | ✓ |
|---|-------------------|-------------------------------------------------|---|
| 1 | Login/Register    | Auth → welcome toast → Home                     |   |
| 2 | Home              | Penny, daily goal, top goal, Daily Quests       |   |
| 3 | Dashboard         | Charts, goals, add goal                         |   |
| 4 | Quests            | Open quest → quiz → complete → animation        |   |
| 5 | Shop              | XP, items, redeem → redemption animation        |   |
| 6 | Leaderboard       | Podium + rankings                               |   |
| 7 | Ask Penny         | Open chat → send message → reply                |   |
| 8 | Future Planning   | Wealth summary + chart                          |   |
| 9 | Settings          | Profile, nickname, daily goal                   |   |
|10 | Wrap              | Final frame / logout                            |   |

---

## Tips

- **Streak animation**: Easiest to trigger right after **register** or **login** (app sets `showStreak`).
- **Quest quiz**: Pick a short quest (fewer questions) to stay within ~20 sec.
- **Shop**: Ensure demo user has enough XP to redeem something, or quickly show “need more XP” then move on.
- **Chat**: Use a short, clear question so Penny’s reply is fast.
- **Pacing**: If you run over, trim **Leaderboard**, **Settings**, or **Future Planning** first; keep **Login → Home → Dashboard → Quests → Shop → Chat** as the core.

---

## Optional Shorter Cut (90 sec)

1. Login → Home (streak + daily goal + quests link)  
2. Dashboard (charts + add goal)  
3. Quests (one quest, quiz, complete)  
4. Shop (redeem one item)  
5. Ask Penny (one Q&A)  
6. Log out or end on Home

Use **DEMO_VIDEO_CHECKLIST.md** as your run sheet while recording.
