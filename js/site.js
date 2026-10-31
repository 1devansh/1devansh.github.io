/* Site script: writing line-up, blog list, post page, reveals, live counter. No frameworks. */
(function () {
  'use strict';

  // Old service workers from earlier versions of the site
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (rs) { rs.forEach(function (r) { r.unregister(); }); });
  }

  // ---------- helpers ----------
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function fmtDate(d) {
    var t = new Date(d + 'T00:00:00');
    if (isNaN(t)) return esc(d);
    return t.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  function tagsText(tags) {
    if (!tags) return '';
    return (Array.isArray(tags) ? tags : [tags]).join(', ');
  }
  function parseFrontMatter(text) {
    text = text.replace(/\r\n?/g, '\n');
    var m = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!m) return { meta: {}, body: text };
    var meta = {};
    m[1].split('\n').forEach(function (line) {
      var i = line.indexOf(':');
      if (i < 0) return;
      var key = line.slice(0, i).trim();
      var val = line.slice(i + 1).trim();
      if ((val[0] === '"' && val.slice(-1) === '"') || (val[0] === "'" && val.slice(-1) === "'")) val = val.slice(1, -1);
      if (val[0] === '[' && val.slice(-1) === ']') {
        val = val.slice(1, -1).split(',').map(function (s) { return s.trim().replace(/^["']|["']$/g, ''); });
      }
      meta[key] = val;
    });
    return { meta: meta, body: m[2] };
  }
  function readingTime(text) { return Math.max(1, Math.ceil(text.trim().split(/\s+/).length / 200)); }
  function md(text) { return window.marked ? marked.parse(text) : '<p>' + esc(text) + '</p>'; }

  function postRow(p) {
    return '<li><a class="item" href="post.html?slug=' + encodeURIComponent(p.slug) + '">' +
      '<span class="row"><span class="row__title">' + esc(p.title) + '</span>' +
      '<span class="row__dots"></span><span class="row__meta">' + fmtDate(p.date) + '</span></span>' +
      (p.excerpt ? '<span class="row__desc" style="display:block">' + esc(p.excerpt) + '</span>' : '') +
      '</a></li>';
  }
  function noteRow(n) {
    var tags = tagsText(n.tags);
    return '<li><details class="item"><summary class="row">' +
      '<span class="row__title">' + esc(n.title) + '</span>' +
      '<span class="row__dots"></span><span class="row__meta">' + fmtDate(n.date) + '</span>' +
      '<span class="plus" aria-hidden="true"></span>' +
      '</summary><div class="note">' + md(n.body) +
      (tags ? '<p class="tags">' + esc(tags) + '</p>' : '') + '</div></details></li>';
  }

  function loadPosts() {
    return fetch('content/blog/index.json').then(function (r) { return r.json(); }).catch(function () { return []; });
  }
  function loadNotes() {
    return fetch('content/notes/index.json').then(function (r) { return r.json(); }).then(function (notes) {
      return Promise.all(notes.map(function (n) {
        return fetch('content/notes/' + n.file).then(function (r) { return r.text(); }).then(function (t) {
          var fm = parseFrontMatter(t);
          return Object.assign({}, n, fm.meta, { body: fm.body });
        });
      }));
    }).catch(function () { return []; });
  }
  function byDate(a, b) { return new Date(b.date) - new Date(a.date); }

  // ---------- home: writing line-up ----------
  var writing = document.getElementById('writing-rows');
  if (writing) {
    Promise.all([loadPosts(), loadNotes()]).then(function (res) {
      var items = res[0].map(function (p) { return Object.assign({ kind: 'post' }, p); })
        .concat(res[1].map(function (n) { return Object.assign({ kind: 'note' }, n); }))
        .sort(byDate);
      writing.innerHTML = items.length
        ? items.map(function (it) { return it.kind === 'post' ? postRow(it) : noteRow(it); }).join('')
        : '<li class="loading">Nothing published yet.</li>';
    });
  }

  // ---------- blog index ----------
  var blogRows = document.getElementById('blog-rows');
  if (blogRows) {
    loadPosts().then(function (posts) {
      blogRows.innerHTML = posts.length
        ? posts.sort(byDate).map(postRow).join('')
        : '<li class="loading">No posts yet.</li>';
    });
  }

  // ---------- single post ----------
  var postBody = document.getElementById('post-content');
  var postTitle = document.getElementById('post-title');
  var postMeta = document.getElementById('post-meta');
  if (postBody && postTitle) {
    var slug = new URLSearchParams(location.search).get('slug');
    if (!slug) {
      postTitle.textContent = 'Post not found';
      postBody.innerHTML = '<p>No post was named. <a href="blog.html">See all posts</a>.</p>';
    } else {
      fetch('content/blog/' + encodeURIComponent(slug) + '.md')
        .then(function (r) { if (!r.ok) throw new Error('missing'); return r.text(); })
        .then(function (t) {
          var fm = parseFrontMatter(t);
          var title = fm.meta.title || slug;
          postTitle.textContent = title;
          document.title = title + ' | Devansh Sharma';
          var bits = [];
          if (fm.meta.date) bits.push('<span>' + fmtDate(fm.meta.date) + '</span>');
          bits.push('<span>' + readingTime(fm.body) + ' min read</span>');
          if (fm.meta.tags) bits.push('<span>' + esc(tagsText(fm.meta.tags)) + '</span>');
          postMeta.innerHTML = bits.join('');
          postBody.innerHTML = md(fm.body);
        })
        .catch(function () {
          postTitle.textContent = 'Post not found';
          postBody.innerHTML = '<p>This post doesn\'t exist. <a href="blog.html">See all posts</a>.</p>';
        });
    }
  }

})();
