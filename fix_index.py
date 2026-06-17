import re

def process_html(content: str) -> str:
    # Make sure it actually inserted properly
    if "Backed By" not in content:
        partners_section = """
  <!-- Partners Section -->
  <section class="section" style="padding-top: var(--space-8); padding-bottom: var(--space-8); background: var(--color-background-alt); border-bottom: 1px solid var(--color-border);">
    <div class="container text-center">
      <p class="section-label" style="margin-bottom: var(--space-4);">Backed By & Partnered With</p>
      <div style="display: flex; justify-content: center; align-items: center; gap: var(--space-8); flex-wrap: wrap;">
        <img src="african-impact-logo.png" alt="African Impact Challenge" class="partner-logo" />
        <div class="partner-logo" style="font-weight:bold; font-size:1.2rem; color:var(--color-neutral-400);">TechStars</div>
        <div class="partner-logo" style="font-weight:bold; font-size:1.2rem; color:var(--color-neutral-400);">AgFunder</div>
      </div>
    </div>
  </section>
"""
        content = content.replace("</section>\n\n  <!-- How It Works Section -->", f"</section>\n{partners_section}\n  <!-- How It Works Section -->")

    if "AgroRobotics Highlight" not in content:
        agrorobotics_section = """
  <!-- AgroRobotics Highlight -->
  <section class="section">
    <div class="container">
      <div class="agrorobotics-highlight animate-on-scroll">
        <div style="display: grid; grid-template-columns: 1fr; gap: var(--space-8); align-items: center; @media(min-width: 768px) { grid-template-columns: 1fr 1fr; }">
          <div style="padding-right: var(--space-4);">
            <span class="section-label" style="background: rgba(16, 185, 129, 0.2); color: #10b981;">Hardware Division</span>
            <h2 class="section-title" style="color: white; font-size: var(--font-size-4xl); margin-top: var(--space-2);">AgroRobotics: Autonomous Precision</h2>
            <p class="section-subtitle" style="color: rgba(255,255,255,0.8); margin-bottom: var(--space-6);">Deploy enterprise-grade scout drones and ground rovers seamlessly integrated with the AgroGuard Intelligence layer. Actionable insights instantly translate into automated field execution.</p>
            <ul style="list-style:none; padding:0; margin-bottom: var(--space-8); display:flex; flex-direction:column; gap:var(--space-3);">
              <li style="display:flex; align-items:center; gap:var(--space-2); color:rgba(255,255,255,0.9);">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Scout Drones with Multispectral Imaging
              </li>
              <li style="display:flex; align-items:center; gap:var(--space-2); color:rgba(255,255,255,0.9);">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Automated Spraying Rovers
              </li>
              <li style="display:flex; align-items:center; gap:var(--space-2); color:rgba(255,255,255,0.9);">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Real-time API Sync
              </li>
            </ul>
            <a href="agrorobotics.html" class="btn btn--primary">Explore Hardware Solutions</a>
          </div>
          <div>
             <div class="placeholder-image-container dark" style="height: 400px; border-radius: var(--radius-xl);">
               [ Drop Drone / Rover Product Photo Here ]
             </div>
          </div>
        </div>
      </div>
    </div>
  </section>
"""
        content = content.replace("</section>\n\n  <!-- Use Cases -->", f"</section>\n{agrorobotics_section}\n  <!-- Use Cases -->")

    return content

def main():
    with open('index.html', 'r') as f:
        content = f.read()

    content = process_html(content)

    with open('index.html', 'w') as f:
        f.write(content)

if __name__ == '__main__':
    main()
