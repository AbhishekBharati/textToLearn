# TechEaze: AI-Powered Event Driven Text-to-Learn Platform

TechEaze is an advanced educational platform designed to transform simple text prompts into comprehensive, structured learning paths. By leveraging Generative AI, TechEaze provides users with personalized courses complete with modules, lessons, video content, and interactive assessments.

**Live Demo:** [https://text-to-learn-ochre.vercel.app/](https://text-to-learn-ochre.vercel.app/)

---

## Features

- **Personalized Course Generation:** Enter a topic and the system crafts a logical, multi-module curriculum.
- **Rich Media Lessons:** Each lesson includes structured text, code snippets where relevant, and curated YouTube video suggestions.
- **Interactive MCQs:** Automatically generated quizzes at the end of each lesson to test knowledge retention.
- **Seamless Navigation:** Persistent URLs for courses, modules, and lessons. 
- **Activity Tracking:** Jump back into previous learning journeys through the sidebar history.
- **Google Authentication:** Secure login using Google OAuth integration.
- **Modern Responsive UI:** A clean, mobile-first design with built-in dark mode support.

---

## Architecture

TechEaze follows a distributed microservices architecture to ensure scalability and separation of concerns:

### 1. Frontend (Client)
- **Framework:** React 19 with TypeScript.
- **Styling:** Tailwind CSS 4.
- **Animation:** Motion for UI transitions.
- **State Management:** React Context API for Auth and Course states.
- **Routing:** React Router 7 for persistent, URL-driven navigation.

### 2. Backend (Server)
- **Framework:** Spring Boot 3.4 (Java 21).
- **Security:** Google OAuth 2.0 integration for user authentication.
- **Communication:** Acts as the gateway for course status polling and metadata retrieval.
- **Persistence:** MongoDB for storing course structures, lessons, and user history.

### 3. AI Consumer (Worker)
- **Framework:** Spring AI with OpenAI integration.
- **Asynchronous Processing:** Uses RabbitMQ to handle course generation jobs in the background, preventing frontend timeouts.
- **Smart Formatting:** Custom prompt engineering ensures the AI outputs strictly valid JSON for reliable parsing.

---

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Motion.
- **Backend:** Java 21, Spring Boot, Spring Data MongoDB, Spring AI.
- **Messaging:** RabbitMQ (Asynchronous Task Queue).
- **Database:** MongoDB (NoSQL).
- **AI Engine:** OpenAI GPT-4o.
- **External APIs:** YouTube Data API.

---

## Installation and Setup

### Prerequisites
- Docker and Docker Compose
- Java 21 and Maven
- Node.js (v18+) and npm
- OpenAI API Key
- Google Cloud Console Credentials

### Step 1: Clone the Repository
```bash
git clone https://github.com/AbhishekBharati/textToLearn.git
cd textToLearn
```

### Step 2: Infrastructure Setup
Start the required services (MongoDB, RabbitMQ) using Docker Compose:
```bash
docker-compose up -d
```

### Step 3: Backend Setup
1. Navigate to the `server` directory.
2. Create or update `src/main/resources/application.yaml` with your credentials:
   - `GOOGLE_CLIENT_ID`
   - `YOUTUBE_API_KEY`
3. Run the server:
```bash
./mvnw spring-boot:run
```

### Step 4: Consumer Setup
1. Navigate to the `Consumer` directory.
2. Update `src/main/resources/application.yaml` with your `SPRING_AI_OPENAI_API_KEY`.
3. Run the consumer:
```bash
./mvnw spring-boot:run
```

### Step 5: Frontend Setup
1. Navigate to the `client` directory.
2. Create a `.env` file based on `.env.example` and add your `VITE_GOOGLE_CLIENT_ID`.
3. Install dependencies and start the development server:
```bash
npm install
npm run dev
```

---

## Roadmap and Future Enhancements

- **PDF Export:** Allow users to download entire courses as high-quality documents.
- **Progress Tracking:** Detailed analytics on completed lessons and quiz scores.
- **Community Sharing:** A public gallery for users to share their generated courses.
- **Collaborative Learning:** Shared workspaces for groups to learn together.

---

## Contributing

Contributions are welcome. Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

Developed by **Abhishek Bharati**
