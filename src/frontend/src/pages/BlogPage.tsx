import { Badge } from "@/components/ui/badge";
import { BookOpen, ChevronRight, Clock } from "lucide-react";

const posts = [
  {
    id: 1,
    title: "Benefits of Blood Donation: Why Your Body Loves It",
    category: "Health",
    readTime: "5 min",
    date: "March 5, 2026",
    excerpt:
      "Donating blood doesn't just save lives — it benefits the donor too. Regular blood donation reduces iron levels, lowers cardiovascular risk, and triggers the production of fresh red blood cells.",
    content: [
      "Donating blood is one of the most selfless acts anyone can do, but did you know it also benefits the donor?",
      "Regular donation reduces excess iron in the body, which has been linked to heart disease and cancer. Each donation stimulates the production of fresh red blood cells, improving oxygen transport.",
      "Studies show that regular donors live longer and have lower rates of certain cancers. The mini health check before each donation also helps detect conditions like anemia and high blood pressure early.",
    ],
    emoji: "❤️",
    color: "oklch(0.62 0.22 25)",
    tags: ["Health Benefits", "Donor Wellness"],
  },
  {
    id: 2,
    title: "Who Can Donate Blood? A Complete Eligibility Guide",
    category: "Education",
    readTime: "7 min",
    date: "February 28, 2026",
    excerpt:
      "Think you might not be eligible? Most healthy adults can donate blood. Learn about age requirements, health conditions, medications, and more in this comprehensive guide.",
    content: [
      "Most healthy adults aged 18-65 who weigh at least 50kg can donate blood. You should wait at least 56 days (8 weeks) between whole blood donations.",
      "You cannot donate if you have received a blood transfusion in the past 12 months, have tested positive for HIV, or have active cancer treatment.",
      "Common medications like blood thinners or recent antibiotics may temporarily defer you. Always consult the health screening team at the donation center.",
    ],
    emoji: "🩺",
    color: "oklch(0.55 0.2 240)",
    tags: ["Eligibility", "Guidelines"],
  },
  {
    id: 3,
    title: "Blood Donation Myths Debunked Once and For All",
    category: "Awareness",
    readTime: "6 min",
    date: "February 20, 2026",
    excerpt:
      'From "donating makes you weak" to "it hurts terribly" — we tackle the most common misconceptions about blood donation that stop people from saving lives.',
    content: [
      "Myth 1: Blood donation makes you weak for days. Fact: Most donors feel fine immediately after. Your body replaces the plasma within 24 hours and red blood cells within 4-6 weeks.",
      "Myth 2: You can get HIV from donating blood. Fact: Sterile, single-use needles are used for every donation. There is zero risk of infection from donating.",
      "Myth 3: People with tattoos can't donate. Fact: You can donate 6-12 months after getting a tattoo from a licensed parlor. Many tattooed people are active donors.",
    ],
    emoji: "🔬",
    color: "oklch(0.62 0.2 200)",
    tags: ["Myths", "Facts"],
  },
  {
    id: 4,
    title: "Is Blood Donation Safe? Everything You Need to Know",
    category: "Safety",
    readTime: "8 min",
    date: "February 12, 2026",
    excerpt:
      "Modern blood collection is one of the safest medical procedures. Learn about the rigorous safety protocols, what to expect, and how to prepare for your donation.",
    content: [
      "Blood donation is extremely safe for healthy adults. Before each donation, you'll undergo a mini health screening including blood pressure, hemoglobin, and pulse check.",
      "You'll donate approximately 450ml of blood — less than 10% of your total blood volume. This amount is safely replenished by your body within weeks.",
      "After donation, rest for 10-15 minutes and have a light snack. Avoid heavy lifting or strenuous exercise for the rest of the day. Stay well hydrated.",
    ],
    emoji: "🛡️",
    color: "oklch(0.62 0.18 140)",
    tags: ["Safety", "Procedures"],
  },
  {
    id: 5,
    title: "The Role of NGOs in India's Blood Supply Chain",
    category: "NGO",
    readTime: "5 min",
    date: "January 30, 2026",
    excerpt:
      "NGOs are the backbone of voluntary blood donation in India. Discover how organizations across the country are bridging the gap between donors and patients.",
    content: [
      "India needs approximately 14 million units of blood annually, but only about 11 million units are collected. NGOs play a critical role in bridging this 3 million unit gap.",
      "From organizing camps in colleges to mobilizing communities during festivals, NGOs create awareness and motivate first-time donors who might otherwise never visit a blood bank.",
      "LIFEDROP partners with NGOs to digitize camp management, track donation outcomes, and recognize top volunteer contributors.",
    ],
    emoji: "🤝",
    color: "oklch(0.65 0.16 60)",
    tags: ["NGO", "Community"],
  },
  {
    id: 6,
    title: "Understanding Blood Components: Whole Blood vs. Plasma",
    category: "Education",
    readTime: "6 min",
    date: "January 22, 2026",
    excerpt:
      "Did you know one donation can be separated into multiple components to help different patients? Learn about whole blood, plasma, platelets, and red cell components.",
    content: [
      "A single blood donation can be separated into three components: red blood cells, platelets, and plasma. This means one donation can potentially help up to three patients.",
      "Red blood cells carry oxygen and are used for anemia and surgical patients. Platelets help blood clot and are vital for cancer patients undergoing chemotherapy.",
      "Plasma contains proteins and antibodies and is used to treat burns, liver disease, and coagulation disorders. Fresh Frozen Plasma (FFP) has a 12-month shelf life.",
    ],
    emoji: "🧬",
    color: "oklch(0.58 0.2 320)",
    tags: ["Education", "Science"],
  },
];

export function BlogPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-6"
          style={{
            backgroundColor: "oklch(var(--neon-red) / 0.1)",
            color: "oklch(var(--neon-red))",
            border: "1px solid oklch(var(--neon-red) / 0.25)",
          }}
        >
          <BookOpen className="h-4 w-4" />
          Awareness & Education
        </div>
        <h1 className="font-display text-4xl font-black mb-3">
          Blood Donation Blog
        </h1>
        <p className="text-muted-foreground">
          Facts, guides, and stories about blood donation and saving lives
        </p>
      </div>

      {/* Featured Post */}
      <div
        className="mb-10 rounded-2xl p-8 relative overflow-hidden"
        style={{
          border: `1px solid ${posts[0].color.replace(")", " / 0.3)")}`,
          backgroundColor: `${posts[0].color.replace(")", " / 0.06)")}`,
        }}
      >
        <div
          className="absolute top-4 right-4 text-6xl opacity-20"
          aria-hidden="true"
        >
          {posts[0].emoji}
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Badge
              variant="outline"
              style={{
                borderColor: posts[0].color.replace(")", " / 0.4)"),
                color: posts[0].color,
              }}
            >
              {posts[0].category}
            </Badge>
            <span className="text-xs text-muted-foreground">Featured</span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-black mb-3">
            {posts[0].title}
          </h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            {posts[0].excerpt}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {posts[0].readTime} read
            </div>
            <span>{posts[0].date}</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.slice(1).map((post, i) => (
          <article
            key={post.id}
            data-ocid={`blog.post.item.${i + 1}`}
            className="rounded-xl card-dark hover:border-primary/30 transition-all cursor-pointer group"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{
                    backgroundColor: `${post.color.replace(")", " / 0.1)")}`,
                  }}
                >
                  {post.emoji}
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform mt-3.5" />
              </div>

              <div className="flex items-center gap-2 mb-3">
                <Badge
                  variant="outline"
                  className="text-xs"
                  style={{
                    borderColor: `${post.color.replace(")", " / 0.3)")}`,
                    color: post.color,
                  }}
                >
                  {post.category}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 inline mr-0.5" />
                  {post.readTime}
                </span>
              </div>

              <h3 className="font-semibold mb-2 leading-snug group-hover:text-foreground transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>
            </div>

            {/* Expanded content (always visible on large screens) */}
            <div
              className="px-6 pb-5 border-t"
              style={{ borderColor: "oklch(var(--border))" }}
            >
              <ul className="mt-4 space-y-2">
                {post.content.slice(0, 2).map((para) => (
                  <li
                    key={para.slice(0, 30)}
                    className="text-xs text-muted-foreground leading-relaxed line-clamp-2"
                  >
                    {para}
                  </li>
                ))}
              </ul>
              <div className="flex gap-2 mt-4 flex-wrap">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: "oklch(var(--secondary))",
                      color: "oklch(var(--muted-foreground))",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* CTA */}
      <div
        className="mt-16 text-center p-8 rounded-2xl"
        style={{
          background:
            "linear-gradient(135deg, oklch(var(--neon-red) / 0.08) 0%, transparent 100%)",
          border: "1px solid oklch(var(--neon-red) / 0.15)",
        }}
      >
        <div className="text-3xl mb-3">🩸</div>
        <h3 className="font-display text-2xl font-bold mb-2">
          Knowledge is the first step
        </h3>
        <p className="text-muted-foreground mb-4">
          Now that you know the facts, take the next step and register as a
          donor.
        </p>
      </div>
    </main>
  );
}
