import React from "react";
import type { PricingGroup } from "../types";

interface PricingTableProps {
  groups: PricingGroup[];
}

export function PricingTable({ groups }: PricingTableProps) {
  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <div key={group.title}>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-[#8C7B6B] mb-3 pb-2 border-b border-gray-200">
            {group.title}
          </h3>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-100">
              {group.items.map((item) => (
                <tr key={item.service} className="group">
                  <td className="py-3 pr-4">
                    <span className="font-medium text-[#2C2C2C]">{item.service}</span>
                    {item.notes && (
                      <span className="ml-2 text-xs text-[#8C7B6B]">{item.notes}</span>
                    )}
                  </td>
                  <td className="py-3 text-right whitespace-nowrap">
                    <span className="text-sm font-semibold text-[#2C2C2C]">
                      from{" "}
                      <span className="text-[#C0392B]">{item.from}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
