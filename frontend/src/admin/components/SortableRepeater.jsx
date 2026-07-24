import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FiMove, FiX } from "react-icons/fi";

// Shared drag-to-reorder list for repeater fields (Benefits/Features/
// Process/Why Choose Us/Industries) and for the Services list itself. Each
// item needs a stable string `id` (a client-generated key for new/unsaved
// rows is fine - the array's position is what actually persists as
// `sort_order`, not the id). `onReorder` receives the whole re-ordered array.
export function SortableRepeater({ items, onReorder, renderItem, onRemove, getId = (item) => item.id }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((item) => getId(item) === active.id);
    const newIndex = items.findIndex((item) => getId(item) === over.id);
    onReorder(arrayMove(items, oldIndex, newIndex));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map(getId)} strategy={verticalListSortingStrategy}>
        <ul className="space-y-2">
          {items.map((item, index) => (
            <SortableRow key={getId(item)} id={getId(item)} onRemove={onRemove ? () => onRemove(index) : undefined}>
              {renderItem(item, index)}
            </SortableRow>
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

function SortableRow({ id, children, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="flex items-start gap-2 rounded-lg border border-secondary/10 bg-secondary/[0.02] p-3"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        className="mt-1 shrink-0 cursor-grab touch-none rounded p-1 text-secondary/40 hover:bg-secondary/10 hover:text-secondary active:cursor-grabbing"
      >
        <FiMove className="h-4 w-4" />
      </button>
      <div className="min-w-0 flex-1">{children}</div>
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove"
          className="mt-1 shrink-0 rounded p-1 text-secondary/40 hover:bg-red-50 hover:text-red-600"
        >
          <FiX className="h-4 w-4" />
        </button>
      ) : null}
    </li>
  );
}
