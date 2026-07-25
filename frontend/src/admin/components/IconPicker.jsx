import { useMemo, useState } from "react";
import { FiCircle } from "react-icons/fi";

import { getIcon } from "../../website/pages/Services/serviceTemplate/iconRegistry";
import { ICON_GROUPS } from "../constants/iconNames";
import { Drawer } from "./Drawer";
import { SearchInput } from "./SearchInput";

// Icon Picker for repeater items (Benefits/Features/Process/Why Choose Us/
// Industries) - stores only the bare Feather icon name string (e.g.
// "FiFileText") in the database; the actual icon component is resolved at
// render time (here and on the public site) via serviceTemplate/iconRegistry,
// so nobody ever hand-writes icon import code.
export function IconPicker({ label, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const filteredGroups = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return ICON_GROUPS;
    return ICON_GROUPS.map((group) => ({
      ...group,
      icons: group.icons.filter((name) => name.toLowerCase().includes(query)),
    })).filter((group) => group.icons.length > 0);
  }, [q]);

  const SelectedIcon = value ? getIcon(value) : null;

  return (
    <div>
      {label ? <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-secondary/70">{label}</p> : null}
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-secondary/15 bg-secondary/5 text-secondary/60">
          {SelectedIcon ? <SelectedIcon className="h-5 w-5" aria-hidden="true" /> : <FiCircle className="h-5 w-5 opacity-30" aria-hidden="true" />}
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-lg border border-secondary/15 px-3 py-1.5 text-sm font-medium text-secondary hover:bg-secondary/5"
        >
          {value || "Choose icon"}
        </button>
        {value ? (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="rounded-lg border border-secondary/15 px-2.5 py-1.5 text-xs font-medium text-secondary/60 hover:bg-secondary/5"
          >
            Clear
          </button>
        ) : null}
      </div>

      <Drawer open={open} title="Choose an Icon" onClose={() => setOpen(false)}>
        <div className="mb-4">
          <SearchInput value={q} onChange={setQ} placeholder="Search icons..." />
        </div>

        {filteredGroups.length === 0 ? (
          <p className="py-8 text-center text-sm text-secondary/50">No icons match "{q}".</p>
        ) : (
          <div className="space-y-5">
            {filteredGroups.map((group) => (
              <div key={group.label}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-secondary/50">{group.label}</p>
                <div className="grid grid-cols-5 gap-2">
                  {group.icons.map((name) => {
                    const Icon = getIcon(name);
                    const isSelected = value === name;
                    return (
                      <button
                        key={name}
                        type="button"
                        title={name}
                        onClick={() => {
                          onChange(name);
                          setOpen(false);
                        }}
                        className={`flex flex-col items-center gap-1 rounded-lg border p-2.5 text-center transition-colors ${
                          isSelected
                            ? "border-brand-700 bg-brand-700/10 text-brand-700"
                            : "border-secondary/10 text-secondary/70 hover:border-brand-700/40 hover:bg-secondary/5"
                        }`}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                        <span className="w-full truncate text-[10px] leading-tight">{name.replace(/^Fi/, "")}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </Drawer>
    </div>
  );
}
