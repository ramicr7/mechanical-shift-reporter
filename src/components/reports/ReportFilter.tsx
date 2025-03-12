
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, Check, Filter, Search, X } from "lucide-react";
import { Area, Priority, Status, AREAS } from "@/utils/reportUtils";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ReportFilterProps {
  onFilterChange: (filters: {
    search?: string;
    status?: Status[];
    priority?: Priority[];
    area?: Area[];
    dateFrom?: Date;
    dateTo?: Date;
  }) => void;
}

const ReportFilter = ({ onFilterChange }: ReportFilterProps) => {
  const [search, setSearch] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Filter states
  const [selectedStatuses, setSelectedStatuses] = useState<Status[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<Priority[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<Area[]>([]);
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    applyFilters(e.target.value);
  };
  
  const handleStatusChange = (status: Status) => {
    const updated = selectedStatuses.includes(status)
      ? selectedStatuses.filter(s => s !== status)
      : [...selectedStatuses, status];
    
    setSelectedStatuses(updated);
    applyFilters(search, { status: updated });
  };
  
  const handlePriorityChange = (priority: Priority) => {
    const updated = selectedPriorities.includes(priority)
      ? selectedPriorities.filter(p => p !== priority)
      : [...selectedPriorities, priority];
    
    setSelectedPriorities(updated);
    applyFilters(search, { priority: updated });
  };
  
  const handleAreaChange = (area: Area) => {
    const updated = selectedAreas.includes(area)
      ? selectedAreas.filter(a => a !== area)
      : [...selectedAreas, area];
    
    setSelectedAreas(updated);
    applyFilters(search, { area: updated });
  };
  
  const applyFilters = (
    searchTerm = search,
    overrides: {
      status?: Status[];
      priority?: Priority[];
      area?: Area[];
      dateFrom?: Date;
      dateTo?: Date;
    } = {}
  ) => {
    onFilterChange({
      search: searchTerm || undefined,
      status: overrides.status || (selectedStatuses.length > 0 ? selectedStatuses : undefined),
      priority: overrides.priority || (selectedPriorities.length > 0 ? selectedPriorities : undefined),
      area: overrides.area || (selectedAreas.length > 0 ? selectedAreas : undefined),
      dateFrom: overrides.dateFrom !== undefined ? overrides.dateFrom : dateFrom,
      dateTo: overrides.dateTo !== undefined ? overrides.dateTo : dateTo,
    });
  };
  
  const resetFilters = () => {
    setSearch("");
    setSelectedStatuses([]);
    setSelectedPriorities([]);
    setSelectedAreas([]);
    setDateFrom(undefined);
    setDateTo(undefined);
    onFilterChange({});
  };
  
  const anyFiltersActive = 
    selectedStatuses.length > 0 || 
    selectedPriorities.length > 0 || 
    selectedAreas.length > 0 || 
    !!dateFrom || 
    !!dateTo || 
    !!search;
  
  return (
    <Card className="border border-gray-200 overflow-hidden">
      <div className="p-4">
        <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-9"
              placeholder="Search by title or description"
              value={search}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              className="flex items-center"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Filter className="h-4 w-4 mr-2" />
              <span>Filters</span>
              {anyFiltersActive && (
                <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                  {selectedStatuses.length + selectedPriorities.length + selectedAreas.length + (dateFrom ? 1 : 0) + (dateTo ? 1 : 0) + (search ? 1 : 0)}
                </span>
              )}
            </Button>
            
            {anyFiltersActive && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-gray-500"
              >
                <X className="h-4 w-4 mr-1" />
                <span>Clear</span>
              </Button>
            )}
          </div>
        </div>
        
        {isExpanded && (
          <div className="mt-4 border-t border-gray-200 pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h3 className="text-sm font-medium mb-3">Status</h3>
              <div className="space-y-2">
                {(['Open', 'Ongoing', 'Closed'] as Status[]).map((status) => (
                  <div key={status} className="flex items-center">
                    <Checkbox
                      id={`status-${status}`}
                      checked={selectedStatuses.includes(status)}
                      onCheckedChange={() => handleStatusChange(status)}
                    />
                    <Label
                      htmlFor={`status-${status}`}
                      className="ml-2 cursor-pointer"
                    >
                      {status}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-3">Priority</h3>
              <div className="space-y-2">
                {(['High', 'Medium', 'Low'] as Priority[]).map((priority) => (
                  <div key={priority} className="flex items-center">
                    <Checkbox
                      id={`priority-${priority}`}
                      checked={selectedPriorities.includes(priority)}
                      onCheckedChange={() => handlePriorityChange(priority)}
                    />
                    <Label
                      htmlFor={`priority-${priority}`}
                      className="ml-2 cursor-pointer"
                    >
                      {priority}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-3">Date Range</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="date-from" className="text-xs mb-1 block">
                    From
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date-from"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateFrom && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateFrom ? format(dateFrom, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateFrom}
                        onSelect={(date) => {
                          setDateFrom(date);
                          applyFilters(search, { dateFrom: date });
                        }}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <Label htmlFor="date-to" className="text-xs mb-1 block">
                    To
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date-to"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateTo && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateTo ? format(dateTo, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateTo}
                        onSelect={(date) => {
                          setDateTo(date);
                          applyFilters(search, { dateTo: date });
                        }}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-3">Area</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {AREAS.map((area) => (
                  <div key={area} className="flex items-center">
                    <Checkbox
                      id={`area-${area}`}
                      checked={selectedAreas.includes(area)}
                      onCheckedChange={() => handleAreaChange(area)}
                    />
                    <Label
                      htmlFor={`area-${area}`}
                      className="ml-2 cursor-pointer"
                    >
                      {area}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ReportFilter;
