import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Eye, EyeOff, Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../../components/admin/PageHeader";
import EditorPanel from "../../components/admin/EditorPanel";
import { deleteItem, listItems, reorderItems, updateItem } from "../../services/admin/admin.service";
import { cn } from "../../utils/cn";

const iconButton = "rounded-md p-2 text-dim transition-colors hover:bg-white/5 hover:text-fg disabled:pointer-events-none disabled:opacity-30";

/** List + editor for one orderable collection, driven by its config. */
export default function CollectionPage({ config }) {
  const [items, setItems] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [editing, setEditing] = useState(null); // null | {} (new) | item
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    try {
      setItems(await listItems(config.resource));
      setLoadError(null);
    } catch (error) {
      setLoadError(error.message);
    }
  }, [config.resource]);

  useEffect(() => {
    load();
  }, [load]);

  const visibleItems = useMemo(() => {
    if (!items) return [];
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => `${config.primary(item)} ${config.secondary(item)}`.toLowerCase().includes(q));
  }, [items, query, config]);

  const move = async (index, direction) => {
    const next = [...items];
    const target = index + direction;
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
    try {
      setItems(await reorderItems(config.resource, next.map((i) => i._id)));
    } catch (error) {
      toast.error(error.message);
      load();
    }
  };

  const toggleVisible = async (item) => {
    setBusyId(item._id);
    try {
      const saved = await updateItem(config.resource, item._id, { visible: !item.visible });
      setItems((list) => list.map((i) => (i._id === saved._id ? saved : i)));
      toast.success(saved.visible ? "Now visible on the site." : "Hidden from the site.");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (item) => {
    if (!window.confirm(`Delete “${config.primary(item)}”? This can't be undone.`)) return;
    setBusyId(item._id);
    try {
      await deleteItem(config.resource, item._id);
      setItems((list) => list.filter((i) => i._id !== item._id));
      toast.success("Deleted.");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusyId(null);
    }
  };

  const onSaved = () => {
    setEditing(null);
    load();
  };

  return (
    <>
      <PageHeader
        title={config.title}
        description={config.description}
        actions={
          <button
            type="button"
            onClick={() => setEditing({})}
            className="flex items-center gap-2 rounded-md bg-blaze px-4 py-2.5 text-sm font-semibold text-white hover:bg-ember"
          >
            <Plus size={16} /> Add {config.singular}
          </button>
        }
      />

      {items && items.length > 6 && (
        <label className="mb-4 flex items-center gap-2 rounded-md border border-line bg-ink-2 px-3 py-2 sm:max-w-sm">
          <Search size={15} className="text-dim" />
          <span className="sr-only">Search {config.title.toLowerCase()}</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${config.title.toLowerCase()}`}
            className="w-full bg-transparent text-sm focus:outline-none"
          />
        </label>
      )}

      {loadError && (
        <div className="rounded-lg border border-blaze/40 bg-blaze/10 p-4 text-sm">
          {loadError}{" "}
          <button type="button" onClick={load} className="underline">
            Try again
          </button>
        </div>
      )}

      {!items && !loadError && (
        <p className="flex items-center gap-2 text-sm text-mute">
          <Loader2 size={16} className="animate-spin" /> Loading…
        </p>
      )}

      {items?.length === 0 && (
        <div className="rounded-lg border border-dashed border-line-strong p-10 text-center text-sm text-mute">
          Nothing here yet. Add your first {config.singular}.
        </div>
      )}

      {visibleItems.length > 0 && (
        <ul className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-ink-2">
          {visibleItems.map((item) => {
            const index = items.indexOf(item);
            const badges = config.badges(item);
            return (
              <li key={item._id} className={cn("flex items-center gap-3 px-3 py-3 sm:px-4", !item.visible && "opacity-55")}>
                <div className="flex flex-col">
                  <button type="button" className={cn(iconButton, "p-1")} onClick={() => move(index, -1)} disabled={Boolean(query) || index === 0} aria-label="Move up">
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    className={cn(iconButton, "p-1")}
                    onClick={() => move(index, 1)}
                    disabled={Boolean(query) || index === items.length - 1}
                    aria-label="Move down"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>
                <span className="w-6 font-mono text-xs text-dim">{String(index + 1).padStart(2, "0")}</span>
                <button type="button" onClick={() => setEditing(item)} className="min-w-0 flex-1 text-left">
                  <p className="truncate text-sm font-medium text-fg">{config.primary(item)}</p>
                  <p className="truncate text-xs text-dim">{config.secondary(item)}</p>
                </button>
                <div className="hidden flex-wrap gap-1 md:flex">
                  {!item.visible && <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-mute">Hidden</span>}
                  {badges.map((badge) => (
                    <span key={badge} className="rounded bg-agent/10 px-1.5 py-0.5 font-mono text-[10px] text-agent">
                      {badge}
                    </span>
                  ))}
                </div>
                <div className="flex items-center">
                  <button type="button" className={iconButton} onClick={() => toggleVisible(item)} disabled={busyId === item._id} aria-label={item.visible ? "Hide" : "Show"} title={item.visible ? "Hide from site" : "Show on site"}>
                    {item.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button type="button" className={iconButton} onClick={() => setEditing(item)} aria-label="Edit" title="Edit">
                    <Pencil size={16} />
                  </button>
                  <button type="button" className={cn(iconButton, "hover:text-blaze")} onClick={() => remove(item)} disabled={busyId === item._id} aria-label="Delete" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {editing && <EditorPanel key={editing._id ?? "new"} config={config} item={editing} onClose={() => setEditing(null)} onSaved={onSaved} />}
    </>
  );
}
