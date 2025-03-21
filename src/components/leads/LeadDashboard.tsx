import React, { useState } from "react";
import LeadFilters from "./LeadFilters";
import LeadTable from "./LeadTable";
import CallModal from "./CallModal";
import LeadDetailsModal from "./LeadDetailsModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, Users, Calendar, TrendingUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

// Define the Lead interface here instead of importing it
interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: string;
  callStatus: string;
  leadStatus: string;
  followUpDate: Date | null;
  lastContactedDate: Date | null;
  remarks: string;
}

interface LeadDashboardProps {
  leads?: Lead[];
  userRole?: "admin" | "user";
}

const LeadDashboard = ({
  leads = [
    {
      id: "1",
      name: "John Doe",
      phone: "+1 (555) 123-4567",
      email: "john.doe@example.com",
      source: "Website",
      callStatus: "Pending",
      leadStatus: "New",
      followUpDate: new Date(Date.now() + 86400000), // tomorrow
      lastContactedDate: null,
      remarks: "",
    },
    {
      id: "2",
      name: "Jane Smith",
      phone: "+1 (555) 987-6543",
      email: "jane.smith@example.com",
      source: "Referral",
      callStatus: "Connected",
      leadStatus: "Interested",
      followUpDate: new Date(Date.now() + 172800000), // day after tomorrow
      lastContactedDate: new Date(),
      remarks: "Interested in the science program",
    },
    {
      id: "3",
      name: "Michael Johnson",
      phone: "+1 (555) 456-7890",
      email: "michael.j@example.com",
      source: "Social Media",
      callStatus: "Not Connected",
      leadStatus: "New",
      followUpDate: new Date(Date.now() + 86400000), // tomorrow
      lastContactedDate: new Date(Date.now() - 86400000), // yesterday
      remarks: "Tried calling, no answer",
    },
    {
      id: "4",
      name: "Sarah Williams",
      phone: "+1 (555) 789-0123",
      email: "sarah.w@example.com",
      source: "Event",
      callStatus: "Connected",
      leadStatus: "Admission Taken",
      followUpDate: null,
      lastContactedDate: new Date(Date.now() - 172800000), // 2 days ago
      remarks: "Completed admission process",
    },
    {
      id: "5",
      name: "Robert Brown",
      phone: "+1 (555) 234-5678",
      email: "robert.b@example.com",
      source: "Website",
      callStatus: "Connected",
      leadStatus: "Not Interested",
      followUpDate: null,
      lastContactedDate: new Date(Date.now() - 259200000), // 3 days ago
      remarks: "Not interested at this time",
    },
  ],
  userRole = "user",
}: LeadDashboardProps) => {
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>(leads);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Stats for the dashboard
  const totalLeads = leads.length;
  const todayFollowUps = leads.filter(
    (lead) =>
      lead.followUpDate &&
      new Date(lead.followUpDate).toDateString() === new Date().toDateString(),
  ).length;
  const connectedCalls = leads.filter(
    (lead) => lead.callStatus === "Connected",
  ).length;
  const conversionRate = Math.round(
    (leads.filter((lead) => lead.leadStatus === "Admission Taken").length /
      totalLeads) *
      100,
  );

  const handleFilterChange = (filters: {
    search: string;
    callStatus: string;
    leadStatus: string;
    followUpDate: Date | undefined;
  }) => {
    let filtered = [...leads];

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchTerm) ||
          lead.phone.includes(filters.search) ||
          lead.email.toLowerCase().includes(searchTerm),
      );
    }

    // Filter by call status
    if (filters.callStatus) {
      filtered = filtered.filter(
        (lead) =>
          lead.callStatus.toLowerCase() === filters.callStatus.toLowerCase(),
      );
    }

    // Filter by lead status
    if (filters.leadStatus) {
      filtered = filtered.filter(
        (lead) =>
          lead.leadStatus.toLowerCase() === filters.leadStatus.toLowerCase(),
      );
    }

    // Filter by follow-up date
    if (filters.followUpDate) {
      const filterDate = new Date(filters.followUpDate).toDateString();
      filtered = filtered.filter(
        (lead) =>
          lead.followUpDate &&
          new Date(lead.followUpDate).toDateString() === filterDate,
      );
    }

    setFilteredLeads(filtered);
  };

  const handleCallLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsCallModalOpen(true);
  };

  const handleViewDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailsModalOpen(true);
  };

  const handleScheduleFollowUp = (lead: Lead) => {
    setSelectedLead(lead);
    setIsCallModalOpen(true); // Reusing call modal for follow-up scheduling
  };

  const handleSaveCallDisposition = (data: {
    callStatus: string;
    leadProgress: string;
    followUpDate?: Date;
    remarks: string;
  }) => {
    // In a real application, this would update the lead in the database
    console.log("Call disposition saved:", data);
    // For demo purposes, we could update the local state
    if (selectedLead) {
      const updatedLeads = leads.map((lead) => {
        if (lead.id === selectedLead.id) {
          return {
            ...lead,
            callStatus:
              data.callStatus === "connected" ? "Connected" : "Not Connected",
            leadStatus:
              data.leadProgress === "interested"
                ? "Interested"
                : data.leadProgress === "not_interested"
                  ? "Not Interested"
                  : "Admission Taken",
            followUpDate: data.followUpDate || lead.followUpDate,
            lastContactedDate: new Date(),
            remarks: data.remarks,
          };
        }
        return lead;
      });

      // Update both the full leads list and the filtered list
      setFilteredLeads(updatedLeads);
    }
  };

  return (
    <div className="w-full bg-background p-4 md:p-6 space-y-6">
      {/* Header with title and add button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Lead Dashboard</h1>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add New Lead
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-border hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
            <p className="text-xs text-muted-foreground">Assigned to you</p>
          </CardContent>
        </Card>

        <Card className="border border-border hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Follow-ups
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayFollowUps}</div>
            <p className="text-xs text-muted-foreground">Scheduled for today</p>
          </CardContent>
        </Card>

        <Card className="border border-border hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Connected Calls
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <Phone className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{connectedCalls}</div>
            <p className="text-xs text-muted-foreground">
              Out of {totalLeads} leads
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Conversion Rate
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <p className="text-xs text-muted-foreground">Admissions taken</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different lead views */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4 w-full max-w-md grid grid-cols-4">
          <TabsTrigger value="all">All Leads</TabsTrigger>
          <TabsTrigger value="today">Today's Follow-ups</TabsTrigger>
          <TabsTrigger value="interested">Interested</TabsTrigger>
          <TabsTrigger value="converted">Converted</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <LeadFilters onFilterChange={handleFilterChange} />
          <LeadTable
            leads={filteredLeads}
            onCallLead={handleCallLead}
            onViewDetails={handleViewDetails}
            onScheduleFollowUp={handleScheduleFollowUp}
          />
        </TabsContent>

        <TabsContent value="today" className="space-y-4">
          <LeadFilters onFilterChange={handleFilterChange} />
          <LeadTable
            leads={leads.filter(
              (lead) =>
                lead.followUpDate &&
                new Date(lead.followUpDate).toDateString() ===
                  new Date().toDateString(),
            )}
            onCallLead={handleCallLead}
            onViewDetails={handleViewDetails}
            onScheduleFollowUp={handleScheduleFollowUp}
          />
        </TabsContent>

        <TabsContent value="interested" className="space-y-4">
          <LeadFilters onFilterChange={handleFilterChange} />
          <LeadTable
            leads={leads.filter((lead) => lead.leadStatus === "Interested")}
            onCallLead={handleCallLead}
            onViewDetails={handleViewDetails}
            onScheduleFollowUp={handleScheduleFollowUp}
          />
        </TabsContent>

        <TabsContent value="converted" className="space-y-4">
          <LeadFilters onFilterChange={handleFilterChange} />
          <LeadTable
            leads={leads.filter(
              (lead) => lead.leadStatus === "Admission Taken",
            )}
            onCallLead={handleCallLead}
            onViewDetails={handleViewDetails}
            onScheduleFollowUp={handleScheduleFollowUp}
          />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {selectedLead && (
        <>
          <CallModal
            open={isCallModalOpen}
            onOpenChange={setIsCallModalOpen}
            leadName={selectedLead.name}
            leadPhone={selectedLead.phone}
            onSave={handleSaveCallDisposition}
          />

          <LeadDetailsModal
            open={isDetailsModalOpen}
            onOpenChange={setIsDetailsModalOpen}
            lead={{
              id: selectedLead.id,
              name: selectedLead.name,
              phone: selectedLead.phone,
              email: selectedLead.email,
              address: "123 Main St, Anytown, USA", // Placeholder
              source: selectedLead.source,
              status:
                selectedLead.leadStatus === "Admission Taken"
                  ? "Converted"
                  : selectedLead.leadStatus === "Not Interested"
                    ? "Closed"
                    : "In Progress",
              assignedTo: "Current User", // Placeholder
              createdAt: new Date(Date.now() - 1000000000), // Placeholder
              nextFollowUp: selectedLead.followUpDate,
              callHistory: [
                {
                  id: "CH-001",
                  date: selectedLead.lastContactedDate || new Date(),
                  status: selectedLead.callStatus as
                    | "Connected"
                    | "Not Connected",
                  disposition: selectedLead.leadStatus as
                    | "Interested"
                    | "Not Interested"
                    | "Admission Taken"
                    | null,
                  remarks: selectedLead.remarks,
                  agent: "Current User", // Placeholder
                },
              ],
              notes: selectedLead.remarks || "No notes available.",
            }}
          />
        </>
      )}
    </div>
  );
};

export default LeadDashboard;
