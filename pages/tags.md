---
layout: page
title: 标签
permalink: /tags/
sidebar: false
---

<div class="tags-page">
  {% if site.tags.size > 0 %}
  <div class="tagcloud" style="margin-bottom: 2rem;">
    {% for tag in site.tags %}
    <a href="#{{ tag[0] | slugify }}" class="tag-cloud-link">{{ tag[0] }} ({{ tag[1].size }})</a>
    {% endfor %}
  </div>

  {% for tag in site.tags %}
  <section class="tag-group" id="{{ tag[0] | slugify }}">
    <h2>{{ tag[0] }}</h2>
    <ul>
      {% for post in tag[1] %}
      <li>
        <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
        <span class="post-date">{{ post.date | date: "%B %d, %Y" }}</span>
      </li>
      {% endfor %}
    </ul>
  </section>
  {% endfor %}
  {% else %}
  <p>No tags yet. Check back soon!</p>
  {% endif %}
</div>
