# CSS Staggering Beauty

A GitHub Pages-ready static project that recreates the spirit of
Staggering Beauty as a stripped-down black garden eel. It is anchored at the
bottom center, extends toward the center of the page, and keeps its body in a
straight stack of equal-width segments. There is no visible page text, no
normal background treatment, no canvas, and no drawing library; JavaScript only
tracks the pointer and writes CSS custom properties.

## Run locally

Open `index.html` directly in a browser, or serve the folder with any static
server:

```sh
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## GitHub Pages

Because the site is plain static HTML/CSS/JS at the repository root, GitHub
Pages can publish it directly from the branch root.
