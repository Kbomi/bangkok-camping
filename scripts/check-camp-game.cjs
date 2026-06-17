const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "public/game.html"), "utf8");

const requiredAssets = [
  "public/assets/camp-game/main/camp.png",
  "public/assets/camp-game/fire/fire_big.png",
  "public/assets/camp-game/fire/fire_low.png",
  "public/assets/camp-game/fire/fire_out.png",
  "public/assets/camp-game/radio/radio.png",
  "public/assets/camp-game/lamp/lamp_on.png",
  "public/assets/camp-game/lamp/lamp_off.png",
  "public/assets/camp-game/tent/tent_closed.png",
  "public/assets/camp-game/tent/tent_open_50.png",
  "public/assets/camp-game/tent/tent_open.png",
  "public/assets/camp-game/ui/tap.png",
];

const checks = [
  ["uses 16:9 game frame", /aspect-ratio:\s*16\s*\/\s*9/.test(html)],
  ["has first-person camp scene", /class="[^"]*\bmain-scene\b[^"]*"/.test(html)],
  ["main scene uses camp asset", /assets\/camp-game\/main\/camp\.png/.test(html)],
  ["main scene uses separate fire assets", /fire_big\.png/.test(html) && /fire_low\.png/.test(html) && /fire_out\.png/.test(html)],
  ["fire has ember animation effect", /fire-embers/.test(html) && /emberFloat/.test(html)],
  ["fire uses fixed visual frame", /fire-frame/.test(html) && !/--fire-size/.test(html)],
  ["fire image itself is not animated", !/\.fire-sprite\s*\{[^}]*animation\s*:/s.test(html) && !/firePulse|emberDrift/.test(html)],
  ["radio uses one image asset", /radio\.png/.test(html) && !/radio_on\.png|radio_off\.png/.test(html)],
  ["radio renders five music notes", (html.match(/class="note"/g) || []).length === 5],
  ["lamp has on and off assets", /lamp_on\.png/.test(html) && /lamp_off\.png/.test(html)],
  ["lamp uses stable frame sizing", /lamp-frame/.test(html) && /lamp-visual/.test(html)],
  ["lamp uses background rendering for equal visual size", /backgroundImage/.test(html) && !/<img[^>]+id="lampImg"/.test(html)],
  ["tent has three image states", /tent_closed\.png/.test(html) && /tent_open_50\.png/.test(html) && /tent_open\.png/.test(html)],
  ["tentOpening overlay removed", !/tentOpening|tent-opening/.test(html)],
  ["does not use swipe navigation", !/swipe-left|swipe-right|swipe-back|handleSwipe|onPointerMove|--drag-x/.test(html)],
  ["radio is a tap object on main screen", /id="radioObject"/.test(html) && /data-action="radio"/.test(html)],
  ["lamp is a tap object on main screen", /id="lampObject"/.test(html) && /data-action="lamp"/.test(html)],
  ["tent is a tap object on main screen", /id="tentObject"/.test(html) && /data-action="tent"/.test(html)],
  ["uses fixed dark horror tone", /horror-static/.test(html) && /radioWhisper/.test(html)],
  ["images do not start native drag", /draggable="false"/.test(html) || /-webkit-user-drag:\s*none/.test(html)],
  ["tap maintains camp systems", /handleTap/.test(html)],
  ["fire weakens over time", /fireLevel/.test(html) && /decayFire/.test(html)],
  ["radio noise event exists", /radioNoise/.test(html)],
  ["lamp flicker event exists", /lampFlicker/.test(html)],
  ["rewards include pants and shoes", /pants/.test(html) && /shoes/.test(html)],
];

for (const asset of requiredAssets) {
  checks.push([`asset exists: ${asset}`, fs.existsSync(path.join(root, asset))]);
}

const failed = checks.filter(([, ok]) => !ok);

if (failed.length > 0) {
  console.error(`Camp game checks failed (${failed.length}):`);
  for (const [name] of failed) {
    console.error(`- ${name}`);
  }
  process.exit(1);
}

console.log("Camp game checks passed");
