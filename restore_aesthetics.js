const http = require('http');

function patchSection(id, payload) {
  const data = JSON.stringify(payload);
  const req = http.request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/sections/' + id,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
  }, res => {
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => console.log('Patched', id, res.statusCode));
  });
  req.write(data);
  req.end();
}

http.get('http://localhost:3000/api/pages/home', res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    const page = JSON.parse(body).data;
    page.sections.forEach(sec => {
      if (sec.type === 'services') {
        patchSection(sec.id, {
          fields: {
             subtitle: "What We Do",
             title: "Building <em>Digital</em><br>Experiences",
             description: "From brand identity to full-stack development, we cover the entire digital product spectrum with precision and care."
          },
          items: [
            { icon: '✦', title: 'Brand Identity', desc: "We craft distinctive visual identities that communicate your brand's values." },
            { icon: '◈', title: 'UI/UX Design', desc: "Human-centred design systems and interfaces that are beautiful and intuitive to use." },
            { icon: '⬡', title: 'Web Development', desc: "High-performance web applications built with modern frameworks, optimised for speed." },
            { icon: '◎', title: 'Motion & Animation', desc: "Dynamic micro-interactions and storytelling animations that bring life to your brand." },
            { icon: '⊞', title: 'Digital Strategy', desc: "Data-driven strategies and roadmaps to grow your digital presence." },
            { icon: '◇', title: 'Creative Direction', desc: "End-to-end creative oversight ensuring every touchpoint is compelling." }
          ]
        });
      }
      if (sec.type === 'testimonials') {
        patchSection(sec.id, {
          fields: {
            subtitle: "Client Voices",
            title: "Words From Our<br><em>Partners</em>",
            description: "Don't just take our word for it. Hear from the visionary founders and marketing leaders who trusted us with their brands."
          },
          items: [
            { initials: 'AM', name: 'Arjun Mehta', role: 'CEO, Luminary Studio', quote: "UrbanPixora transformed our digital identity from the ground up. The results exceeded every expectation — our conversions doubled." },
            { initials: 'PS', name: 'Priya Sharma', role: 'Head of Product, Nexus SaaS', quote: "Their team's ability to blend strategy with stunning visuals is unmatched. Every pixel felt intentional and purposeful." },
            { initials: 'RD', name: 'Rahul Desai', role: 'Founder, Vantage Fintech', quote: "Working with UrbanPixora felt like having a world-class creative team embedded in our startup. Fast, brilliant, and deeply collaborative." }
          ]
        });
      }
      if (sec.type === 'cta') {
        patchSection(sec.id, {
          fields: {
             title: "Ready to start your<br>next big project?",
             description: "Let's talk about your challenges and how we can solve them together."
          },
          items: [
             { label: "Get a Call Back", url: "/contact", style: "primary" },
             { label: "What We Do", url: "/projects", style: "secondary" }
          ]
        });
      }
    });
  });
});
