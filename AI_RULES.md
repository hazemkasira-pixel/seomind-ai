# SEOMind AI - Engineering Rules

## Mission

Build a world-class AI SaaS platform that autonomously analyzes, optimizes, and manages SEO for websites.

The codebase must always prioritize:

- Simplicity
- Scalability
- Security
- Performance
- Readability
- Maintainability

---

# Architecture

Always use Clean Architecture.

Never mix business logic with API routes.

Separate responsibilities into layers.

Presentation

↓

Application

↓

Domain

↓

Infrastructure

---

# Code Quality

Always produce production-ready code.

No demo code.

No placeholder implementations.

No TODO comments unless explicitly requested.

No duplicated code.

Follow SOLID principles.

---

# Backend

Language

Python 3.12+

Framework

FastAPI

Database

PostgreSQL

ORM

SQLAlchemy 2.x

Migrations

Alembic

Authentication

JWT + Refresh Tokens

Validation

Pydantic v2

Background Jobs

Celery + Redis

Logging

Structured logging

Testing

Pytest

---

# Frontend

Framework

Next.js

Language

TypeScript

Styling

Tailwind CSS

Components

shadcn/ui

Icons

Lucide

State

Zustand

Forms

React Hook Form

Validation

Zod

---

# Database Rules

Always normalize tables.

Use UUID as primary keys.

Never hard delete important data.

Support soft delete.

Always include:

created_at

updated_at

---

# API Rules

REST API.

Consistent naming.

Version APIs.

Example:

/api/v1/websites

/api/v1/pages

/api/v1/users

Return consistent JSON responses.

Never expose internal errors.

---

# AI Rules

The platform is NOT a chatbot.

It is an autonomous AI operating system.

Every AI capability must be implemented as an independent Agent.

Agents communicate through tasks.

Agents never call each other directly.

---

# Agent Rules

Each Agent has:

Objective

Input

Output

Memory

Logs

Metrics

Every Agent must be replaceable.

---

# Security

Never expose secrets.

Always validate inputs.

Escape outputs.

Protect against:

SQL Injection

XSS

CSRF

Rate Limiting

Use HTTPS.

Encrypt sensitive data.

---

# Git

Small commits.

Meaningful commit messages.

Feature branches.

Never commit secrets.

Never commit .env.

---

# Documentation

Every module must contain:

README

Architecture

Examples

API documentation

---

# Performance

Lazy loading.

Caching.

Pagination.

Compression.

Database indexing.

Async operations whenever appropriate.

---

# AI Philosophy

SEOMind AI does not provide recommendations only.

SEOMind AI analyzes.

SEOMind AI decides.

SEOMind AI executes.

SEOMind AI monitors.

SEOMind AI improves continuously.

---

# Final Rule

Every line of code should move SEOMind AI closer to becoming the world's leading Autonomous SEO Platform.
