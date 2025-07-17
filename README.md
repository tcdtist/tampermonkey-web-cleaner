# Tampermonkey Web Cleaner Scripts

This repository contains userscripts designed to improve browsing experience on popular websites by hiding unwanted UI blocks such as YouTube Shorts, Mixes, and Facebook Reels.

## Scripts

### YouTube Hide Blocks (`youtube-hide-blocks.user.js`)

- Automatically hides sections like Shorts, Popular Uploads, and YouTube Mix on YouTube homepage.
- Improves page cleanliness and browsing focus.

### Facebook Hide Blocks (`facebook-hide-blocks.user.js`)

- Hides Facebook Reels and other specified UI blocks based on keywords and container class names.
- Targets specific container elements to avoid affecting unrelated content.

## Usage

1. Install [Tampermonkey](https://www.tampermonkey.net/) extension on your browser (supports Chrome, Firefox, Edge, Safari, etc.).
2. Import the desired `.user.js` script from the `/scripts` folder into Tampermonkey.
3. The script will automatically run when you visit the target website.

## Customization

- Modify keywords or container classes directly inside the script to adjust which elements are hidden.
- You can add more scripts to the `/scripts` folder following the same pattern.

## Contribution

Feel free to open issues or submit pull requests to improve the scripts or add support for other websites.

## License

MIT License © [Thanh Dang]
