# Responsive audit

Measured in headless Chromium at 320, 360, 390, 430, 600, 768, 820, 1024, 1280, 1920 and 3840px.

## Method

- Horizontal overflow check on every element not inside a scroll/clip container
- Clipped-text check inside `overflow-hidden` wrappers
- Touch target size check (WCAG 2.2 AA 2.5.8, 24px minimum)
