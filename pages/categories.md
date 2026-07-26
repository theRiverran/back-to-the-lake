---
layout: page
title: 分类
permalink: /categories/
sidebar: false
---

<div class="categories-page">
  {% for category in site.categories %}
  <section class="category-group" id="{{ category[0] | slugify }}">
    <h2>{{ category[0] }}</h2>
    <ul>
      {% for post in category[1] %}
      <li>
        <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
        <span class="post-date">{{ post.date | date: "%B %d, %Y" }}</span>
      </li>
      {% endfor %}
    </ul>
  </section>
  {% endfor %}

  {% if site.categories.size == 0 %}
  <p>No categories yet. Check back soon!</p>
  {% endif %}
</div>
