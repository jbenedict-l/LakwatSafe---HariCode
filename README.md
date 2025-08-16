# 🚏 LakwatSafe

A community-driven platform for safer, more accessible commuting — designed for public transport users and pedestrians in urban areas.  
The app empowers commuters to share, verify, and filter routes based on **safety, accessibility, and comfort**.

---

## 📍 Features

### **Community Board**
- **Ask for a route** – Users can request commuting directions.
- **Route suggestions** – Other users can manually suggest routes (walking + jeep/bus).
- **Reliability ratings** – Community members rate suggested routes for **accuracy** and **safety**.

### **Urban Access Map**
- **Real-time hazard pins**:
  - 🌊 Flooded
  - 🌩 Weather-related
  - 🚧 Broken / Blocked Path
  - 💡 Poorly Lit
- **Pin expiration** – Automatic removal after set hours to avoid outdated info.
- **Map filters**:
  - “Flood-Free”
  - “Well-Lit”
  - “Wheelchair-Friendly”
- **Optional photo evidence**.

### **Commuter Incident Reporter**
- **Anonymous reporting** (no account required).
- Reports viewable by LGUs or commuter advocacy groups.
- Multiple categories:
  - Harassment (verbal, physical, sexual)
  - Overcharging / No change
  - Reckless driving
  - Overloading
  - Discrimination
  - Unsafe vehicle conditions
  - Obstruction
  - Denial of service
  - Unhygienic conditions
  - Smoking / vaping inside
  - Noise disturbance
  - Other (custom)
- Detailed metadata:
  - Vehicle type
  - Route / landmark
  - Timestamp
  - Incident description
  - Optional photo

### **Safety & Comfort Ratings**
- 1–5 stars for walkability or commute safety per route/area.

### **Low-Bandwidth Mode**
- Text-only hazard & incident lists for areas with poor connectivity.

---

## 🖥 Pages & Navigation

### **Landing Page** (Ysa)
- Jeep illustration
- Interactive/animated UI (no backend)
- **CTA:** Continue → Dashboard

### **About Page**
- Scroll-down interactive UI (no backend)

### **Signup/Login**

### **Dashboard** (Ysa)
- “Routes Near You” cards
- Search function
- Recent updates feed
- “Are you safe?” quick button
- **Bottom Navigation Bar**:
  - **Home:** Dashboard
  - **Map:** Full-screen interactive map
    - Tap pins → Popup details, optional photo, posted time
    - Filters & center-location controls
  - **Report Incident:** Quick incident reporting page

---

## 🆚 Competition & Differentiation

### Competitors:
- Sakay.ph
- Waze
- Google Maps

### Why We’re Different:
- **Public transport & pedestrian focus** — jeepneys, buses, tricycles, walking.
- **Urban access filters** (Flood-Free, Well-Lit, Wheelchair-Friendly).
- **Anonymous incident reporting** — no account needed.
- **AI-enhanced route suggestions** using real-time hazards + historical data.
- **Low-bandwidth mode** for limited internet.
- **Hyperlocal business integration** — ad revenue can support community.

---

## 🛠 Tech Stack

**Frontend:** React Native + Expo  
**Backend:** Firebase, Node.js  
**Map Services:** Google Maps API  
**AI:** Node.js-based integration for route suggestion improvements

**Google Maps API Key:**  
`AIzaSyA_WSQosgp9FN2nhOC4zcoGtG_Wxpebmzw`

---

## 📱 Development Setup

### **Requirements**
- **Mobile Testing:** [Expo Go](https://expo.dev/client) app installed on your phone
- **Desktop Development:** Android Studio

### **Installation**
```bash
# Clone repository
git clone <repo_url>

# Navigate to project folder
cd <project_folder>

# Install dependencies
npm install

# Start development server
npx expo start
