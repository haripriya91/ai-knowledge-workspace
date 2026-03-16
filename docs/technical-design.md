1. Project Overview
--------------------------------------

    Name: AI Knowledge Workspace
    Type: AI-powered personal knowledge management system
    Users: Students, professionals, lifelong learners

    Core idea:
    Users store learning materials (PDFs, links, images) and interact with them using AI (Q&A, summaries, flashcards, quizzes).

Goal
--------------------------------------


Build a real-world, company-style AI Workspace Platform where users can:

    View public workspaces without logging in
    Create and manage private workspaces after login
    Use AI features inside workspaces (content generation, summaries, etc.)
    Upload files (stored in AWS S3)

This project is designed to simulate a real company product with:

    Clear separation of frontend, backend, and AI modules
    Secure authentication & authorization
    Cloud storage (AWS S3)
    Well-structured GitHub backlog (epics, user stories, tasks)

2. High-Level Architecture
--------------------------------------

    Frontend (Angular)
            ↓
    Backend (NestJS API)
        - Auth Module (JWT)
        - User Module
        - Workspace Module
        - File Module
        - AI Module
            |
            | Prisma ORM
            v
    PostgreSQL (core data- Docker)
    MongoDB (AI & content)
    AWS S3 (File Storage)
    AI Provider (LLM)

3. Technology Stack
--------------------------------------

    Frontend

    - Angular
    - TypeScript
    - Tailwind CSS
    - Auth via JWT (stored securely)

    Backend

    - NestJS
    - Prisma ORM
    - PostgreSQL (Docker)
    - MongoDB (for AI logs / unstructured data – optional)
    - JWT Authentication

    Cloud & DevOps

    - AWS S3 (file storage)
    - AWS IAM (permissions)
    - Docker & Docker Compose
    - GitHub Actions (workflow)

    AI Layer (Phase 2)

    - OpenAI API / LLM provider
    - Prompt templates
    - Workspace-based AI context

4. Authentication & Authorization Design
--------------------------------------

    4.1 Auth Strategy
    --------------------------------------

    - JWT-based authentication
    - Access Token (short-lived)
    - Refresh Token (optional – Phase 2)

    4.2 Access Rules
    -----------------

    ------------------------------------------------------------------
    | Feature	                | Logged Out	|   Logged In        |
    ------------------------------------------------------------------
    | View public workspaces	|     ✅        |     	✅          |
    | Create workspace	        |     ❌	       |        ✅          |
    | View private workspace	|     ❌	       |  ✅ (owner/member) |
    | Upload files	            |     ❌	       |        ✅          |
    | Use AI tools	            |     ❌	       |        ✅          |
    ------------------------------------------------------------------


5. Data Model (High-Level)
 -----------------------------

User

id
email
passwordHash
createdAt

Workspace

id
name
description
visibility (PUBLIC / PRIVATE)
ownerId
createdAt

WorkspaceMember

id
userId
workspaceId
role (OWNER / MEMBER)

File

id
workspaceId
s3Key
fileName
mimeType
uploadedAt

6. API Design (Initial)
 -----------------------------
 
Public APIs (No Auth)

    GET /workspaces/public

Auth APIs

    POST /auth/signup
    POST /auth/login

Workspace APIs

    POST /workspaces (auth)
    GET /workspaces/:id (auth + access check)

File APIs

    POST /files/upload (auth)

GENERAL DESIGN & WIREFRAMES (TEXT-BASED)


1. Public Landing / Dashboard (No login)
--------------------------------------
 AI Knowledge Workspace
--------------------------------------
 Explore Public Workspaces

 [ German A2 Study ]
 [ Frontend Interview Prep ]
 [ AI Basics ]

 Login | Sign Up
--------------------------------------

API:
GET /api/workspaces/public

2. Auth Screens
Login
Email
Password
[ Login ]

Sign Up
Email
Password
[ Create Account ]

3. Private Dashboard (After login)
--------------------------------------
 Sidebar        | Main Area
--------------------------------------
 Workspaces     | My Workspaces
 Collections    | + Create Workspace
 AI Assistant   |
--------------------------------------

4. Workspace Detail View
--------------------------------------
 Assets | Content | AI Panel
--------------------------------------
 PDFs   | Viewer  | Ask AI
 Links  |         | Summarize
 Notes  |         | Flashcards
 videos |         | quizes etc
--------------------------------------

