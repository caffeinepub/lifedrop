import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useParams } from "@tanstack/react-router";
import { Award, Download, Droplets, Share2 } from "lucide-react";
import { toast } from "sonner";

const bloodGroupColors: Record<string, string> = {
  "A+": "oklch(0.62 0.22 25)",
  "A−": "oklch(0.55 0.2 30)",
  "B+": "oklch(0.58 0.22 25)",
  "B−": "oklch(0.52 0.2 28)",
  "AB+": "oklch(0.6 0.22 25)",
  "AB−": "oklch(0.56 0.2 27)",
  "O+": "oklch(0.64 0.24 25)",
  "O−": "oklch(0.58 0.22 26)",
};

function QRPattern({ seed }: { seed: string }) {
  // Generate a pseudo-QR pattern from the seed string
  const rows = 10;
  const cols = 10;
  const cells: boolean[][] = [];
  for (let r = 0; r < rows; r++) {
    cells[r] = [];
    for (let c = 0; c < cols; c++) {
      const charCode = seed.charCodeAt((r * cols + c) % seed.length) || 65;
      cells[r][c] = (charCode + r + c) % 3 !== 0;
    }
  }
  return (
    <div
      className="grid gap-0.5"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
    >
      {cells.flat().map((filled, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: static QR pattern cells
          key={i}
          className="w-3 h-3 rounded-sm"
          style={{
            backgroundColor: filled
              ? "oklch(var(--neon-red))"
              : "oklch(var(--secondary))",
          }}
        />
      ))}
    </div>
  );
}

// Mock donor data – in production this would come from backend
const mockDonors: Record<
  string,
  {
    name: string;
    bloodGroup: string;
    city: string;
    totalDonations: number;
    joinedDate: string;
    badge: string;
  }
> = {
  "donor-001": {
    name: "Rajesh Kumar",
    bloodGroup: "O+",
    city: "Chennai",
    totalDonations: 15,
    joinedDate: "Jan 2023",
    badge: "Gold Donor",
  },
  "donor-002": {
    name: "Priya Sharma",
    bloodGroup: "A+",
    city: "Mumbai",
    totalDonations: 7,
    joinedDate: "Mar 2024",
    badge: "Silver Donor",
  },
  "donor-003": {
    name: "Mohammed Ali",
    bloodGroup: "B+",
    city: "Hyderabad",
    totalDonations: 28,
    joinedDate: "Jun 2022",
    badge: "Life Saver",
  },
};

export function DonorIdPage() {
  const { id } = useParams({ strict: false }) as { id?: string };
  const donor = id ? (mockDonors[id] ?? null) : null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const handlePrint = () => {
    window.print();
  };

  if (!donor) {
    return (
      <main className="container mx-auto px-4 py-24 text-center">
        <div className="text-4xl mb-4">❓</div>
        <h1 className="font-display text-2xl font-bold mb-2">
          Donor Not Found
        </h1>
        <p className="text-muted-foreground">
          The donor ID <code className="font-mono text-sm">{id}</code> was not
          found.
        </p>
      </main>
    );
  }

  const bgColor =
    bloodGroupColors[donor.bloodGroup] ?? "oklch(var(--neon-red))";

  return (
    <main className="container mx-auto px-4 py-12 max-w-md">
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl font-black mb-2">
          Digital Donor ID
        </h1>
        <p className="text-muted-foreground text-sm">
          Official LIFEDROP Donor Card
        </p>
      </div>

      {/* ID Card */}
      <div
        className="rounded-2xl overflow-hidden shadow-neon-red relative print:shadow-none"
        style={{
          border: `2px solid ${bgColor.replace(")", " / 0.5)")}`,
        }}
      >
        {/* Card Header */}
        <div
          className="px-6 py-5 flex items-center justify-between relative overflow-hidden"
          style={{ backgroundColor: bgColor.replace(")", " / 0.15)") }}
        >
          <div
            className="absolute inset-0 opacity-5"
            style={{
              background: `radial-gradient(circle at 80% 50%, ${bgColor} 0%, transparent 60%)`,
            }}
          />
          <div className="relative z-10 flex items-center gap-3">
            <Droplets className="h-6 w-6" style={{ color: bgColor }} />
            <div>
              <div className="font-display font-black text-lg leading-none">
                LIFE<span style={{ color: bgColor }}>DROP</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Verified Donor Card
              </div>
            </div>
          </div>
          <div
            className="relative z-10 font-display text-4xl font-black"
            style={{ color: bgColor }}
          >
            {donor.bloodGroup}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6" style={{ backgroundColor: "oklch(var(--card))" }}>
          <div className="grid grid-cols-2 gap-6">
            <div>
              {/* Name */}
              <div className="mb-4">
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  Donor Name
                </div>
                <div className="font-display text-xl font-bold">
                  {donor.name}
                </div>
              </div>

              {/* City */}
              <div className="mb-4">
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  City
                </div>
                <div className="font-semibold text-sm">{donor.city}</div>
              </div>

              {/* Donations */}
              <div className="mb-4">
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  Total Donations
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className="font-display text-2xl font-black"
                    style={{ color: bgColor }}
                  >
                    {donor.totalDonations}
                  </span>
                  <span className="text-sm text-muted-foreground">units</span>
                </div>
              </div>

              {/* Badge */}
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  Badge
                </div>
                <Badge
                  variant="outline"
                  className="text-xs font-semibold"
                  style={{
                    borderColor: bgColor.replace(")", " / 0.4)"),
                    color: bgColor,
                  }}
                >
                  <Award className="h-3 w-3 mr-1" />
                  {donor.badge}
                </Badge>
              </div>
            </div>

            {/* QR Pattern */}
            <div className="flex flex-col items-center justify-center">
              <div
                className="p-3 rounded-xl"
                style={{ backgroundColor: "oklch(var(--secondary))" }}
              >
                <QRPattern seed={id ?? "lifedrop"} />
              </div>
              <div className="text-xs text-muted-foreground mt-2 font-mono">
                {id?.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Card Footer */}
          <div
            className="mt-5 pt-4 border-t flex items-center justify-between"
            style={{ borderColor: "oklch(var(--border))" }}
          >
            <div className="text-xs text-muted-foreground">
              Member since {donor.joinedDate}
            </div>
            <div
              className="text-xs font-mono px-2 py-1 rounded"
              style={{
                backgroundColor: bgColor.replace(")", " / 0.1)"),
                color: bgColor,
              }}
            >
              VERIFIED
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <Button
          variant="outline"
          className="flex-1"
          onClick={handlePrint}
          data-ocid="donor_id.print.button"
        >
          <Download className="h-4 w-4 mr-2" />
          Print Card
        </Button>
        <Button
          className="flex-1"
          onClick={handleShare}
          data-ocid="donor_id.share.button"
          style={{ backgroundColor: "oklch(var(--neon-red))", color: "white" }}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>

      {/* Try other donors */}
      <div
        className="mt-8 p-4 rounded-xl text-center"
        style={{ backgroundColor: "oklch(var(--secondary))" }}
      >
        <p className="text-sm text-muted-foreground mb-3">
          Try demo donor IDs:
        </p>
        <div className="flex gap-2 justify-center flex-wrap">
          {Object.keys(mockDonors).map((key) => (
            <a
              key={key}
              href={`/donor-id/${key}`}
              className="text-xs font-mono px-2 py-1 rounded hover:bg-primary/10 transition-colors"
              style={{
                backgroundColor: "oklch(var(--card))",
                border: "1px solid oklch(var(--border))",
                color: id === key ? "oklch(var(--neon-red))" : undefined,
              }}
            >
              {key}
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
