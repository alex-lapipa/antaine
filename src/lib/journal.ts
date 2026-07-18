// "Views From The Edges" — Antaine Reilly's essays, migrated verbatim from the
// old Squarespace blog (subscription lapsed; content pulled from the CMS JSON).
// Block model keeps section headers ("h") distinct from prose ("p").

export type Block = { t: "h" | "p" | "sig"; text: string };
export type Post = {
  slug: string;
  title: string;
  kicker: string;
  published: string; // display
  iso: string;
  byline: string;
  dek: string;
  hue: number;
  img?: string; // MEDIA key
  blocks: Block[];
};

export const POSTS: Post[] = [
  {
    slug: "sirat",
    title: "The Worlds We Miss, and the Ones We Ignore: Sīrat",
    kicker: "Cinema · Oliver Laxe",
    published: "20 September 2025",
    iso: "2025-09-20",
    byline: "Antaine Reilly",
    hue: 12,
    img: "sirat",
    dek: "Oliver Laxe's Sīrat isn't just a film — it's a crossing. A visceral journey from the edge of subculture into the heart of something far more brutal and familiar.",
    blocks: [
      { t: "p", text: "This weekend, I watched Sīrat, the new film by Oliver Laxe. And I can say without hesitation—it's one of the most honest, immersive pieces of cinema I've seen in a very long time." },
      { t: "p", text: "It doesn't follow the rules. It doesn't even acknowledge them. And that's what makes it such a breath of fresh air." },
      { t: "h", text: "Something Real, At Last" },
      { t: "p", text: "Sīrat doesn't behave like most films. It moves in unexpected directions. It leaves space. It refuses to explain itself. Instead, it simply unfolds—visceral, brutal, intimate, and alive—like life itself when you're paying attention." },
      { t: "p", text: "It's not entertainment in the traditional sense. It's encounter. The kind of encounter that stays with you long after the credits roll." },
      { t: "p", text: "The cinematography alone is worth sitting in silence for: vast landscapes that feel sacred and feral at once, characters who carry the weight of their world in every gesture, and moments that allow the camera to linger long enough for discomfort to become meaning." },
      { t: "h", text: "A Window Into a Hidden World" },
      { t: "p", text: "Sīrat invites you into a world that most people never see—and never even imagine. A world lived far from institutions, screens, and algorithms. The film draws deeply from the underground free party and traveller culture—a world I remember vividly from the London of the '90s." },
      { t: "p", text: "But it doesn't use that world as decoration or exoticism. It's not trying to explain anything. It simply shows it with astonishing truth. The people, the landscapes, the logic of how they move, talk, and coexist. It feels lived-in, not portrayed. Not actors—presence." },
      { t: "p", text: "And then—unexpectedly, masterfully—it drags you from that world into another one. A world most of us actually do know. One that we've chosen to forget, or ignore. A system of cruelty and violence that is painfully real, painfully now, and almost never shown in mainstream media." },
      { t: "p", text: "This contrast is what makes Sīrat truly powerful. It lures you in with wild freedom, and then—without warning—it confronts you with the reality we've numbed ourselves against." },
      { t: "h", text: "Kangding Ray: Sound As Architecture" },
      { t: "p", text: "Part of what makes Sīrat so immersive is the sound. And not just sound design—the score by Kangding Ray." },
      { t: "p", text: "It's been nearly a decade since I last saw him live—back in 2015 at Sónar Barcelona, during the unforgettable Stroboscopic Artefacts showcase. That night his sound was a visceral force: raw, minimal, physically present. The kind of sonic architecture that only works through a massive rig—vibrating through the floor and the chest in equal measure." },
      { t: "p", text: "Now, with Sīrat, that same elusive energy is captured in film. Kangding Ray's music isn't ornamental—it's structural. It shapes the emotional space. It drives the atmosphere, sometimes subtly, sometimes overwhelmingly. It's what tension feels like when you can't name it. It's what loneliness sounds like in the open air." },
      { t: "p", text: "The film invites you to listen to sounds most people never hear—frequencies, rhythms, and silences that don't belong to any commercial narrative. And through that, it becomes even more effective in its final turn—when the silence gets filled with a much harsher, much more familiar noise." },
      { t: "h", text: "A Bold Work of Cinema" },
      { t: "p", text: "I'm not surprised Sīrat won the Jury Prize at Cannes. And now it's been officially selected as Spain's entry for Best International Feature at the Oscars. That's no small gesture. In fact, it's a major statement. Because Sīrat is not your typical \"Oscar film.\" It's not polished, polite, or aspirational." },
      { t: "p", text: "It's feral, fractured, and free. And that's what makes it beautiful." },
      { t: "p", text: "This is not festival bait. It's not prestige cinema. It's something rarer: a living document of a world most people overlook. And then a cold mirror to the one we all live in." },
      { t: "p", text: "Sīrat trusts stillness. It trusts ambiguity. It respects the viewer enough to ask them to sit with discomfort—without spoon-feeding, without manipulation." },
      { t: "h", text: "Watch It Properly" },
      { t: "p", text: "If you're going to see this film, see it properly. In a cinema, if possible. If not, then with proper sound, lights down, and no distractions. Let it pull you in. Let it disorient you. Let it remind you that cinema can still be real." },
      { t: "p", text: "To Oliver Laxe and everyone involved: thank you. This film woke something up." },
      { t: "p", text: "Because Sīrat doesn't just offer a new way of seeing—it forces us to remember." },
      { t: "p", text: "It opens a portal into a culture most people never get to see, and into a soundscape most people never learn how to hear. But in the end, it does something even more unsettling: it confronts us with a much darker world. One we've all brushed up against, but have chosen to forget. One that mainstream media rarely even talks about." },
      { t: "p", text: "And perhaps that's where the film's title lands its full weight." },
      { t: "p", text: "In Islamic tradition, the Sīrat is the bridge suspended over the fires of hell—a crossing that all souls must face after judgment. The faithful pass with ease. Others fall. Watching this film feels like walking that bridge: suspended between beauty and brutality, truth and denial, freedom and consequence." },
      { t: "p", text: "Sīrat does not tell you how to cross. It just asks that you open your eyes while you do." },
      { t: "sig", text: "—Antaine Reilly" },
    ],
  },
  {
    slug: "aphex-twin",
    title: "Richard David James :: :: Aphex Twin",
    kicker: "Sound · Warp Records",
    published: "17 April 2025",
    iso: "2025-04-17",
    byline: "Antaine Reilly",
    hue: 74,
    img: "aphex",
    dek: "A guy who builds machines, writes code, twists knobs — and clams up tighter than a drum when asked about any of it.",
    blocks: [
      { t: "p", text: "Richard David James, or as the cool kids and their moms call him, Aphex Twin, apparently has the most groundbreaking strategy to intrigue the masses: not talking about his music. Revolutionary or not, who cares? Here's a guy who builds machines, modifies others, writes code, uses open-source, twists knobs, and mashes buttons since the 90s to create sounds that some claim are sent directly from extraterrestrial beings, yet he clams up tighter than a drum when asked about it." },
      { t: "p", text: "Aphex's approach to public discourse is like that one friend who says, 'You just had to be there,' leaving you with a serious case of FOMO and a burning curiosity." },
      { t: "p", text: "Witnessing his rare interviews is like attending a séance—you hope for profound revelations but just end up with more mysteries. It's almost as if he enjoys watching us squirm as we try to decode the complexities of his tracks, which range from eerily melodic to the kind of beats that make you question the fabric of reality. His public engagements are a masterclass in evasion; he dives deep into the technical jungles of music production yet tiptoes around the emotional landscapes that his music often traverses." },
      { t: "p", text: "I've been to several of his live gigs in London, orchestrated by Warp Records between 1995 and 2003, and let me tell you, each was an avant-garde circus. The performances were less about the auditory experience and more about being sucked into a vortex of sensory overload. The visuals? A psychedelic trip without the side effects. The unpredictability of his sets? More twists than a daytime soap opera. These weren't concerts; they were full-blown experimental probes into the psyche of anyone willing to take the ride." },
      { t: "p", text: "In his rare public utterances and these mind-bending gigs, Aphex Twin doesn't just reject the conventional artist-audience chit-chat. He tosses it into a blender and hits pulverize. He forces us to interact with his art on its own wild, untamed terms—no hand-holding, no guided tours. Each encounter with his music or his musings is like trying to solve a Rubik's Cube that changes patterns just as you think you've got it sussed. And honestly, isn't that just the kind of enigmatic charm that keeps the cult of Aphex Twin alive and kicking?" },
      { t: "sig", text: "—Antaine Reilly" },
    ],
  },
];
