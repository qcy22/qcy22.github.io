// ASCII艺术和静态数据
const asciiArt = {
    cow: `
  _^_
 (o o)
(  V  )
--m-m------`,
    name: `
  ___        ____
 / _ \\      / __ \\
| |_) )    | |__| |
|  _ <     |  __  |
| |_) )    | |__| |
| ___/      \\____/
|_|`,
    beta: `
  _           _
 | |         | |
 | |__   ___ | |_    __
 |  _ \\ / _ \\| __| / _  |
 | |_) |  __/| |_ | (_| |
 |_ __/ \\___| \\__| \\__ _|
`,
    theta: `
  _    _           _           
 | |  | |         | |          
 | |_ | |__   ___ | |_    __ 
 | __||  _ \\ / _ \\| __| / _  |
 | |_ | | | |  __/| |_ | (_| |
  \\__||_| |_|\\___| \\__| \\__,_|
`
};

const help_text = `
🏁 Welcome, traveler of the Interwebs! 🏁

✨ This is your command playground. Try stuff. 
🚀 Pro tip: the shell gets sassier the more you poke it.

🧰 Useful tools:
  help             You're here already. Congrats.
  ls               Look around. It's... empty?
  echo [text]      Type. Reflect. Regret?
  date             The moment is now...ish.
  whoami           Discover your identity.
  clear            Cleanse the past. Start anew.
  math [expr]      Do math. No calculators allowed.
  cd [dir]         Pretend you're moving places.
  weather          Always sunny. Totally accurate.

📂 File Commands:
  touch [file]     Create a file out of thin air.
  cat [file]       Peek inside your creations.
  vim [file]       Edit stuff like it's 1991.

🎨 Bonus content:
  ascii [key]      Little text masterpieces.
    - cow          Moo-tiful art.
    - name         Name in lights.
    - beta, theta  Nerdy Greek vibes.
  donut [seconds]  Watch a donut spin. Yes, really.
  fortune          Random wisdom. Or nonsense.

📷 Image Functions:
  img [filename]   Display uploaded ASCII art image.
                   Use the "Upload Image" button to upload first.

🎨 Appearance:
  theme [dark|light]  Flip the vibe switch.

⚠️ Warning:
  Messing with time-space via this shell may void your warranty.
`;