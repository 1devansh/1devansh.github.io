---
title: What AWS Certification Actually Taught Me
date: 2026-01-20
tags: ["aws", "cloud", "infrastructure"]
---

I passed the AWS Cloud Practitioner exam in 2020. The certificate itself is a PDF that sits in a folder somewhere. But the mental models I built while studying have shaped how I think about every system I've built since.

## It's not about memorizing services

The exam covers a lot of AWS services. But the real value isn't knowing that S3 is object storage or that Lambda is serverless compute. It's understanding *why* these abstractions exist and when to use them.

The cloud is fundamentally about tradeoffs: cost vs. performance, availability vs. consistency, managed vs. self-hosted. Studying for the certification forced me to think about these tradeoffs systematically.

## Three mental models that stuck

**1. Design for failure.** Everything fails eventually. The question isn't whether your system will break, but how it behaves when it does. This changed how I write error handling code, how I think about retries, and how I design data pipelines.

**2. Separate compute from storage.** This sounds obvious, but it's a powerful principle. When you decouple where you process data from where you store it, you gain flexibility to scale each independently.

**3. Automate everything repeatable.** If you're doing something manually more than twice, it should be automated. This applies to deployments, testing, monitoring — everything.

## The gap between certification and practice

Passing the exam doesn't make you a cloud engineer. What it does is give you vocabulary and frameworks for thinking about distributed systems. The real learning happens when you deploy something, watch it break at 2 AM, and figure out why.

## Worth it?

Yes, but not for the reasons most people think. The badge is nice for your LinkedIn. The mental models are what actually make you a better engineer.
