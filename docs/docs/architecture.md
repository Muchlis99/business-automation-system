# Architecture

## Overview

The Business Automation System connects business applications, APIs, webhooks, workflow orchestration, AI-assisted processes, databases, and external services.

```text
Business Applications
        │
        ▼
     REST APIs
        │
        ▼
     API Layer
        │
   ┌────┴────┐
   ▼         ▼
Webhooks   Backend
   │         │
   └────┬────┘
        ▼
       n8n
        │
   ┌────┼──────────┐
   ▼    ▼          ▼
  AI    DB   External Services
