// themeData.js

export const THEME_CATEGORIES = {
  NATURE: "Nature Themes",
  ROYAL: "Royal Themes",
  MINIMAL: "Modern Themes",
  TECH: "Futuristic Themes",
  ARTISTIC: "Artistic Themes",
  SIGNATURE: "Signature Hotel Themes"
};

export const roomThemes = [
  // --- Nature Themes ---
  {
    id: "forest-nature",
    name: "Forest Theme",
    category: THEME_CATEGORIES.NATURE,
    description: "Deep woodland green tones, organic cedar scent, and ambient forest soundscape.",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
    gradient: "linear-gradient(135deg, #1b3d2f 0%, #3d7c58 100%)",
    accentColor: "#3d7c58"
  },
  {
    id: "ocean-breeze",
    name: "Ocean Theme",
    category: THEME_CATEGORIES.NATURE,
    description: "Bright azure details, marine botanicals, and gentle rolling waves audio track.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    gradient: "linear-gradient(135deg, #1b365d 0%, #4a90e2 100%)",
    accentColor: "#4a90e2"
  },
  {
    id: "mountain-retreat",
    name: "Mountain Theme",
    category: THEME_CATEGORIES.NATURE,
    description: "Cozy alpine gray wool textiles, log fire scent, and crisp high-altitude air flow.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    gradient: "linear-gradient(135deg, #374151 0%, #9ca3af 100%)",
    accentColor: "#9ca3af"
  },
  {
    id: "tropical-paradise",
    name: "Tropical Theme",
    category: THEME_CATEGORIES.NATURE,
    description: "Vibrant palm accents, hibiscus and coconut oils, and exotic songbirds ambiance.",
    image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1200&q=80",
    gradient: "linear-gradient(135deg, #0d7c85 0%, #b2db8d 100%)",
    accentColor: "#0d7c85"
  },
  {
    id: "zen-garden",
    name: "Zen Theme",
    category: THEME_CATEGORIES.NATURE,
    description: "Minimalist sand/pebble layouts, green tea scenting, and soft shakuhachi bamboo flute melody.",
    image: "https://images.unsplash.com/photo-1504618223053-559bdef9dd5a?auto=format&fit=crop&w=1200&q=80",
    gradient: "linear-gradient(135deg, #5c635b 0%, #a6af9b 100%)",
    accentColor: "#a6af9b"
  },

  // --- Royal Themes ---
  {
    id: "royal-palace",
    name: "Royal Palace",
    category: THEME_CATEGORIES.ROYAL,
    description: "Deep crimson velvets, imperial crest details, and classical royal strings playlist.",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    gradient: "linear-gradient(135deg, #5b0e2d 0%, #c5a880 100%)",
    accentColor: "#c5a880"
  },
  {
    id: "maharaja-palace",
    name: "Maharaja Theme",
    category: THEME_CATEGORIES.ROYAL,
    description: "Rich jewel-toned silks (saffron and emerald), royal sandalwood mist, and sitar compositions.",
    image: "/images/maharaja_theme.png",
    gradient: "linear-gradient(135deg, #b86214 0%, #c79a24 100%)",
    accentColor: "#c79a24"
  },
  {
    id: "victorian-royal",
    name: "Victorian Theme",
    category: THEME_CATEGORIES.ROYAL,
    description: "Elegant dark mahogany furniture, lace details, lavender tea scent, and harpsichord audio.",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    gradient: "linear-gradient(135deg, #443224 0%, #8d7764 100%)",
    accentColor: "#8d7764"
  },
  {
    id: "diamond-white-luxury",
    name: "Diamond Luxury Theme",
    category: THEME_CATEGORIES.ROYAL,
    description: "Polished white marble floor accents, crystal elements, white rose aroma, and quiet ambient harp.",
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
    gradient: "linear-gradient(135deg, #d1d5db 0%, #ffffff 100%)",
    accentColor: "#ffffff"
  },
  {
    id: "luxury-gold-suite",
    name: "Luxury Gold Suite",
    category: THEME_CATEGORIES.ROYAL,
    description: "Warm gilded details, satin sheets, vanilla orchid aroma, and grand piano melodies.",
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
    gradient: "linear-gradient(135deg, #7c581b 0%, #c5a880 100%)",
    accentColor: "#c5a880"
  },

  // --- Modern Themes ---
  {
    id: "scandinavian",
    name: "Scandinavian Theme",
    category: THEME_CATEGORIES.MINIMAL,
    description: "Light pine wood, cozy knitted blankets, pine forest mist, and warm acoustic guitar tracks.",
    image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80",
    gradient: "linear-gradient(135deg, #8b7d6b 0%, #dcd6cd 100%)",
    accentColor: "#dcd6cd"
  },
  {
    id: "minimal-white",
    name: "Minimal White Theme",
    category: THEME_CATEGORIES.MINIMAL,
    description: "Clean frameless bed, pure white linen, fresh cotton aroma, and soft pink-noise generator.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80",
    gradient: "linear-gradient(135deg, #e5e7eb 0%, #f9fafb 100%)",
    accentColor: "#9ca3af"
  },
  {
    id: "urban-chic",
    name: "Urban Chic Theme",
    category: THEME_CATEGORIES.MINIMAL,
    description: "Exposed brick walls, industrial metal finish, leather aromas, and lo-fi hip-hop beats.",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    gradient: "linear-gradient(135deg, #1f2937 0%, #4b5563 100%)",
    accentColor: "#4b5563"
  },
  {
    id: "monochrome-bw",
    name: "Monochrome Theme",
    category: THEME_CATEGORIES.MINIMAL,
    description: "High-contrast matte black and stark white furniture, charcoal filters, and quiet jazz piano.",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
    gradient: "linear-gradient(135deg, #000000 0%, #ffffff 100%)",
    accentColor: "#111827"
  },
  {
    id: "modern-glass",
    name: "Modern Glass Luxury",
    category: THEME_CATEGORIES.MINIMAL,
    description: "Floor-to-ceiling glass panel feel, sheer curtains, clean air purifier mist, and soundless serenity.",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    gradient: "linear-gradient(135deg, #6b7280 0%, #d1d5db 100%)",
    accentColor: "#9ca3af"
  },

  // --- Futuristic Themes ---
  {
    id: "cyberpunk-neon",
    name: "Cyberpunk Theme",
    category: THEME_CATEGORIES.TECH,
    description: "Vibrant neon-purple and cyan LED edge lights, ozone scent, and synthwave cyberbeats.",
    image: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80",
    gradient: "linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)",
    accentColor: "#06b6d4"
  },
  {
    id: "space-galaxy",
    name: "Space Galaxy Theme",
    category: THEME_CATEGORIES.TECH,
    description: "Nebula projector lighting, dark stardust tones, metallic eucalyptus scent, and deep cosmic drone.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    gradient: "linear-gradient(135deg, #0b132b 0%, #3a0ca3 100%)",
    accentColor: "#3a0ca3"
  },
  {
    id: "ai-smart-room",
    name: "AI Smart Room",
    category: THEME_CATEGORIES.TECH,
    description: "Smart voice-activated panel indicators, clean white light paths, fresh mint air, and ambient lo-fi.",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=80",
    gradient: "linear-gradient(135deg, #1e3a8a 0%, #60a5fa 100%)",
    accentColor: "#60a5fa"
  },
  {
    id: "matrix-digital",
    name: "Matrix Theme",
    category: THEME_CATEGORIES.TECH,
    description: "Vertical green coding accents, matrix stream projections, data center cold flow, and sub-bass ambient.",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    gradient: "linear-gradient(135deg, #064e3b 0%, #10b981 100%)",
    accentColor: "#10b981"
  },
  {
    id: "holographic-future",
    name: "Holographic Theme",
    category: THEME_CATEGORIES.TECH,
    description: "Iridescent glass decor, shifting color projection, subtle clean aroma, and sound healing frequencies.",
    image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=1200&q=80",
    gradient: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
    accentColor: "#8b5cf6"
  },

  // --- Artistic Themes ---
  {
    id: "boho-artistic",
    name: "Boho Theme",
    category: THEME_CATEGORIES.ARTISTIC,
    description: "Macrame details, potted ivy plants, patchouli incense scent, and soft acoustic indie folk music.",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
    gradient: "linear-gradient(135deg, #b45309 0%, #fbbf24 100%)",
    accentColor: "#b45309"
  },
  {
    id: "vintage-retro",
    name: "Vintage Theme",
    category: THEME_CATEGORIES.ARTISTIC,
    description: "1970s record player layout, mustard-yellow chair accents, amber lights, and old-school vinyl hiss sound.",
    image: "https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?auto=format&fit=crop&w=1200&q=80",
    gradient: "linear-gradient(135deg, #78350f 0%, #d97706 100%)",
    accentColor: "#d97706"
  },
  {
    id: "abstract-art",
    name: "Abstract Art Theme",
    category: THEME_CATEGORIES.ARTISTIC,
    description: "Bold hand-painted accent walls, designer light fixtures, jasmine aroma, and avant-garde jazz piano.",
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80",
    gradient: "linear-gradient(135deg, #db2777 0%, #4f46e5 100%)",
    accentColor: "#4f46e5"
  },
  {
    id: "mediterranean",
    name: "Mediterranean Theme",
    category: THEME_CATEGORIES.ARTISTIC,
    description: "Stucco white curves, cobalt-blue linens, citrus blossom mist, and Greek bouzouki acoustics.",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80",
    gradient: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
    accentColor: "#3b82f6"
  },
  {
    id: "paris-elegance",
    name: "Paris Elegance Theme",
    category: THEME_CATEGORIES.ARTISTIC,
    description: "Haussmann molding panels, velvet dining chairs, premium channel No. 5 scenting, and accordions.",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80",
    gradient: "linear-gradient(135deg, #4f3b21 0%, #a2825c 100%)",
    accentColor: "#a2825c"
  },

  // --- Signature Hotel Themes ---
  {
    id: "honeymoon-romantic",
    name: "Honeymoon Romantic Theme",
    category: THEME_CATEGORIES.SIGNATURE,
    description: "Canopy bed styling, dim rose light pathways, damask rose petals scent, and soft romantic violin.",
    image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=80",
    gradient: "linear-gradient(135deg, #991b1b 0%, #f43f5e 100%)",
    accentColor: "#f43f5e"
  },
  {
    id: "presidential-suite",
    name: "Presidential Suite Theme",
    category: THEME_CATEGORIES.SIGNATURE,
    description: "Grand master bedroom styling, premium leather details, sandalwood essence, and cello symphony.",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80",
    gradient: "linear-gradient(135deg, #1e1b18 0%, #c5a880 100%)",
    accentColor: "#c5a880"
  },
  {
    id: "business-executive",
    name: "Business Executive Theme",
    category: THEME_CATEGORIES.SIGNATURE,
    description: "Ergonomic leather study setup, high-speed active oxygen flow, focus white noise, and office lounge jazz.",
    image: "/images/business_executive.png",
    gradient: "linear-gradient(135deg, #1e293b 0%, #64748b 100%)",
    accentColor: "#64748b"
  },
  {
    id: "spa-relaxation",
    name: "Spa Relaxation Theme",
    category: THEME_CATEGORIES.SIGNATURE,
    description: "Plush organic robes layout, lavender & rosemary mist diffusion, and soothing tibetan singing bowls.",
    image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=1200&q=80",
    gradient: "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)",
    accentColor: "#14b8a6"
  },
  {
    id: "family-comfort",
    name: "Family Comfort Theme",
    category: THEME_CATEGORIES.SIGNATURE,
    description: "Plush cushions, kid-friendly snack bar setup, allergen-free air filtration, and warm cheerful acoustic.",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    gradient: "linear-gradient(135deg, #1c3d5a 0%, #3182ce 100%)",
    accentColor: "#3182ce"
  }
];
