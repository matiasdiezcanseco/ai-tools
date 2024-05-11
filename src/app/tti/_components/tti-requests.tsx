"use client";

import { useMemo, useState, type FC } from "react";
import TtiCard from "./tti-card";
import { type SelectTti } from "~/server/db/schema";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const TtiRequestsDisplay: FC<{ requests: SelectTti[] }> = ({
  requests = [],
}) => {
  const [filter, setFilter] = useState<string>();

  const filteredRequests = useMemo(() => {
    if (filter === "all") return requests;
    return filter
      ? requests.filter((request) => request.status === filter)
      : requests;
  }, [filter, requests]);

  const handleFilterChange = (value: string) => {
    setFilter(value);
  };

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-2xl font-semibold">Requests</h3>
      <Select onValueChange={handleFilterChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Status</SelectLabel>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="finished">Finished</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <div className="grid grid-cols-3 gap-2">
        {filteredRequests.map((request) => (
          <TtiCard key={request.id} tti={request} />
        ))}
      </div>
    </div>
  );
};

export default TtiRequestsDisplay;
