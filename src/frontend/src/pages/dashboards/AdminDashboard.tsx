import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  Building2,
  CheckCircle,
  Loader2,
  Shield,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Role } from "../../backend.d";
import {
  useAllHospitals,
  useAllUsers,
  useApproveHospital,
  useBloodRequests,
} from "../../hooks/useQueries";

const roleColors: Record<string, string> = {
  donor: "oklch(0.62 0.22 25)",
  patient: "oklch(0.65 0.18 240)",
  hospital: "oklch(0.62 0.2 200)",
  bloodBank: "oklch(0.62 0.2 280)",
  ngo: "oklch(0.65 0.16 60)",
  volunteer: "oklch(0.65 0.2 140)",
  admin: "oklch(0.65 0.18 320)",
};

const roleLabels: Record<string, string> = {
  donor: "Donor",
  patient: "Patient",
  hospital: "Hospital",
  bloodBank: "Blood Bank",
  ngo: "NGO",
  volunteer: "Volunteer",
  admin: "Admin",
};

const urgencyColors: Record<string, string> = {
  low: "oklch(0.65 0.2 140)",
  medium: "oklch(0.75 0.18 70)",
  high: "oklch(0.68 0.2 40)",
  critical: "oklch(0.62 0.26 25)",
};

// Blood group distribution chart
function BloodGroupChart({ data }: { data: Record<string, number> }) {
  const groups = ["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−"];
  const hasData = Object.values(data).some((v) => v > 0);
  const max = Math.max(...Object.values(data), 1);
  return (
    <div className="rounded-xl card-dark p-5">
      <h3 className="font-semibold mb-4 text-sm">Blood Group Distribution</h3>
      {!hasData ? (
        <div
          className="text-center py-6 text-muted-foreground text-sm"
          data-ocid="admin.bloodgroup_chart.empty_state"
        >
          No donor data yet. Register donors to see the distribution.
        </div>
      ) : (
        <div className="space-y-2">
          {groups.map((group) => {
            const count = data[group] ?? 0;
            const pct = (count / max) * 100;
            return (
              <div
                key={group}
                className="flex items-center gap-3"
                data-ocid={`admin.chart.${group.replace("+", "pos").replace("−", "neg")}.chart_point`}
              >
                <div
                  className="w-8 text-xs font-bold text-right"
                  style={{ color: "oklch(var(--neon-red))" }}
                >
                  {group}
                </div>
                <div
                  className="flex-1 h-5 rounded-full overflow-hidden"
                  style={{ backgroundColor: "oklch(var(--secondary))" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: "oklch(var(--neon-red))",
                    }}
                  />
                </div>
                <div className="w-8 text-xs text-muted-foreground">{count}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function AdminDashboard() {
  const { data: users, isLoading: loadingUsers } = useAllUsers();
  const { data: hospitals, isLoading: loadingHospitals } = useAllHospitals();
  const { data: requests, isLoading: loadingRequests } = useBloodRequests();
  const approveHospital = useApproveHospital();

  const totalUsers = users?.length ?? 0;
  const totalDonors = users?.filter((u) => u.role === Role.donor).length ?? 0;
  const activeRequests = requests?.length ?? 0;
  const pendingHospitals = hospitals?.filter((h) => !h.isApproved).length ?? 0;

  const bgMap: Record<string, string> = {
    A_Positive: "A+",
    A_Negative: "A−",
    B_Positive: "B+",
    B_Negative: "B−",
    AB_Positive: "AB+",
    AB_Negative: "AB−",
    O_Positive: "O+",
    O_Negative: "O−",
  };
  const bloodGroupData: Record<string, number> = {};
  for (const u of users ?? []) {
    if (u.bloodGroup) {
      const label = bgMap[u.bloodGroup] ?? u.bloodGroup;
      bloodGroupData[label] = (bloodGroupData[label] ?? 0) + 1;
    }
  }

  const handleApprove = async (hospitalId: string, name: string) => {
    try {
      await approveHospital.mutateAsync(hospitalId);
      toast.success(`${name} has been approved!`);
    } catch {
      toast.error("Failed to approve hospital");
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-black mb-2 animate-cinema-enter">
        Admin <span style={{ color: "oklch(var(--neon-red))" }}>Dashboard</span>
      </h1>
      <p className="text-muted-foreground mb-8">
        Platform analytics and management
      </p>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Total Users",
            value: totalUsers,
            icon: <Users className="h-5 w-5" />,
            color: "oklch(0.65 0.18 240)",
          },
          {
            label: "Total Donors",
            value: totalDonors,
            icon: "🩸",
            color: "oklch(var(--neon-red))",
          },
          {
            label: "Active Requests",
            value: activeRequests,
            icon: <AlertTriangle className="h-5 w-5" />,
            color: "oklch(0.68 0.2 40)",
          },
          {
            label: "Pending Approvals",
            value: pendingHospitals,
            icon: <Building2 className="h-5 w-5" />,
            color: "oklch(0.75 0.18 70)",
          },
        ].map((card) => (
          <div key={card.label} className="rounded-xl card-dark p-5">
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-lg"
                style={{
                  backgroundColor: `${String(card.color).replace(")", " / 0.12)")}`,
                }}
              >
                <span style={{ color: card.color }}>{card.icon}</span>
              </div>
            </div>
            <div
              className="font-display text-3xl font-black"
              style={{ color: card.color }}
            >
              {loadingUsers || loadingHospitals ? "..." : card.value}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {card.label}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          {/* City demand - based on real blood requests */}
          <div className="rounded-xl card-dark p-5 mb-4">
            <h3 className="font-semibold mb-4 text-sm">
              City-wise Blood Requests
            </h3>
            {(() => {
              const cityMap: Record<string, number> = {};
              for (const r of requests ?? []) {
                cityMap[r.city] = (cityMap[r.city] ?? 0) + 1;
              }
              const entries = Object.entries(cityMap)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 6);
              const max = entries[0]?.[1] ?? 1;
              return entries.length === 0 ? (
                <div
                  className="text-center py-6 text-muted-foreground text-sm"
                  data-ocid="admin.city_demand.empty_state"
                >
                  No blood requests yet. Data will appear here once requests are
                  submitted.
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {entries.map(([city, count]) => {
                    const pct = Math.round((count / max) * 100);
                    return (
                      <div
                        key={city}
                        className="text-center p-3 rounded-lg"
                        style={{ backgroundColor: "oklch(var(--secondary))" }}
                      >
                        <div className="font-semibold text-sm truncate">
                          {city}
                        </div>
                        <div
                          className="h-1.5 rounded-full mt-2 mb-1"
                          style={{ backgroundColor: "oklch(var(--border))" }}
                        >
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: "oklch(var(--neon-red))",
                            }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {count} request{count !== 1 ? "s" : ""}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </div>

        <BloodGroupChart data={bloodGroupData} />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="users">
        <TabsList className="mb-4" data-ocid="admin.management.tab">
          <TabsTrigger value="users" data-ocid="admin.users.tab">
            Users ({totalUsers})
          </TabsTrigger>
          <TabsTrigger value="hospitals" data-ocid="admin.hospitals.tab">
            Hospitals ({hospitals?.length ?? 0})
          </TabsTrigger>
          <TabsTrigger value="requests" data-ocid="admin.requests.tab">
            Blood Requests ({activeRequests})
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users">
          {loadingUsers ? (
            <div
              className="p-8 text-center"
              data-ocid="admin.users.loading_state"
            >
              <Loader2
                className="h-6 w-6 animate-spin mx-auto"
                style={{ color: "oklch(var(--neon-red))" }}
              />
            </div>
          ) : !users || users.length === 0 ? (
            <div
              className="rounded-xl card-dark p-8 text-center"
              data-ocid="admin.users.empty_state"
            >
              <p className="text-muted-foreground">No users registered yet.</p>
            </div>
          ) : (
            <div
              className="rounded-xl card-dark overflow-hidden"
              data-ocid="admin.users.table"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr
                      style={{
                        borderBottom: "1px solid oklch(var(--border))",
                        backgroundColor: "oklch(var(--secondary))",
                      }}
                    >
                      <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">
                        Name
                      </th>
                      <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">
                        Email
                      </th>
                      <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">
                        Role
                      </th>
                      <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">
                        City
                      </th>
                      <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    className="divide-y"
                    style={{ borderColor: "oklch(var(--border))" }}
                  >
                    {users.slice(0, 20).map((user, i) => (
                      <tr
                        key={user.id.toString()}
                        data-ocid={`admin.user.row.${i + 1}`}
                        className="hover:bg-secondary/50 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium">{user.name}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs truncate max-w-xs">
                          {user.email}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="text-xs px-2 py-1 rounded-full font-medium"
                            style={{
                              backgroundColor: `${roleColors[user.role] ?? "oklch(var(--muted))"} / 0.12)`,
                              color:
                                roleColors[user.role] ??
                                "oklch(var(--muted-foreground))",
                            }}
                          >
                            {roleLabels[user.role] ?? user.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {user.city}
                        </td>
                        <td className="px-4 py-3">
                          {user.isVerified ? (
                            <CheckCircle
                              className="h-4 w-4"
                              style={{ color: "oklch(0.65 0.2 140)" }}
                            />
                          ) : (
                            <div className="h-4 w-4 rounded-full border border-muted-foreground" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Hospitals Tab */}
        <TabsContent value="hospitals">
          {loadingHospitals ? (
            <div
              className="p-8 text-center"
              data-ocid="admin.hospitals.loading_state"
            >
              <Loader2
                className="h-6 w-6 animate-spin mx-auto"
                style={{ color: "oklch(var(--neon-red))" }}
              />
            </div>
          ) : !hospitals || hospitals.length === 0 ? (
            <div
              className="rounded-xl card-dark p-8 text-center"
              data-ocid="admin.hospitals.empty_state"
            >
              <p className="text-muted-foreground">
                No hospitals registered yet.
              </p>
            </div>
          ) : (
            <div className="rounded-xl card-dark overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr
                      style={{
                        borderBottom: "1px solid oklch(var(--border))",
                        backgroundColor: "oklch(var(--secondary))",
                      }}
                    >
                      <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">
                        Hospital
                      </th>
                      <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">
                        License
                      </th>
                      <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">
                        Status
                      </th>
                      <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    className="divide-y"
                    style={{ borderColor: "oklch(var(--border))" }}
                  >
                    {hospitals.map((h, i) => (
                      <tr
                        key={h.userId.toString()}
                        data-ocid={`admin.hospital.row.${i + 1}`}
                        className="hover:bg-secondary/50 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium">
                          {h.hospitalName}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                          {h.licenseNumber}
                        </td>
                        <td className="px-4 py-3">
                          {h.isApproved ? (
                            <span
                              className="text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 w-fit"
                              style={{
                                backgroundColor: "oklch(0.65 0.2 140 / 0.1)",
                                color: "oklch(0.65 0.2 140)",
                              }}
                            >
                              <CheckCircle className="h-3 w-3" />
                              Approved
                            </span>
                          ) : (
                            <span
                              className="text-xs px-2 py-1 rounded-full font-medium"
                              style={{
                                backgroundColor: "oklch(0.75 0.18 70 / 0.1)",
                                color: "oklch(0.75 0.18 70)",
                              }}
                            >
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {!h.isApproved && (
                            <Button
                              size="sm"
                              className="text-xs h-7"
                              onClick={() =>
                                handleApprove(
                                  h.userId.toString(),
                                  h.hospitalName,
                                )
                              }
                              disabled={approveHospital.isPending}
                              data-ocid={`admin.approve_hospital.button.${i + 1}`}
                              style={{
                                backgroundColor: "oklch(0.65 0.2 140)",
                                color: "white",
                              }}
                            >
                              <Shield className="h-3 w-3 mr-1" />
                              Approve
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Blood Requests Tab */}
        <TabsContent value="requests">
          {loadingRequests ? (
            <div
              className="p-8 text-center"
              data-ocid="admin.requests.loading_state"
            >
              <Loader2
                className="h-6 w-6 animate-spin mx-auto"
                style={{ color: "oklch(var(--neon-red))" }}
              />
            </div>
          ) : !requests || requests.length === 0 ? (
            <div
              className="rounded-xl card-dark p-8 text-center"
              data-ocid="admin.requests.empty_state"
            >
              <p className="text-muted-foreground">No blood requests yet.</p>
            </div>
          ) : (
            <div className="rounded-xl card-dark overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr
                      style={{
                        borderBottom: "1px solid oklch(var(--border))",
                        backgroundColor: "oklch(var(--secondary))",
                      }}
                    >
                      <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">
                        Patient
                      </th>
                      <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">
                        Group
                      </th>
                      <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">
                        Hospital
                      </th>
                      <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">
                        City
                      </th>
                      <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">
                        Urgency
                      </th>
                      <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">
                        Qty (ml)
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    className="divide-y"
                    style={{ borderColor: "oklch(var(--border))" }}
                  >
                    {requests.slice(0, 20).map((req, i) => (
                      <tr
                        key={req.id.toString()}
                        data-ocid={`admin.request.row.${i + 1}`}
                        className="hover:bg-secondary/50 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium">
                          {req.patientName}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="font-display font-bold text-sm"
                            style={{ color: "oklch(var(--neon-red))" }}
                          >
                            {req.bloodGroup
                              .replace("_", "")
                              .replace("Positive", "+")
                              .replace("Negative", "−")}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {req.hospitalName}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {req.city}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
                            style={{
                              backgroundColor: `${urgencyColors[req.urgencyLevel] ?? "oklch(var(--muted))"} / 0.12)`,
                              color:
                                urgencyColors[req.urgencyLevel] ??
                                "oklch(var(--muted-foreground))",
                            }}
                          >
                            {req.urgencyLevel}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono">
                          {Number(req.quantityMl)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}
