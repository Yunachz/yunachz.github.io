# V3 Software Icon Asset Sources & Verification

> Authoritative asset documentation for the 7 application icons in the Capabilities (Software) section.
> Prepared by Design-UI Worker (`term_2a3f6417-ad80-4512-bcc2-70a6312f6ef3`) for Luna (`term_894b9983-e287-4934-af9c-2a47786868a2`).
> All candidate files reside intact in `/tmp/fajar-v3-icons/canonical/`.

---

## 1. Icon Inventory & Source Registry

| App Name | Canonical Asset Path | Primary Source URL | Organization / Provenance | Format & License |
| --- | --- | --- | --- | --- |
| **MATLAB** | `/tmp/fajar-v3-icons/canonical/matlab.svg` | `https://raw.githubusercontent.com/devicons/devicon/master/icons/matlab/matlab-original.svg` | The MathWorks, Inc. / Devicon open-source icon set | SVG vector (MIT Devicon license / MathWorks trademark) |
| **Arduino IDE** | `/tmp/fajar-v3-icons/canonical/arduino-ide.svg` | `https://content.arduino.cc/brand/arduino_compressed-color.svg` | Arduino SA (Official Brand Repository) | SVG vector (Official Arduino brandmark) |
| **STM32Cube** | `/tmp/fajar-v3-icons/canonical/stm32cube.svg` | `https://raw.githubusercontent.com/STMicroelectronics/stm32-util-rot-provisioning/main/doc/subbrand-stm32.svg` | STMicroelectronics (Official GitHub Repository) | SVG vector (STMicroelectronics subbrand mark) |
| **Fusion** | `/tmp/fajar-v3-icons/canonical/fusion.svg` | `https://thesvg.org/icons/fusion/default.svg` *(also Wikimedia Commons `File:Fusion360_Logo.svg`)* | Autodesk, Inc. / Open vector library | SVG vector (Autodesk Fusion product mark) |
| **Altium** | `/tmp/fajar-v3-icons/canonical/altium.svg` | `https://commons.wikimedia.org/wiki/Special:FilePath/Altium_Logo.svg` *(and `Altium_Limited_logo.svg`)* | Altium LLC / Wikimedia Commons | SVG vector (Official Altium brandmark) |
| **Proteus** | `/tmp/fajar-v3-icons/canonical/proteus.png` | `https://www.labcenter.com/images/logo.png` *(also Wikipedia `Proteus_Design_Suite_Atom_Logo.png`)* | Labcenter Electronics Ltd (Official Website) | 512×352 RGBA PNG / Clean monogram fallback if vector-only |
| **TIA Portal** | `/tmp/fajar-v3-icons/canonical/tia-portal.svg` | `https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/siemens.svg` | Siemens AG (Corporate brand vector) / Simple Icons | SVG vector (CC0 Simple Icons / Siemens trademark) / Monogram fallback |

---

## 2. Visual Inspection & Legibility at 40px

Each candidate was inspected for rendering fidelity within the `80×80px` squircle translucent Apple glass tiles (`backdrop-filter: blur(20px) saturate(180%)`) on both technical daylight (light mode) and deep charcoal (dark mode):

1. **MATLAB (`matlab.svg`):**
   - Distinctive 3D L-shaped membrane with gradient shading (`#512`, `#fa8042`, `#49d`).
   - High contrast against translucent white (Light) and translucent dark slate (Dark).
   - Clear and instantly recognizable at 40×40px.

2. **Arduino IDE (`arduino-ide.svg`):**
   - Iconic teal (`#00979d`) infinity loop containing the internal plus and minus symbols.
   - High recognizability on light and dark glass surfaces; no color inversion needed.

3. **STM32Cube (`stm32cube.svg`):**
   - Official circular blue badge (`#3CB4E6`) with the ST white butterfly symbol and bold "STM32" text.
   - Solid circular badge provides contrast against any backdrop, scaling down cleanly to 40px.

4. **Fusion (`fusion.svg`):**
   - Modern Autodesk Fusion 3D product block with vibrant industrial orange facets (`#ff6a00`, `#ff9548`) and crisp white lettermark.
   - Excellent pop and visual balance on glass tiles.

5. **Altium (`altium.svg`):**
   - Official Altium geometric brandmark in deep technical blue (`#1a67bb` / `#000000`).
   - Strong typographic silhouette; scales with crisp edges at 40px.

6. **Proteus (`proteus.png` / fallback):**
   - Official Labcenter Proteus asset provides the authentic corporate identifier directly from `labcenter.com`.
   - If Luna's pipeline strictly requires pure inline SVG without bitmap `<img>` tags, the existing clean SVG monogram (`P` in geometric container) remains available as a documented, honest fallback.

7. **TIA Portal (`tia-portal.svg` / fallback):**
   - Official Siemens AG corporate vector mark in Siemens petrol/teal (`#00646E`).
   - High contrast and crisp letterforms. If specific TIA Portal product lettering is preferred, Luna's clean monogram (`TIA`) can be retained alongside this vector.

---

## 3. Recommended Luna Integration

Luna can copy the canonical assets directly:
```bash
cp /tmp/fajar-v3-icons/canonical/matlab.svg public/assets/software/matlab.svg
cp /tmp/fajar-v3-icons/canonical/arduino-ide.svg public/assets/software/arduino-ide.svg
cp /tmp/fajar-v3-icons/canonical/stm32cube.svg public/assets/software/stm32cube.svg
cp /tmp/fajar-v3-icons/canonical/fusion.svg public/assets/software/fusion.svg
cp /tmp/fajar-v3-icons/canonical/altium.svg public/assets/software/altium.svg
cp /tmp/fajar-v3-icons/canonical/tia-portal.svg public/assets/software/tia-portal.svg
```

For Proteus, Luna can either:
- Use `/tmp/fajar-v3-icons/canonical/proteus.png` directly, or
- Retain `public/assets/software/proteus.svg` as the verified vector fallback.
