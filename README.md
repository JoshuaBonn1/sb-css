# CSS Staggering Beauty

A GitHub Pages-ready static project that recreates the spirit of
Staggering Beauty as a stripped-down black garden eel. It is anchored at the
bottom center, where the bottom segment points directly at the mouse. The
equal-width segments above it follow that aiming motion with damping, so moving
the mouse back and forth sends a wiggle up the body. There is no visible page
text, no normal background treatment, no canvas, and no drawing library.

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
