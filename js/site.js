/* ===== Site JS — Minimal, no frameworks ===== */

(function () {
  'use strict';

  // --- Unregister old service workers ---
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      registrations.forEach(function (registration) {
        registration.unregister();
      });
    });
  }

  // --- Mobile nav toggle ---
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- Scroll reveal ---
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    reveals.forEach(el => observer.observe(el));
  }

  // --- Markdown helpers ---
  function parseFrontMatter(text) {
    // Normalize line endings
    text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return { meta: {}, body: text };
    const meta = {};
    match[1].split('\n').forEach(line => {
      const idx = line.indexOf(':');
      if (idx > -1) {
        const key = line.slice(0, idx).trim();
        let val = line.slice(idx + 1).trim();
        // Strip surrounding quotes
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        // Parse arrays
        if (val.startsWith('[') && val.endsWith(']')) {
          val = val.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, ''));
        }
        meta[key] = val;
      }
    });
    return { meta, body: match[2] };
  }

  function readingTime(text) {
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  }

  function renderTags(tags) {
    if (!tags || !Array.isArray(tags)) return '';
    return '<div class="blog-tags">' + tags.map(t => '<span>' + t + '</span>').join('') + '</div>';
  }

  // --- Blog index ---
  const blogList = document.getElementById('blog-list');
  if (blogList) {
    fetch('content/blog/index.json')
      .then(r => r.json())
      .then(posts => {
        if (!posts.length) {
          blogList.innerHTML = '<p class="loading-msg">No posts yet. Check back soon.</p>';
          return;
        }
        blogList.innerHTML = posts
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map(post => {
            const tags = post.tags ? renderTags(post.tags) : '';
            return `<a href="post.html?slug=${post.slug}" class="blog-item">
              <h2>${post.title}</h2>
              <div class="blog-meta">
                <span>${post.date}</span>
                <span>${post.readingTime || '?'} min read</span>
              </div>
              <p class="blog-excerpt">${post.excerpt || ''}</p>
              ${tags}
            </a>`;
          }).join('');
      })
      .catch(() => {
        blogList.innerHTML = '<p class="loading-msg">No posts yet. Check back soon.</p>';
      });
  }

  // --- Blog post ---
  const postContent = document.getElementById('post-content');
  const postTitle = document.getElementById('post-title');
  const postMeta = document.getElementById('post-meta');
  if (postContent && postTitle) {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');
    if (slug) {
      fetch('content/blog/' + slug + '.md')
        .then(r => {
          if (!r.ok) throw new Error('Not found');
          return r.text();
        })
        .then(text => {
          const { meta, body } = parseFrontMatter(text);
          postTitle.textContent = meta.title || slug;
          document.title = (meta.title || slug) + ' | Devansh Sharma';
          const mins = readingTime(body);
          let metaHtml = '';
          if (meta.date) metaHtml += '<span>' + meta.date + '</span>';
          metaHtml += '<span>' + mins + ' min read</span>';
          if (meta.tags && Array.isArray(meta.tags)) {
            metaHtml += renderTags(meta.tags);
          }
          postMeta.innerHTML = metaHtml;
          postContent.innerHTML = marked.parse(body);
        })
        .catch(() => {
          postTitle.textContent = 'Post not found';
          postContent.innerHTML = '<p>Sorry, this post doesn\'t exist. <a href="blog.html">Back to blog</a>.</p>';
        });
    }
  }

  // --- Notes ---
  const notesList = document.getElementById('notes-list');
  if (notesList) {
    fetch('content/notes/index.json')
      .then(r => r.json())
      .then(notes => {
        if (!notes.length) {
          notesList.innerHTML = '<p class="loading-msg">No notes yet.</p>';
          return;
        }
        Promise.all(
          notes.sort((a, b) => new Date(b.date) - new Date(a.date)).map(note =>
            fetch('content/notes/' + note.file)
              .then(r => r.text())
              .then(text => {
                const { meta, body } = parseFrontMatter(text);
                return { ...note, ...meta, body };
              })
          )
        ).then(entries => {
          notesList.innerHTML = entries.map(n => {
            const tags = n.tags ? (Array.isArray(n.tags) ? n.tags : [n.tags]) : [];
            const tagsHtml = tags.length
              ? '<div class="note-tags">' + tags.map(t => '<span>' + t + '</span>').join('') + '</div>'
              : '';
            return `<div class="note-entry">
              <h3>${n.title}</h3>
              <div class="note-meta"><span>${n.date}</span></div>
              <div class="note-body">${marked.parse(n.body)}</div>
              ${tagsHtml}
            </div>`;
          }).join('');
        });
      })
      .catch(() => {
        notesList.innerHTML = '<p class="loading-msg">No notes yet.</p>';
      });
  }

})();
