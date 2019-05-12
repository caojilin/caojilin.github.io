---
layout: gallery
title: せかい
no_menu_item: true # required only for this example website because of menu construction
support: [jquery, gallery]
---

Album 1

{% include gallery-layout.html gallery=site.data.galleries.college-1 id_number=1 %}

Album 2

{% include gallery-layout.html gallery=site.data.galleries.college-2 id_number=2 %}

<!-- This is an example gallery. All images licensed under [CC-BY-NC-SA license][license]. Check the [Git Repo][repo] for a copy of this license.

[license]: http://creativecommons.org/licenses/by-nc-sa/4.0/
[repo]: https://github.com/opieters/jekyll-gallery-example
 -->