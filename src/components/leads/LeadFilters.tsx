import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Calendar as CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface LeadFiltersProps {
  onFilterChange?: (filters: {
    search: string;
    callStatus: string;
    leadStatus: string;
    followUpDate: Date | undefined;
  }) => void;
}

const LeadFilters = ({ onFilterChange = () => {} }: LeadFiltersProps) => {
  const [search, setSearch] = useState("");
  const [callStatus, setCallStatus] = useState("");
  const [leadStatus, setLeadStatus] = useState("");
  const [followUpDate, setFollowUpDate] = useState<Date | undefined>(undefined);

  const handleFilterChange = () => {
    onFilterChange({
      search,
      callStatus: callStatus === "all_call_statuses" ? "" : callStatus,
      leadStatus: leadStatus === "all_lead_statuses" ? "" : leadStatus,
      followUpDate,
    });
  };

  const clearFilters = () => {
    setSearch("");
    setCallStatus("");
    setLeadStatus("");
    setFollowUpDate(undefined);
    onFilterChange({
      search: "",
      callStatus: "",
      leadStatus: "",
      followUpDate: undefined,
    });
  };

  return (
    <div className="w-full bg-white p-4 rounded-md shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row gap-3 items-end">
        {/* Search Input */}
        <div className="w-full md:w-1/4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search leads..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Call Status Filter */}
        <div className="w-full md:w-1/5">
          <Select value={callStatus} onValueChange={setCallStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Call Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_call_statuses">
                All Call Statuses
              </SelectItem>
              <SelectItem value="connected">Connected</SelectItem>
              <SelectItem value="not_connected">Not Connected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Lead Status Filter */}
        <div className="w-full md:w-1/5">
          <Select value={leadStatus} onValueChange={setLeadStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Lead Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_lead_statuses">
                All Lead Statuses
              </SelectItem>
              <SelectItem value="interested">Interested</SelectItem>
              <SelectItem value="not_interested">Not Interested</SelectItem>
              <SelectItem value="admission_taken">Admission Taken</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Follow-up Date Filter */}
        <div className="w-full md:w-1/5">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !followUpDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {followUpDate ? format(followUpDate, "PPP") : "Follow-up Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={followUpDate}
                onSelect={setFollowUpDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button onClick={handleFilterChange}>Apply Filters</Button>
          <Button variant="outline" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" /> Clear
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LeadFilters;
