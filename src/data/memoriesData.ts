import { Friend, Memory, RememberedQuote, RandomSnippet, ChapterId, HeroConfig, FinalSceneConfig, GroupConfig, ChapterInfo } from '../types';

export const INITIAL_FRIENDS: Friend[] = [
  {
    id: 'julian',
    name: 'Julian',
    role: 'The Navigator & Overthinker',
    portrait: './assets/aistudio/julian-portrait.jpg',
    personality: 'Never took a single casual photo without checking the golden hour angle. Drove 1,840 miles during these two months, complained about tire pressure 47 times, but never once said no to a 2 AM destination.',
    quote: '"Wait, is this road actually on Google Maps or are we in someone’s driveway?"',
    vibeTags: ['Spontaneous Driver', '35mm Film Addict', 'Playlist Gatekeeper'],
    connectedPhotos: [
      './assets/aistudio/julian-connected-1.jpg',
      './assets/aistudio/julian-connected-2.jpg',
      './assets/aistudio/julian-connected-3.jpg'
    ]
  },
  {
    id: 'maya',
    name: 'Maya',
    role: 'The Instigator & Documentarian',
    portrait: './assets/aistudio/maya-portrait.jpg',
    personality: 'Has 4,120 photos from just these eight weeks. Refused to let us stay home if the weather was above 68°F. The only reason we watched every single sunrise.',
    quote: '"Bro, let\'s go. We\'re losing the light."',
    vibeTags: ['Sunset Tracker', 'Zero Sleep Tolerance', 'Secret Softie'],
    connectedPhotos: [
      './assets/aistudio/maya-portrait-alt.jpg',
      './assets/aistudio/maya-connected-2.jpg',
      './assets/aistudio/maya-connected-3.jpg'
    ]
  },
  {
    id: 'leo',
    name: 'Leo',
    role: 'The Wildcard & Midnight Chef',
    portrait: './assets/aistudio/leo-portrait.jpg',
    personality: 'Orderer of garlic fries at 2:45 AM. Managed to drop his phone into a tide pool on day 11, retrieved it with a BBQ skewer, and somehow got it to work again. The person responsible for 90% of our laughter.',
    quote: '"Trust me, I know a shortcut that cuts off 4 minutes."',
    vibeTags: ['Aux Cord Anarchist', 'Late Night Cook', 'Master of Chaos'],
    connectedPhotos: [
      './assets/aistudio/leo-connected-1.jpg',
      './assets/aistudio/leo-connected-2.jpg',
      './assets/aistudio/leo-connected-3.jpg'
    ]
  }
];

export const INITIAL_MEMORIES: Memory[] = [
  // THE BEGINNING (July 1 - July 12)
  {
    id: 'mem-1',
    title: 'The Pact on the Hood of Julian’s Civic',
    caption: 'July 2, 8:40 PM. Day 2 of 60. The agreement was: zero excuses, no canceling plans, say yes to every detour.',
    story: 'We parked at the highest bluff overlooking the city harbor. Maya brought cherry sodas in glass bottles. We promised each other that this summer wouldn’t just be another season that passed by while we scrolled our feeds.',
    date: '02 JUL',
    time: '8:40 PM',
    location: 'North Bay Lookout',
    type: 'photo',
    imageUrl: './assets/aistudio/mem-1-pact.jpg',
    aspect: 'landscape',
    chapter: 'THE BEGINNING',
    people: ['Julian', 'Maya', 'Leo'],
    isHero: true,
    isRandomFavorite: true,
    rotation: -1
  },
  {
    id: 'mem-2',
    title: 'First Sunset Drive With Windows Frozen Open',
    caption: 'Julian’s rear window motor died, so we just embraced the freezing coastal air and blasted nostalgic indie songs.',
    story: 'Maya was hanging half out of the passenger seat capturing the golden clouds. Leo was passed out in the back surrounded by grocery bags of pita chips.',
    date: '05 JUL',
    time: '7:18 PM',
    location: 'Highway 1 Coastal Bend',
    type: 'photo',
    imageUrl: './assets/aistudio/mem-2-coastal-bend.jpg',
    aspect: 'portrait',
    chapter: 'THE BEGINNING',
    people: ['Julian', 'Maya'],
    rotation: 1.5
  },
  {
    id: 'mem-3',
    title: 'Pier Jump at Dawn',
    caption: 'We debated for 45 minutes on the wood planks. Then Leo just sprinted and jumped.',
    story: 'The water was icy, but the moment all three of us surfaced, laughing so hard we couldn’t tread water properly, we knew this summer was going to be completely different.',
    date: '09 JUL',
    time: '5:52 AM',
    location: 'Old Wharf Pier 7',
    type: 'photo',
    imageUrl: './assets/aistudio/mem-3-pier-jump.jpg',
    aspect: 'square',
    chapter: 'THE BEGINNING',
    people: ['Leo', 'Maya', 'Julian'],
    isRandomFavorite: true,
    rotation: -2
  },

  // THEN THIS HAPPENED... (July 13 - July 26)
  {
    id: 'mem-4',
    title: 'The 3:00 AM Diner Confessions',
    caption: 'Neon lights humming, cold coffee, and conversations you only ever have in the dead of night.',
    story: 'None of us had slept for 28 hours after the concert detour. We sat in booth #4 arguing about where we’d all be in ten years. Nobody wanted to admit how terrified we were of growing apart.',
    date: '16 JUL',
    time: '3:14 AM',
    location: 'Silver Star 24h Diner',
    type: 'photo',
    imageUrl: './assets/aistudio/mem-4-diner.jpg',
    aspect: 'landscape',
    chapter: 'THEN THIS HAPPENED...',
    people: ['Julian', 'Maya', 'Leo'],
    isHero: true,
    rotation: 1
  },
  {
    id: 'mem-5',
    title: 'Stranded in the Rainstorm',
    caption: 'Downpour started out of nowhere. We didn’t even bother running for cover.',
    story: 'We were completely soaked in under thirty seconds. Leo started playing the guitar solo to Bohemian Rhapsody on an imaginary tennis racket, and Maya nearly choked laughing.',
    date: '20 JUL',
    time: '4:25 PM',
    location: 'Pine Creek Campsite',
    type: 'video',
    isVideo: true,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    imageUrl: './assets/aistudio/mem-5-rainstorm.jpg',
    duration: '0:42',
    aspect: 'portrait',
    chapter: 'THEN THIS HAPPENED...',
    people: ['Leo', 'Julian'],
    isRandomFavorite: true,
    rotation: -1.5
  },
  {
    id: 'mem-6',
    title: 'The Rooftop Hammock Construction Disaster',
    caption: 'Engineering students shouldn’t be allowed near duct tape and brick chimneys.',
    story: 'It held for approximately four seconds before Julian slid into a potted fern. The picture Maya took captured the exact nanosecond of realization.',
    date: '24 JUL',
    time: '6:40 PM',
    location: 'Apartment 4B Fire Escape',
    type: 'candid',
    imageUrl: './assets/aistudio/mem-6-rooftop-hammock.jpg',
    aspect: 'landscape',
    chapter: 'THEN THIS HAPPENED...',
    people: ['Julian', 'Leo'],
    rotation: 2
  },

  // THE CHAOS (July 27 - August 10)
  {
    id: 'mem-7',
    title: 'The Shopping Cart Grand Prix',
    caption: 'Supermarket parking lot, midnight. Absolutely zero dignity, peak adrenaline.',
    story: 'We went to buy eggs. We returned with two watermelons, a rubber flamingo, zero eggs, and skinned knees. Best $14 we ever spent.',
    date: '31 JUL',
    time: '11:58 PM',
    location: 'Valley Mart Lot #3',
    type: 'candid',
    imageUrl: './assets/aistudio/maya-portrait-alt.jpg',
    aspect: 'landscape',
    chapter: 'THE CHAOS',
    people: ['Maya', 'Leo'],
    isRandomFavorite: true,
    rotation: -2.5
  },
  {
    id: 'mem-8',
    title: 'The Unplanned 8-Hour Desert Highway Detour',
    caption: '“I know a spot with insane stars.” We ended up at a closed gas station drinking peach tea.',
    story: 'Leo swore it was just 30 miles further. By 2 AM the temperature had dropped 20 degrees, the car was coughing on fumes, and the sky exploded into millions of silver needles.',
    date: '04 AUG',
    time: '1:45 AM',
    location: 'Mile Marker 142 Desert Cut',
    type: 'photo',
    imageUrl: './assets/aistudio/mem-8-desert-stars.jpg',
    aspect: 'ultrawide',
    chapter: 'THE CHAOS',
    people: ['Julian', 'Maya', 'Leo'],
    isHero: true,
    rotation: 0.5
  },
  {
    id: 'mem-9',
    title: 'Midnight Pasta Experiment Gone Wrong',
    caption: 'Who puts cinnamon in marinara sauce? Leo. Only Leo.',
    story: 'Smoke detector screamed for 12 minutes while Julian fanned it with a cardboard pizza box. We still ate it. Maya gave it a 3/10 for flavor, 10/10 for emotional impact.',
    date: '08 AUG',
    time: '12:35 AM',
    location: 'The Messy Kitchen',
    type: 'polaroid',
    imageUrl: './assets/aistudio/mem-9-pasta.jpg',
    aspect: 'square',
    chapter: 'THE CHAOS',
    people: ['Leo', 'Julian', 'Maya'],
    rotation: 3
  },

  // THE LITTLE MOMENTS (August 11 - August 22)
  {
    id: 'mem-10',
    title: 'We Were Supposed to Study',
    caption: '12 AUG, 3:47 PM. Three open textbooks, zero pages read, two hours analyzing Maya’s horoscope.',
    story: 'Julian tried to set a 25-minute Pomodoro timer. It lasted 4 minutes before Leo found an online quiz titled “Which 90s Cereal Mascot Matches Your Soul”.',
    date: '12 AUG',
    time: '3:47 PM',
    location: 'Downtown Public Library (Corner Table)',
    type: 'photo',
    imageUrl: './assets/aistudio/mem-10-library.jpg',
    aspect: 'landscape',
    chapter: 'THE LITTLE MOMENTS',
    people: ['Julian', 'Maya', 'Leo'],
    isRandomFavorite: true,
    rotation: -1
  },
  {
    id: 'mem-11',
    title: 'Golden Hour on the Concrete Seawall',
    caption: 'Dangling our feet above the evening tide, passing a box of cold pizza slices.',
    story: 'No music playing. Just the waves breaking against the barnacles and the sound of gulls. One of those rare quiet hours where nobody felt the urge to check their phone.',
    date: '16 AUG',
    time: '6:50 PM',
    location: 'South Jetty Seawall',
    type: 'photo',
    imageUrl: './assets/aistudio/mem-11-seawall.jpg',
    aspect: 'portrait',
    chapter: 'THE LITTLE MOMENTS',
    people: ['Maya', 'Julian'],
    rotation: 1.2
  },
  {
    id: 'mem-12',
    title: 'Nap Pile on the Living Room Floor',
    caption: 'Exhausted after 14 miles of coastal biking. Too tired to even climb into bed.',
    story: 'Maya was snoring softly into a throw pillow. Julian’s arm was asleep under Leo’s backpack. A moment so comfortable it felt like home.',
    date: '19 AUG',
    time: '5:10 PM',
    location: 'Sunroom Floor',
    type: 'candid',
    imageUrl: './assets/aistudio/mem-1-pact.jpg',
    aspect: 'square',
    chapter: 'THE LITTLE MOMENTS',
    people: ['Julian', 'Maya', 'Leo'],
    rotation: -2
  },

  // THE LAST DAYS (August 23 - August 31)
  {
    id: 'mem-13',
    title: 'The Final Bonfire at Driftwood Cove',
    caption: '26 AUG, 9:20 PM. We collected wood for three hours just to keep the fire going until 4 AM.',
    story: 'We burned old notes, laughed about the grocery cart race, and watched sparks fly into the black sky. It felt like time was slipping through our fingers like sand.',
    date: '26 AUG',
    time: '9:20 PM',
    location: 'Driftwood Cove',
    type: 'photo',
    imageUrl: './assets/aistudio/mem-13-bonfire.jpg',
    aspect: 'landscape',
    chapter: 'THE LAST DAYS',
    people: ['Julian', 'Maya', 'Leo'],
    isHero: true,
    isRandomFavorite: true,
    rotation: 0.5
  },
  {
    id: 'mem-14',
    title: 'Packing the Trunk',
    caption: '29 AUG, 4:15 PM. Fitting three lives, two boogie boards, and eight weeks of memories into a hatchback.',
    story: 'We spent half an hour arguing whether the inflatable flamingo had sentimental value. It stayed. Obviously.',
    date: '29 AUG',
    time: '4:15 PM',
    location: 'Driveway Curbside',
    type: 'photo',
    imageUrl: './assets/aistudio/mem-2-coastal-bend.jpg',
    aspect: 'portrait',
    chapter: 'THE LAST DAYS',
    people: ['Leo', 'Julian'],
    rotation: -1.8
  },
  {
    id: 'mem-15',
    title: 'The Quiet Drive Home',
    caption: '31 AUG, 8:40 PM. The last highway mile. Nobody touched the radio.',
    story: 'Two months went by like twenty seconds. We pulled into the driveway, turned off the headlights, and sat in the dark for five minutes just listening to the engine ticking cool.',
    date: '31 AUG',
    time: '8:40 PM',
    location: 'Suburban Turnoff (Mile 0)',
    type: 'photo',
    imageUrl: './assets/aistudio/mem-15-quiet-drive.jpg',
    aspect: 'landscape',
    chapter: 'THE LAST DAYS',
    people: ['Julian', 'Maya', 'Leo'],
    isHero: true,
    rotation: 0
  }
];

export const VIDEO_MEMORIES: Memory[] = [
  {
    id: 'vid-1',
    title: 'Golden Hour on the Open Coast',
    caption: 'Maya held the camera out the window for 12 continuous minutes without speaking.',
    date: '14 JUL',
    time: '6:48 PM',
    location: 'Route 101 Scenic Corridor',
    type: 'video',
    isVideo: true,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    imageUrl: './assets/aistudio/mem-8-desert-stars.jpg',
    duration: '0:34',
    aspect: 'landscape',
    chapter: 'THE BEGINNING',
    people: ['Maya', 'Julian']
  },
  {
    id: 'vid-2',
    title: 'Leo Trying to Flip a Pancake at 2 AM',
    caption: 'Spoiler: It landed on the top of the refrigerator. It stayed there for three days.',
    date: '28 JUL',
    time: '2:12 AM',
    location: 'Cottage Kitchenette',
    type: 'video',
    isVideo: true,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    imageUrl: './assets/aistudio/mem-9-pasta.jpg',
    duration: '0:18',
    aspect: 'portrait',
    chapter: 'THE CHAOS',
    people: ['Leo']
  },
  {
    id: 'vid-3',
    title: 'The Bridge Fog Rolling In',
    caption: 'We watched the entire city vanish into white smoke while shivering in wool sweaters.',
    date: '17 AUG',
    time: '7:30 PM',
    location: 'North Head Overlook',
    type: 'video',
    isVideo: true,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    imageUrl: './assets/aistudio/mem-13-bonfire.jpg',
    duration: '0:52',
    aspect: 'landscape',
    chapter: 'THE LITTLE MOMENTS',
    people: ['Julian', 'Maya', 'Leo']
  }
];

export const REMEMBERED_QUOTES: RememberedQuote[] = [
  {
    id: 'q-1',
    quote: '“Bro, let’s go. We’re losing the light.”',
    author: 'Maya',
    context: 'Yelled from the front lawn while Julian was tying his third shoe lace knot.',
    timestamp: '08 JUL • 7:15 PM',
    tag: 'Classic Maya'
  },
  {
    id: 'q-2',
    quote: '“5 minutes. I am literally walking down the stairs.”',
    author: 'Leo',
    context: 'He had not, in fact, gotten out of bed yet.',
    timestamp: '19 JUL • 11:42 AM',
    tag: 'The Big Lie'
  },
  {
    id: 'q-3',
    quote: '“If we get locked out tonight, we sleep on the porch. No drama.”',
    author: 'Julian',
    context: 'Right before locking the keys inside the apartment on the porch.',
    timestamp: '25 JUL • 10:04 PM',
    tag: 'Famous Last Words'
  },
  {
    id: 'q-4',
    quote: '“I’m actually coming. Don’t start the car without me.”',
    author: 'Maya',
    context: 'Texted while standing in line for iced matcha.',
    timestamp: '03 AUG • 2:10 PM',
    tag: 'Priorities'
  },
  {
    id: 'q-5',
    quote: '“We should definitely do this again every single summer forever.”',
    author: 'Leo',
    context: 'Said around the Driftwood Cove bonfire as embers floated toward the ocean.',
    timestamp: '26 AUG • 1:15 AM',
    tag: 'Unforgettable'
  },
  {
    id: 'q-6',
    quote: '“Don’t check what time it is. Once you check, tomorrow starts.”',
    author: 'Julian',
    context: 'Sitting on the seawall when the moon was highest.',
    timestamp: '15 AUG • 2:50 AM',
    tag: 'Time Capsule'
  }
];

export const RANDOM_SNIPPETS: RandomSnippet[] = [
  {
    id: 'rnd-1',
    type: 'chat',
    title: '3:42 AM Group Chat',
    content: 'Maya: ARE YOU ASLEEP\nLeo: I am outside your window with spicy nuggets\nJulian: It is literally a Tuesday morning\nLeo: NUGGETS DO NOT RESPECT THE CALENDAR',
    date: '21 JUL',
    metadata: 'iMessage screenshot'
  },
  {
    id: 'rnd-2',
    type: 'receipt',
    title: 'The $31.84 Emergency Dinner',
    subtitle: 'Silver Star Diner Booth #4',
    content: '1x Cheesy fries extra ranch\n1x Black coffee (refilled 4 times)\n1x Strawberry waffle\n1x Slice of peach pie\nTip: $12.00 (Julian felt bad for the waiter)',
    date: '16 JUL',
    metadata: 'Paper receipt saved in glove box'
  },
  {
    id: 'rnd-3',
    type: 'polaroid',
    title: 'The Blurry Gas Station Mirror',
    subtitle: 'None of our eyes were open at the same time',
    content: 'Leo attempted a cool thumbs up, Maya was blinking, Julian was trying to fit everyone in frame.',
    date: '06 AUG',
    imageUrl: './assets/aistudio/maya-portrait-alt.jpg',
    metadata: 'Fujifilm Instax Mini'
  },
  {
    id: 'rnd-4',
    type: 'chat',
    title: 'The Shortcut That Wasn’t',
    content: 'Julian: Leo where are we\nLeo: Technicalllly we are still in North America\nMaya: I am going to throw your shoe into the reservoir',
    date: '11 AUG',
    metadata: 'Signal group chat'
  }
];

export const CHAPTERS_INFO: Record<ChapterId, { title: string; subtitle: string; dateRange: string; desc: string }> = {
  'THE BEGINNING': {
    title: 'THE BEGINNING',
    subtitle: 'The first moments.',
    dateRange: 'JULY 01 — JULY 12',
    desc: 'Unpacked bags, cold cherry sodas on the car hood, and the strange feeling that something monumental had just begun.'
  },
  'THEN THIS HAPPENED...': {
    title: 'THEN THIS HAPPENED…',
    subtitle: 'Somehow, ordinary days became unforgettable.',
    dateRange: 'JULY 13 — JULY 26',
    desc: 'Rainstorms that soaked through our shoes, 3 AM diner debates, and the sudden realization that nobody was keeping score of time anymore.'
  },
  'THE CHAOS': {
    title: 'THE CHAOS',
    subtitle: 'Too many inside jokes. Too many random photos. Absolutely no regrets.',
    dateRange: 'JULY 27 — AUGUST 10',
    desc: 'Midnight supermarket races, desert detours with a dying battery, burnt midnight pasta, and laughing until our ribs physically ached.'
  },
  'THE LITTLE MOMENTS': {
    title: 'THE LITTLE MOMENTS',
    subtitle: 'The conversations. The laughs. The completely random pictures.',
    dateRange: 'AUGUST 11 — AUGUST 22',
    desc: 'Hours where nothing happened and yet everything did. Dangling feet off the seawall, coffee steam in the quiet morning, reading two pages of homework before abandoning it.'
  },
  'THE LAST DAYS': {
    title: 'THE LAST DAYS',
    subtitle: 'We didn’t realize how quickly two months could disappear.',
    dateRange: 'AUGUST 23 — AUGUST 31',
    desc: 'The quiet embers at Driftwood Cove, stuffing the hatchback trunk one final time, and the silent drive where no one wanted to speak first.'
  }
};

export const DEFAULT_HERO_CONFIG: HeroConfig = {
  eyebrow: 'A TIME CAPSULE • JUNE — AUGUST',
  title: 'TWO MONTHS.',
  subtitle: 'One Story.',
  description: 'Three friends. A thousand little moments that somehow became everything.',
  buttonText: 'ENTER OUR MEMORIES',
  bgImageUrl: './assets/aistudio/mem-1-pact.jpg',
  statBadge: '62 DAYS • 3 FRIENDS • 1,840 MILES'
};

export const DEFAULT_GROUP_CONFIG: GroupConfig = {
  groupPhotoUrl: './assets/aistudio/maya-portrait-alt.jpg',
  quote: '“We never took ourselves seriously, but we took every moment together by heart.”',
  caption: 'The three of us together.',
  mileMarker: 'MILE 840',
  headline: 'Three completely different people.',
  subheadline: 'Somehow, the perfect combination.',
  description: 'We argued over which radio station to play for 40 minutes at a time, took wrong exits on purpose, and ordered milkshakes at 1 AM. These sixty days would not have existed without each other.',
  groupPhotoCaption: '“We never took ourselves seriously, but we took every moment together by heart.”',
  statText: 'COLLECTIVE MEMORY • JULY 22'
};

export const DEFAULT_FINAL_SCENE_CONFIG: FinalSceneConfig = {
  eyebrow: 'EPILOGUE • AUGUST 31 • MILE 1,840',
  headline: 'IT WAS ONLY TWO MONTHS.',
  bigQuote: 'BUT SOMEHOW,\nIT FEELS LIKE A LIFETIME OF MEMORIES.',
  noteLine1: 'Three friends. One little chapter.',
  noteLine2: 'A memory we’ll keep forever.',
  closingSignoff: 'UNTIL THE NEXT ADVENTURE…',
  bgImageUrl: './assets/aistudio/maya-portrait-alt.jpg'
};
