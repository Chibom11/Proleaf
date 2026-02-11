Proleaf

Proleaf is an AI-powered document intelligence platform designed to transform static documents and online content into interactive, queryable knowledge systems.

Built with a modern full-stack architecture and agentic AI workflows, Proleaf enables users to upload PDFs, interact with them using RAG (Retrieval-Augmented Generation), and summarize YouTube videos using intelligent automation.

🚀 Features
📄 Document Intelligence (RAG Agent)

Upload PDFs into isolated threads

Automatic chunking + embedding generation

Persistent vector storage using ChromaDB

Metadata-based filtering (user + thread isolation)

Context-aware question answering using LangGraph workflows

🎥 YouTube Video Summarizer

Extracts video transcripts

Generates structured summaries

Converts long-form content into concise insights

🧠 Agentic AI Architecture

Built using LangGraph for stateful multi-step reasoning

Tool-based execution (PDF QA, summarization, transcript handling)

Structured backend workflows instead of single LLM calls

🔐 Production-Style Backend

Thread-based document isolation

PostgreSQL for relational storage

Secure API-driven architecture

Scalable embedding pipeline

🏗️ Tech Stack
Frontend

React

React Router

TailwindCSS (custom terminal-inspired design system)

Backend

FastAPI

LangGraph (agent orchestration)

ChromaDB (vector storage)

OpenAI Embeddings

PostgreSQL

Psycopg

Additional Services

YouTube transcript extraction

Recursive text splitting

Persistent vector database

🧩 Architecture Overview

Proleaf separates concerns cleanly:

PostgreSQL → Stores users, threads, document metadata

ChromaDB → Stores embeddings (with user + thread metadata filters)

LangGraph → Controls intelligent tool-based workflows

FastAPI → Exposes structured backend APIs

React → Provides terminal-style AI interface
